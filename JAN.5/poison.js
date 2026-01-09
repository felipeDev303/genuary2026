// Configuración de Tempo: 126 BPM
setcps(126/60/4)

// VITALIC - POISON LIPS
stack(
  // 1. RITMO (Drums: 909 Kit)
  // Kick: Seco y con distorsión (clip)
  s("bd*4")
    .bank("RolandTR909")
    .clip(1.8) // Mucha ganancia de entrada para distorsionar
    .lpf(2500),

  // Snare/Clap
  s("~ [cp,sd]")
    .bank("RolandTR909")
    .gain(0.3)
    .shape(0.6), // Shape añade "suciedad"

  // Hi-Hats: El motor disco
  stack(
    s("hh*16").gain(rand.range(0.2, 0.4)), // Shaker de fondo
    s("~ oh").gain(1).legato(0.2)          // Open hat cortante
  ).bank("RolandTR909"),

  // 2. LÍNEA DE BAJO (Vitalic Style)
  // Usamos 'sawtooth' para esa crudeza analógica
  note("c2 c3 c2 c3 eb2 eb3 f2 f3")
    .s("sawtooth")
    .legato(0.5) // CORRECCIÓN: Controla la duración (staccato)
    .lpf(sine.range(200, 3000).slow(16)) // El filtro que se abre
    .lpq(6)      // Resonancia del filtro
    .clip(0.8)   // Distorsión dura estilo Vitalic
    .delay(0.4).delaytime("8t").delayfeedback(0.5) // Delay a tresillos
    .gain(0.8),

  // 3. PADS / ATMÓSFERA
  // Sonido ancho y dramático
  note("<c4 eb4 g4> <c4 f4 aes4>")
    .s("sawtooth") // Diente de sierra suavizado
    .attack(0.1).release(0.5)
    .lpf(800)
    .jux(rev) // Efecto estéreo
    .gain(0.4)
    .slow(2)
)