// TEMPO: 128 BPM
setcps(128 / 60 / 4);

// DAY 'N' NITE (THE CROOKERS REMIX)
stack(
  // 1. RITMO (Drums House)
  // Kick 909 constante y con pegada (Four on the floor)
  s("bd*4")
    .bank("RolandTR909")
    .clip(2) // Saturación dura
    .lpf(3000),

  // Hi-Hats: El clásic "Hi" Hat" en el contratiempo (Offbeat)
  s("~ hh ~ hh ~ hh ~ hh")
    .s("korgm1_sh")
    //.cut(1) // El 'cut' corta la cola del sonido, haciéndolo seco
    .gain(0.4),

  // Clap en 2 y 4
  s("cp ~ cp ~").s("circuitsdrumtracks_cp").gain(0.3).shape(0.7),

  // Clap refuerzo
  s("[~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x]").s("rolandr8_cp").gain(0.1).shape(0.7),

  // SYNTH 1: EL "BLEEP" DEL CROOKERS REMIX
  // Patrón: G -> F# -> E -> D -> B (Escala de Si Menor)
  note(
    "g4 ~ g4 ~ f#4 ~ f#4 ~ e4 ~ e4 ~ d4 ~ d4 ~ b3 ~ b3 ~ b3 ~ b3  ~ b3 ~ d4  ~ d4 ~ d4 ~"
  )
    .slow(2)
    .s("square") // Onda cuadrada pura = sonido "Nintendo" / Digital agresivo
    // Envolvente tipo "Pluck" (punteo corto)
    .attack(0.01) // Ataque inmediato
    .decay(0.1) // Cae rápido
    .sustain(0.1) // No se mantiene
    .release(0.1) // Se apaga al instante

    // Procesamiento para darle carácter "Electro Trash"
    .clip(0.8) // Saturación digital para que cruja un poco
    .lpf(1000) // Cortamos agudos muy molestos, pero lo dejamos brillante
    .hpf(400) // High Pass Filter: Quitamos graves para limpiar la mezcla

    // Espacialidad
    .delay(0.25)
    .delayfeedback(0.25) // Eco rítmico
    .pan(sine.range(0.3, 0.7).fast(4)) // Movimiento estéreo automático (Lado a lado)
    .gain(0.65)
);
