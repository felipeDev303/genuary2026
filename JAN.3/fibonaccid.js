// Fibonaccid en Strudel
setCps(140 / 60 / 4);

$: s("linndrum_bd!4")
  .distort("3:3.")
  ._scope()
  .duck("2:3:4")
  .duckattack(0.2)
  .duckdepth(0.8);

$bass: n(irand(10).sub(7).seg(16))
  .scale("e:minor")
  .rib(46, 1)
  .distort("2.2:.3")
  .s("sawtooth")
  .lpf(200)
  .lpenv(slider(5.888, 0, 8))
  .lpq(12)
  .orbit(2)
  ._pianoroll();

$: s("supersaw")
  .detune(1)
  .rel(5)
  .beat(2, 32)
  .slow(2)
  .orbit(3)
  .fm("2")
  .fmh(2.04)
  .room(1)
  .roomsize(6);
