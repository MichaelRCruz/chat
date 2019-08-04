**after reading please note that it's the result of momentary inspiration and may contain "errors"**

# 0. asymptotic state and Factor-of-Five something using Flag Notation (or whatever you want to call it for now).

> The best way I can get my thoughts down regarding approach is through recollection of a friendly walk-and-talk for some outdoor coffee. My friend, a very bright engineer, politely listened as I babbled.

_Any_ piece of software, simple or complex, designed to compute state requires time to run the process.

Given any level of complexity, you will have an initial `input`, a resulting `state`, and the process it took to get there is casually called a `lifecycle`. If integer 10 is computed with a result of integer `xyz`, then integer `10` represents the input and integer `xyz` represents the resulting state for UI consumption. The computing process it took to arrive to the result is the lifecycle.

Assumptions & Requirements
* A sequence of n, where n =/= 0 || n != 1, lifecycle units represent faultless operation of the software.
* `input = n*10`
* `state = input + 0 + 1`

```
a ~ (10+0+1) ~ z
```

It's okay to think of any integer 10 (base ten for simplicity) as a symbol representing the simplest data structure available in this environment. In fact, consider the next graphic depicting the application's very first lifecycle except we've dramatically increased the complexity a bit on the initial state – a classic example being authentication.

```
a ~ (70+0+1) ~ z
```

##### factor of five treatment
At this point, I want to depict the next concept by destructuring the states into smaller structures for further visualization and more explanation after.

```
a  ~ ( 20+30+20+0+1 ) ~~~~~~~~~~~~~~~ o     <-- destructure
o  ~ ( 10+10+10+10+10+10+10+0+1 ) ~~~ o     <-- further destructure
o  ~ ( 2+2+2+2+2+2+2+0+1/5 ) ~~~~~~~~ o     <-- first factor of 5 treatment
o  ~ ( (2/25)+ ... + 0 + 1/25 ) ~~~~~ o     <-- second factor of 5 treatment
. . .
o  ~ ( (2/n*5)+ ... + 0 + (1/n*5) ) ~ z     <-- nth factor of 5 treatment
```

Notice how the last lifecycle listed contains only symbols `2, 0, 1`. Each supposed data structure has been contracted down by a mathematical factor of five. Remember this is just an illustration. :) The anti-pattern here being a product of 5 distributed back through the lifecycle which serves no purpose other than to reinforce the symbolism and notation.

The last detail on the contraction is the `0` and `1`. These each will represent null state and error state respectively. The symbol, `1`, was chosen because it represents "half-baked" state or _nearly_ no state at all, but ultimately has value of some kind. `0` was chosen because it represents null and any factor of five treatment will never make it not 0. It's unchanging.

> a base unit, `10`, cannot be error by nature.
> and `0` (null) cannot be `1` "error" by nature or hold any value.
> contractions can only exist through the factor of five thing.

Consider three side-by-side-by-side comparisons of a set of contracted lifecyles with a bit of null state and error state mixed in as a requirement.

```
a ~ (10+0+1) ~ z
a ~ (20+0+1) ~ z
a ~ (30+0+1) ~ z
```

Applying the factor of five rule reduces our state into the following notation.

```
a ~ (2+0+1/5) ~ o
o ~ (4+0+1/5) ~ o
o ~ (6+0+1/5) ~ z
```

After reduction we are left with an incremental notation that represents three key important rules.

> null will always be zero
> "error" will always exponentially approach zero and therefore always exist
> null should exist too and should always be zero and therefore innocuous (think in React.js where a component can render without data)

Before any reduction (factor of five), you can "gauge up" or "gauge down" your state by a factor of the base unit, but cannot guage the base unit itself.

```
a ~ (10+0+1) ~ o | a ~ (1+0+1/10) ~ x   <--- "error", you can't gauge the base unit, 10
o ~ (20+0+1) ~ o | x ~ (2+0+1/10) ~ x
o ~ (30+0+1) ~ o | x ~ (3+0+1/10) ~ x
o ~ (40+0+1) ~ z | x ~ (4+0+1/10) ~ z
```

###### furthest possible reduction

Now what you see above is a pretty straightforward way to represent some sort of meta-like substate "gauging" up or "gauging" down the scope. Take a look at the first lifecycle. You cannot gauge base unit, 10. 10 is the _least_ complex state can be.

>`a`, `x`, `z` all symbolize time in a linear fashion form `a` to `z` likewise for `x` and `o` but as intermediate states with x being within any incremental gauge.

TODO: stuff
