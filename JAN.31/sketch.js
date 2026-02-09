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


      // === LÍNEAS DE CONTORNO Y COLOR ===

      // Creación de líneas de contorno usando la función seno sobre el ruido final.
      // Multiplicamos 'f' para aumentar la densidad de líneas.
      float lines = sin(f * 40.0);
      // Usamos smoothstep para afilar la onda seno y convertirla en líneas finas.
      lines = smoothstep(0.90, 0.98, lines);

      // Paleta Índigo Intenso (Azul Astuto)
      vec3 colorBg = vec3(0.08, 0.05, 0.25); // Fondo índigo muy oscuro
      vec3 colorLines = vec3(0.3, 0.4, 0.9); // Líneas azul eléctrico más claro
      
      // Mezclamos el fondo con el color de línea basado en el cálculo de contorno
      vec3 finalColor = mix(colorBg, colorLines, lines);
      
      // Opcional: añadir un poco de la variación del ruido 'f' al fondo para darle profundidad
      finalColor += f * f * vec3(0.1, 0.05, 0.2);

      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// ==========================================================================
// P5.JS SETUP & DRAW
// ==========================================================================
function setup() {
  // Creamos el canvas en modo WEBGL para usar shaders
  createCanvas(windowWidth, windowHeight, WEBGL);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
