###### _preface_

> This project started as an exploration into Firebase and React's Context and Hooks API. They all ended up being pretty cool. 😎

### thoughts

The best way I can get my thoughts down regarding approach is through recollection of a friendly walk-and-talk for some outdoor coffee. My friend, a very bright engineer, politely listened. Here's how it went.

_Any_ piece of software, simple or complex, designed to compute state requires time to run the process.

Given any level of complexity, you will have an initial `input`, a resulting `state`, and the combination thereof casually called a `lifecycle`. If integer 5 is computed with a result of integer 7, then integer 5 represents the input, integer 7 represents the state, and the computing process it took to arrive to the result is the lifecycle.

Assumptions & Requirements
* The resulting state of any lifecycle, barring the last, is the initial state of the subsequent lifecycle.
* A sequence of n, where n =/= 0, lifecycles represents faultless operation of the software.
* `input = n*5`
* `state = input + (n*5)`

```
0  ~ (0+10) ~~~ 10
10 ~ (10+0) ~~~ 10
10 ~ (10+10) ~~ 20
20 ~ (20) ~~~~~ 20
20 ~ () ~~~~~~~ 20
20 ~ (20+5) ~~~ 25
```

It's okay to think of any integer 5 or any 0 as a symbol representing the simplest data structure available in this environment.

TODO: stuff
