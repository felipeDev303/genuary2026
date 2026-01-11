let chords = n("<0 2 4 6>").scale(
  "<E3:minor E3:minor G3:minor <D3:minor D3:major>>"
);
let synthReverbCtrl = slider(0.556);
let synthGainCtrl = slider(0.37, 0, 1);
let bassGainCtrl = slider(0.475, 0, 1);

stack(
  stack(
    s("rolandtr808_sh")
      .struct("[1 1 1 1]*4")
      .delay(0.1)
      .gain("[0.05 0.2 0.5 0.2]*4"),
    s("rolandtr808_perc").struct("1 0 0 0 0 0 1 0").delay(".2").gain("0.6"),

    n("<[0,2,4,6,9] [2,4,6,8,11] [4,6,8,11,2] [6,8,11,2,4]>")
      .scale("<E3:minor E3:minor G3:minor <D3:minor D3:minor>>")
      .struct("<[x] [x] [x] [x]>")
      .s("gm_epiano2:2")
      .delay(0.3)
      .room(0.35)
      .lpf(1200)
      .hpf(150)
      .gain(0.65)
      .velocity(sine.range(0.5, 0.7).slow(8))
  )
    .mask("<1 1 1 1 1 1 1 1>/4")
    ._pianoroll(),

  stack(
    s("rolandtr707_bd:2")
      .struct("[1 0 1 0 1 0 1 0]")
      .room(0.06)
      .gain("<.4 .8 .8 .8 .8 .8 1.5 1.5>/4")
  ).mask("<0 0 1 1 1 1 1 1>/4"),

  stack(
    s("rolandtr808_rim:4").euclidRot(5, 16, 1).gain(0.5),
    n("<0 3 -2 5>")
      .scale("E2:minor")
      .s("gm_synth_bass_2")
      .struct("1 [0 1] [0 1] 0 0 1 <0 [0 1]> 0")
      .gain(bassGainCtrl)
  ).mask("<0 0 1 1 1 1 1 1>/4"),

  stack(
    s("rolandtr808_oh")
      .struct("[0 1 0 1 0 1 0 1]")
      .delay(0.1)
      .room(0.1)
      .gain(0.8),
    s("rolandtr808_cp").struct("0 0 1 0 0 0 1 0").room(0.4).gain(0.7)
  ).mask("<0 0 0 1 1 1 1 1>/4"),

  stack(
    s("jazz:6")
      .euclidRot(9, 16, 3)
      .lpf(perlin.range(400, 3000))
      .room(0.03)
      .gain("<.02 .04 .06 .08 .1 .15 [.3 .35 .4 .45] [.5 .55 .6 .65]>/4"),

    n("1 <0 3> 3 2 2 1 0 1")
      .chord("<Em7 Gmaj7 Dm7 Am7>")
      .dict("lefthand")
      .voicing()
      .add(note("<0 7 12 19>").slow(4))
      .s("gm_lead_2_sawtooth:4")
      .lpf(perlin.range(600, 2500))
      .hpf(200)
      .delay(synthReverbCtrl)
      .room(synthReverbCtrl)
      .fast(2)
      .gain(synthGainCtrl.mul(0.65))
  )
    .mask("<0 0 0 0 1 1 1 1>/4")
    ._pianoroll()
)
  .markcss("background:red")
  .scope();
