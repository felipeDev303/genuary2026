setCps(168 / 60 / 4);

let drone = stack(
  "<Am7 Em7 Gm7 Bb7>"
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
    .lpf(slider(1695.7, 300, 2000)),
)
  .slow(6)
  .color("blue");

let bassline = arrange(
  [6, "<e2 e1>".note().euclid(3, 8)],
  [6, "<g2 g1>".note().euclid(3, 8)],
  [6, "<bb2 bb1>".note().euclid(3, 8)],
  [6, "<c2 c1>".note().euclid(3, 8)],
)
  .add(perlin.range(0, 0.15))
  .gain(slider(0.9, 0, 1))
  .add(perlin.range(0, 0.55))
  .room(0.5)
  .punchcard();

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

let breakbeat = s("breaks-main:1")
  .slice(8, b2.every(4, rev()))
  .degradeBy(0)
  .add(perlin.range(0, 0.4))
  .superimpose((x) => x.add(0.15))
  .hpf(slider(2500, 50, 3000))
  .room(0.2)
  .gain(slider(0.6, 0, 1))
  .speed(1);

a: stack(
  tam,
  //bo_1,bo_2
);

b: stack(bassline, breakbeat);

s("bd*4").lpf(1000).room(0.5);
