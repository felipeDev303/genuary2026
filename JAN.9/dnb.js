setCps(160/60/4)

$: s("breaks-main:4/2")
  .fit()
  .scrub(
    irand(16)
      .div(16)
      .seg(8)
      .rib(5,.5)
  )
  .orbit(2)           // menos separación espacial
  .room(.35)
  .size(.6)
  .decay(.45)
  .gain(.28)
  .hp(80)
  .lp(9000)
  ._punchcard()

// =====================
// KICK – redondo y profundo
// =====================
$: s("rolandtr909_bd:2")
  .beat("0,10",16)
  .lp(180)
  .gain(.55)
  ._punchcard()

// =====================
// SNARE – suave y líquida
// =====================
$: s("rolandtr808_sd:6")
  .beat("4,12",16)
  .room(.3)
  .size(.4)
  .gain(.4)
  ._punchcard()

// =====================
// HI-HATS – shimmer
// =====================
$: s("rhythmace_hh!8")
  .decay(tri.range(0.04,0.12).slow(2))
  .pan(sine.range(-.3,.3))
  .gain(.45)
  ._punchcard()


$: s("rolandtr808_rim")
  .struct(rand.mul(.65).round().seg(16).rib(3,2)).gain(.4)._punchcard()


$: s("pad-main:5")
  .scrub("0@6 0@4".add("<.25@3 .15>"))
  .att(.6)
  .rel(1.8)
  .room(.7)
  .size(.9)
  .gain(1)

_$: s("pulse!8")
  .fm(time.div(4))
  .fmh(time.div(8))
  .room(.8)
  .size(.9)
  .gain(.2)

$: s("bass:2")
  .scrub(
    perlin
      .range(.18,.26)
      .slow(2)
      .seg("8 8 4 8")
  )
  .lp(180)
  .att(.02)
  .rel(.3)
  .phaser(.35)
  .delay(.15)
  .delaytime(.25)
  .gain(.45)
  ._scope()
