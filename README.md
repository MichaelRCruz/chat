###### _preface_

> This project started as an exploration into Firebase and React's Context and Hooks API. They all ended up being pretty cool. 😎

### Approach

The best way I can get my thoughts down regarding approach is through recollection of a friendly walk-and-talk for some outdoor coffee. My friend, a very bright engineer, politely listened. Here's how it went.

_Any_ piece of software, simple or complex, designed to compute state requires time to run the process.

To illustrate, with a tiny bit of complexity, you will have an initial input and the resulting state. We can call the combination of the two a lifecycle. Consider an initial input of integer 5. Computing the sum of integer 5 with 2 returns 7. The resulting integer 7 is the initial state. The timeline to get to the initial state is the lifecycle.

As a few assumptions, we'll say the resulting state of any lifecycle, barring the last, is the initial state of the next lifecycle. Additionally, a series of lifecycles represents faultless operation.

5 ->- (5+2) ->- 7
7 ->- (7-3) ->- 4
4 ->- (4*5) -> 20

TODO: stuff
