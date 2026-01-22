setCps(168 / 60 / 4);

let drone = stack(
  "<Am7 Gm7 C7 F^7 Bm7 E7>"
    .voicings("lefthand")
    .superimpose((x) => x.add(0.15))
    .add(perlin.range(0, 0.05))
    .note()
    .s("supersaw")
    .gain(0.05)
    .velocity("<0.9 0.95 1>")
    .cutoff(500)
    .attack(0.9)
    .delay(0.5)
    .room(0.6)
    .lpf(slider(2000, 300, 4000)),
)
  .slow(6)
  .color("blue");

// --- AQUÍ ESTÁ EL TRUCO ---
// 1. Definimos el patrón rítmico del bajo por separado
let p1 = "<e2 e1>".note().euclid(3, 8);
let p2 = "<g2 g1>".note().euclid(3, 8);
let p3 = "<bb2 bb1>".note().euclid(3, 8);
let p4 = "<c2 c1>".note().euclid(3, 8);

// 2. El bajo real (Sonido grave)
let bassline = arrange([6, p1], [6, p2], [6, p3], [6, p4])
  .add(perlin.range(0, 0.15))
  .gain(slider(0.693, 0, 1))
  .add(perlin.range(0, 0.55))
  .room(0.5)
  .punchcard();

// 3. LA SEÑAL DE SINCRONIZACIÓN (Sonido agudo fantasma)
// Usa el MISMO ritmo que el bajo, pero suena como un hi-hat suave
let sync_signal = arrange([6, p1], [6, p2], [6, p3], [6, p4])
  .s("hh") // Sonido agudo y corto
  .gain(2) // Volumen suficiente para que p5 lo escuche
  .hpf(2000); // Filtro paso alto: solo frecuencias muy agudas (para separar del bombo)

drone: drone;

let tam = s("tambourine2*8").room(0.2).gain(perlin.range(0.2, 0.5));

let bo_1 = "[E2 C2 ~!6]"
  .note()
  .s("bongo")
  .echo(5, 1 / 4, 0.2)
  .room(0.9)
  .delay(0.3)
  .gain(1.5)
  .mask("<1 0!8>")
  .pianoroll();

let bo_2 = "[F2 F#2 ~!6]"
  .note()
  .s("bongo")
  .echo(5, 1 / 4, 0.2)
  .room(0.9)
  .delay(0.3)
  .gain(1.5)
  .mask("<1 0!8>")
  .pianoroll();

let b1 = "0 ~!3 [2 3] ~!3";
let b2 = "0 1 <2 2*2> 3 <[3, 4] [0 4]> 5 6 7";

let breakbeat = s("breaks165")
  .slice(8, b2.every(4, rev()))
  .degradeBy(0)
  .add(perlin.range(0, 0.4))
  .superimpose((x) => x.add(0.15))
  .hpf(slider(929.1, 50, 3000))
  .room(0.2)
  .gain(slider(0.651, 0, 1))
  .speed(1);

a: stack(tam, bo_1, bo_2);

// Agregamos la señal de sync al stack final
b: stack(bassline, breakbeat, sync_signal);
