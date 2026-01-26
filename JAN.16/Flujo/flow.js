setcps(1)
stack(
  n("0 | 2 | 3 | 4 | 1 | 6 | 5  | 7").scale("A:minor")
  .slow(4)
  .room(0.5)
  .delay(0.5)
  .jux(rev)
  .sound("gm_pad_bowed")
  .hush()
  ,


  voicing("Am | C | Em | G")
  .slow(8)
  .gain(0.5)
  .room(0.5)
  .delay(1)
  .jux(rev)
  .sound("gm_pad_halo")
  .hush()
  ,

  // bass
  note("a2 | b2 | e2 | g2")
  .room(0.5)
  .delay(0.5)
  .slow(4)
  .jux(rev)
  .sound("z_triangle")
  .hush()
  ,

  n("<0@4 ~ ~ ~ 4@4 ~ ~ ~ >").scale("A:pentatonic")
  .slow(2)
  .delay(1)
  .room(0.6)
  .sound("gm_seashore")
  .jux(rev)
  // .hush()
  ,
).pianoroll({vertical:true})