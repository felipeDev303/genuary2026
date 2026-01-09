// === SETUP ===
setCpm(174 / 4); // Tempo estándar de DnB
setGainCurve((x) => Math.pow(x, 2)); // Curva de ganancia exponencial para más pegada

// === FIBONACCI DRUM RACK ===
$drums: stack(
  // 1. KICK (Bombo)
  // Patrón clásico: Golpe en el 1 y sincopa en el paso 10.5
  s("bd:3").beat("0, 10.5", 16).shape(0.6).gain(0.9),

  // 2. SNARE (Caja)
  // Golpes sólidos en el 2 y el 4 (pasos 4 y 12)
  s("sd:2").beat("4, 12", 16).clip(1).hpf(150),

  // 3. GHOST SNARES (Rellenos)
  // Notas fantasma suaves para dar groove
  s("sd:2").beat("7, 9, 15", 16).gain(0.25).hpf(300),

  // 4. FIBONACCI HI-HATS (El núcleo)
  // x(5,8) -> 5 golpes en 8 tiempos (Fibo 5 y 8)
  // Se alterna con x(8,13) -> 8 golpes en 13 tiempos (Fibo 8 y 13)
  s("hh:4")
    .struct("<x(5,8) x(8,13)>")
    .speed("1.5") // Pitch más alto para que sea "crispy"
    .pan(sine.slow(4).range(-0.2, 0.2)) // Movimiento estéreo sutil
    .gain(0.55),

  // 5. RIDE/SHAKER DE FONDO
  // Mantiene el pulso constante para unir los polirritmos
  s("hh:2").struct("x*16").gain(0.15).hpf(5000)
)
  .orbit(1)
  .scope();

// === DRUM & BASS SETUP ===
setCpm(174 / 4);

// === SIMPLE ROLLING ACID BASS ===
// === Alternador de bajo: solo uno activo a la vez ===
// Para evitar solapamiento, comenta el bajo que NO quieras usar.

// $bass: s("sawtooth")
//   // 1. NOTA BASE SÓLIDA
//   .n("<f0 f0 f0 c0>")
//   .struct("x*8")
//   .sub("[0 12]".fast(2))
//   .lpf(sine.slow(8).range(100, 800))
//   .lpq(5)
//   .shape(0.5)
//   .clip(1)
//   .gain(0.7)
//   .orbit(2);
// === BASS ÁCIDO MINIMALISTA FIBONACCI ===
$bassFibo: s("sawtooth")
  // Secuencia de notas basada en Fibonacci (5 notas)
  .n("<f0 c0 g0 d1 a1>")
  // Estructura rítmica polimétrica Fibonacci
  .struct("x(5,8) x(8,13)")
  // Salto de octava ácido
  .sub("[0 12]".fast(3))
  // Filtro ácido con envolvente minimalista
  .lpf(sine.slow(13).range(150, 600))
  .lpq(10)
  // Distorsión sutil para textura
  .distort("1.8:.2")
  // Sidechain suave para dejar espacio al kick
  .shape(0.7)
  .gain(0.5)
  .orbit(3);
