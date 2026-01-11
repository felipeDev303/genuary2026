setcps(0.25);

stack(
  note("c5 ~ eb5 ~ ~ g4 ~ ~ bb4 ~ ~ ~ ~ ab4 ~ ~".slow(2))
    .s("piano")
    .release(5)
    .room(0.95)
    .delay(0.6)
    .delaytime(0.375)
    .delayfeedback(0.55)
    .gain(0.45)
    .color("#FF6B35"),

  note("<[c4,eb4,g4,c5] [ab3,c4,eb4,ab4] [bb3,d4,f4,bb4] [g3,bb3,d4,g4]>")
    .s("gm_lead_4_chiff")
    .arp("0 1 2 3")
    .slow(8)
    .room(0.85)
    .delay(0.8)
    .delaytime(0.5)
    .delayfeedback(0.4)
    .gain(0.2)
    .color("#BDEDE0"),

  note("<[c3,eb3,g3] [ab2,c3,eb3] [bb2,d3,f3] [g2,bb2,d3]>")
    .s("gm_pad_sweep")
    .slow(16)
    .room(0.95)
    .size(0.9)
    .gain(0.25)
    .color("#EDDDD4"),

  note("c2 ~ ~ ~ ab1 ~ ~ ~ bb1 ~ ~ ~ g1 ~ ~ ~".slow(4))
    .s("sine")
    .ad(0.2, 2)
    .room(0.7)
    .gain(0.5)
    .color("#6F58C9"),

  note(
    "~ ~ ~ c3 ~ ~ ~ ~ ~ ~ ab2 ~ ~ ~ ~ ~ ~ ~ ~ bb2 ~ ~ ~ ~ ~ ~ ~ g2 ~".slow(4)
  )
    .s("gm_choir_ahhs")
    .release(6)
    .room(0.95)
    .gain(0.2)
    .color("#6F58C9")
);
