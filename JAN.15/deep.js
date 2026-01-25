// Ambient Pad - La Cueva del Arquitecto (Black Hole Edition)
// Aesthetic: Cosmic Horror, Vastness, Time Dilation

setCps(60 / 60 / 4);

$: stack(
  // 1. PAD PRINCIPAL (Horizonte de Sucesos)
  // Agregamos 'jux(rev)' para hacerlo inmensamente estéreo
  "<Dm9 Am9 Em9 Bm9>"
    .voicings("lefthand")
    .superimpose((x) => x.add(0.1)) // Desafinación ligera
    .add(perlin.range(-0.03, 0.03)) // "Drift" analógico
    .note()
    .sound("supersaw")
    .gain(0.06)
    .cutoff(perlin.range(200, 800).slow(4)) // El filtro respira más orgánico
    .resonance(0.2)
    .attack(4).decay(3).sustain(0.8).release(6) // Ataques aún más lentos
    .room(0.98) // Reverb casi infinita
    .size(0.95)
    .jux(rev) // <--- MAGIA: Envía una copia invertida al canal derecho
    .lpf(1200)
    .slow(16),
  
  // 2. SUB DRONE (La Gravedad)
  // Añadimos 'shape' para saturarlo un poco y que se sienta el peso
  note("<d1 a0 e1 b0>")
    .sound("sine")
    .gain(0.1) // Un poco más de presencia
    .shape(0.3) // Saturación suave
    .attack(4).decay(2).sustain(0.9).release(6)
    .slow(16),
  
  // 3. TEXTURA ALTA (Radiación Hawking)
  // Usamos 'crush' para destruir la señal y que suene a "datos corruptos"
  note("<d5 a4 e5 b4>")
    .add(perlin.range(-0.2, 0.2)) // Mucha inestabilidad de tono
    .sound("triangle")
    .gain(0.025)
    .crush(4) // <--- BITCRUSH: Efecto de baja fidelidad/digital
    .attack(2).release(4)
    .room(0.9)
    .pan(perlin.range(0, 1).slow(2)) // Movimiento lento en el estéreo
    .slow(16),

  // 4. NUEVA CAPA: VIENTO SOLAR (Ruido)
  // Genera esa sensación de vacío espacial
  s("wind")
    .gain(0.03)
    .lpf(sine.range(200, 1000).slow(32)) // Filtro subiendo y bajando muy lento
    .hpf(100)
    .pan(sine.range(0.2, 0.8).slow(8))
);