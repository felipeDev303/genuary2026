setcpm(120/4)

const  fib = "<0 1 1 2 3 5 8 13 21 34 55>"

$: 
  n(fib)
  .scale("c:minor")
  .s("piano")
  .lpf(600)
  .struct("x ~ x ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x")
  .delay(0.3)
  .room(0.7)
  .postgain(0.35)