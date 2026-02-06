// =====================================
// JAN.27 - Bioluminescent Larva
// Lifeform: A shape that behaves as if alive
// Inspired by Phengodidae (railroad worm)
// =====================================

let shader_larva;

// Vertex shader - simple pass-through
const vert = `
  precision highp float;
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;
  
  void main() {
    vTexCoord = aTexCoord;
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
  }
`;

// Fragment shader - Bioluminescent Larva
const frag = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  
  #define PI 3.14159265359
  #define TAU 6.28318530718
  
  // Number of body segments (like the real larva ~11)
  #define NUM_SEGMENTS 11
  
  // ========== MAIN ==========
  void main() {
    // Screen-space coordinates centered at origin
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv - 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    
    vec3 col = vec3(0.0);
    
    // Subtle body silhouette (dark green, barely visible)
    float bodySil = 0.0;
    
    // Create segments along curved larva body
    for(int i = 0; i < NUM_SEGMENTS; i++) {
      float t = float(i) / float(NUM_SEGMENTS - 1);  // 0 to 1 along body
      
      // Horizontal position - wider spread like real larva
      float bodyX = mix(-0.22, 0.22, t);
      
      // Curved body shape - subtle arc (less pronounced)
      float curve = sin(t * PI * 1.3 - 0.3) * 0.025;
      curve -= (t - 0.5) * (t - 0.5) * 0.04;  // Slight parabolic adjustment
      
      // Very subtle movement wave
      float movementPhase = u_time * 0.3;
      curve += sin(t * TAU + movementPhase) * 0.008;
      
      float bodyY = curve;
      
      // Segment size - larger in middle, tapered ends
      float sizeFactor = sin(t * PI) * 0.6 + 0.4;
      
      // More aggressive taper at tail
      if(t > 0.75) {
        sizeFactor *= 1.0 - (t - 0.75) * 2.5;
      }
      // Slight taper at head
      if(t < 0.1) {
        sizeFactor *= 0.7 + t * 3.0;
      }
      
      sizeFactor = max(sizeFactor, 0.15);
      
      // Small, defined spots
      float spotSize = 0.005 * sizeFactor + 0.002;
      
      // Tight glow radius for sharper spots
      float glowRadius = spotSize * 2.5;
      
      // Subtle pulsing - wave along body
      float pulse = sin(u_time * 0.8 - float(i) * 0.3) * 0.15 + 0.85;
      
      // Paired spots spacing - more separated like real larva
      float spotSpacing = 0.018 * sizeFactor + 0.008;
      
      // Spot positions
      vec2 spotUpper = vec2(bodyX, bodyY + spotSpacing);
      vec2 spotLower = vec2(bodyX, bodyY - spotSpacing);
      
      // Distance calculations
      float distUpper = length(uv - spotUpper);
      float distLower = length(uv - spotLower);
      
      // Sharp core with minimal glow
      float coreUpper = smoothstep(spotSize, spotSize * 0.2, distUpper);
      float coreLower = smoothstep(spotSize, spotSize * 0.2, distLower);
      
      // Subtle glow halo
      float glowUpper = smoothstep(glowRadius, spotSize, distUpper) * 0.3;
      float glowLower = smoothstep(glowRadius, spotSize, distLower) * 0.3;
      
      // Combine - more emphasis on sharp core
      float intensity = (coreUpper + coreLower) + (glowUpper + glowLower);
      intensity *= pulse;
      
      // Yellow-green bioluminescence
      vec3 glowColor = vec3(0.75, 1.0, 0.25);
      
      // Slightly brighter/warmer at head
      if(t < 0.2) {
        glowColor = mix(vec3(0.9, 1.0, 0.3), glowColor, t / 0.2);
        intensity *= 1.2;  // Head spots slightly brighter
      }
      
      col += glowColor * intensity * 0.6;
      
      // Add to body silhouette
      float bodyDist = length(uv - vec2(bodyX, bodyY));
      float segmentRadius = 0.018 * sizeFactor;
      bodySil = max(bodySil, smoothstep(segmentRadius * 1.5, segmentRadius * 0.5, bodyDist));
    }
    
    // Add head glow (distinct like in photo)
    vec2 headPos = vec2(-0.24, sin(PI * 1.3 - 0.3) * 0.06 - 0.25 * 0.25 * 0.15);
    headPos.y = sin(0.0 * PI * 1.3 - 0.3) * 0.06 - (0.0 - 0.5) * (0.0 - 0.5) * 0.15;
    headPos.x = -0.22;
    float headDist = length(uv - headPos);
    float headGlow = smoothstep(0.025, 0.005, headDist);
    col += vec3(0.9, 0.95, 0.35) * headGlow * 0.4;
    
    // Very subtle dark body silhouette
    vec3 bodyColor = vec3(0.02, 0.04, 0.01);
    col = mix(col, col + bodyColor, bodySil * 0.15);
    
    // Minimal tone mapping to preserve sharp spots
    col = min(col, vec3(1.2));
    col = pow(col, vec3(0.95));
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  noStroke();
  
  shader_larva = createShader(vert, frag);
}

function draw() {
  background(0);
  
  shader(shader_larva);
  
  shader_larva.setUniform('u_resolution', [width, height]);
  shader_larva.setUniform('u_time', millis() / 1000.0);
  
  rect(-width/2, -height/2, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
