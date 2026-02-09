let myShader;

// ==========================================================================
// VERTEX SHADER (Procesa la geometría - muy simple aquí)
// ==========================================================================
const vertShaderStr = `
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;

  void main() {
    vTexCoord = aTexCoord;
    // Pone un rectángulo que cubre toda la pantalla (clip space de -1 a 1)
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
  }
`;

// ==========================================================================
// FRAGMENT SHADER (Aquí ocurre la magia por píxel)
// ==========================================================================
const fragShaderStr = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform vec2 u_resolution;
  uniform float u_time;

  // --- Funciones de Ruido (Random y Noise) ---
  // Fuente común para ruido 2D eficiente
  vec2 random2(vec2 st){
      st = vec2( dot(st,vec2(127.1,311.7)),
                dot(st,vec2(269.5,183.3)) );
      return -1.0 + 2.0*fract(sin(st)*43758.5453123);
  }

  // Ruido de Perlin (Gradient Noise) básico
  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      vec2 u = f*f*(3.0-2.0*f); // smoothstep cúbico

      return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                       dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                  mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                       dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
  }
  // ------------------------------------------

  void main() {
      // 1. Normalizar coordenadas y corregir aspecto
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      st.x *= u_resolution.x / u_resolution.y;

      // Escala del espacio y animación lenta
      vec2 p = st * 3.0; 
      float t = u_time * 0.2;

      // === DOMAIN WARPING (Deformación de Dominio) ===
      
      // CAPA 1 DE DISTORSIÓN:
      // Calculamos un desplazamiento 'q' basado en el ruido de la posición 'p'.
      // Usamos offsets en el tiempo y espacio para obtener un vector 2D.
      vec2 q = vec2(0.0);
      q.x = noise(p + vec2(0.0, t));
      q.y = noise(p + vec2(5.2, 1.3 * t));

      // CAPA 2 DE DISTORSIÓN:
      // Calculamos un segundo desplazamiento 'r', basado en la posición 'p' 
      // YA deformada por 'q'. Esto crea la complejidad.
      vec2 r = vec2(0.0);
      // Multiplicamos 'q' para controlar la intensidad de la primera deformación
      r.x = noise(p + 1.5 * q + vec2(1.7, 9.2 + 0.15*t));
      r.y = noise(p + 1.5 * q + vec2(8.3, 2.8 + 0.126*t));

      // RUIDO FINAL:
      // Muestreamos el ruido final usando la posición 'p' deformada por la segunda capa 'r'.
      float f = noise(p + 1.5 * r);
      
      // =============================================


      // === PALETA CIELO - LA NOCHE ESTRELLADA (LÚGUBRE) ===
      vec3 pureBlack = vec3(0.0, 0.0, 0.02);              // Negro casi puro
      vec3 chosenBlue = vec3(0.02, 0.05, 0.12);           // Azul noche muy oscuro
      vec3 starSapphire = vec3(0.05, 0.12, 0.28);         // Azul profundo oscurecido
      vec3 natureBlue = vec3(0.15, 0.30, 0.55);           // Azul medio más apagado
      vec3 turquoise = vec3(0.35, 0.55, 0.65);            // Turquesa más tenue

      // === LÍNEAS DE CONTORNO (MÚLTIPLES CAPAS DE RUIDO) ===
      // Capa 1: Líneas principales densas
      float lines1 = sin(f * 60.0);
      lines1 = smoothstep(0.85, 0.95, lines1);
      
      // Capa 2: Líneas medianas
      float lines2 = sin(f * 35.0 + 1.2);
      lines2 = smoothstep(0.88, 0.96, lines2) * 0.6;
      
      // Capa 3: Líneas finas sutiles
      float lines3 = sin(f * 80.0 + 2.5);
      lines3 = smoothstep(0.92, 0.98, lines3) * 0.3;

      // === GRADIENTE DEL CIELO (CON NEGRO) ===
      float t_color = f * 0.5 + 0.5;
      vec3 skyColor = mix(pureBlack, chosenBlue, smoothstep(0.0, 0.25, t_color));
      skyColor = mix(skyColor, starSapphire, smoothstep(0.25, 0.5, t_color));
      skyColor = mix(skyColor, natureBlue, smoothstep(0.5, 0.8, t_color));
      
      // Aplicar todas las capas de líneas
      vec3 finalColor = mix(skyColor, turquoise, lines1);
      finalColor = mix(finalColor, natureBlue * 1.3, lines2);
      finalColor = mix(finalColor, turquoise * 0.8, lines3);
      
      // Profundidad y textura adicional
      finalColor += vec3(0.01, 0.02, 0.04) * (f * f);

      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// ==========================================================================
// P5.JS SETUP & DRAW
// ==========================================================================
function setup() {
  // Canvas vertical para redes sociales (1080x1920)
  createCanvas(1080, 1920, WEBGL);
  noStroke();

  // Creamos el shader con las cadenas de texto definidas arriba
  myShader = createShader(vertShaderStr, fragShaderStr);
}

function draw() {
  // Activamos el shader
  shader(myShader);

  // Enviamos los "uniforms" (datos constantes por frame) a la GPU
  myShader.setUniform("u_resolution", [width, height]);
  myShader.setUniform("u_time", millis() / 1000.0);

  // Dibujamos un rectángulo que cubre toda la pantalla.
  // El shader se aplicará a cada píxel de este rectángulo.
  rect(0, 0, width, height);
}

// Canvas fijo para redes sociales, no redimensionar
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }
