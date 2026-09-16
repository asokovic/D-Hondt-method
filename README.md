# D'Hondt method
**D'Hondt method** is a highest-averages apportionment method for allocating seats in parliament among competing political parties, in proportion to the number of votes each one received.



## Idea

Most parliamentary systems that use proportional representation need a deterministic way to turn vote counts into a table of seats, one that stays proportional without producing fractional seats. The D'Hondt method solves this with repeated division: it hands out seats one at a time, always to whichever party currently "deserves" the next seat most.

This project implements the method as a small browser tool, with an optional preset for Serbia's parliamentary election rules including an electoral threshold and an exemption/multiplier for national minority parties. 

## Method

Let there be $p$ parties competing for $s$ seats, where party $i$ received $v_i$ votes.

For $s$ rounds, and for every party $i$ still in the running, compute the quotient:
$$q_i = \frac{v_i}{n_i + 1}$$
where $n_i$ is the number of seats party $i$ has already been awarded. The seat for that round goes to whichever party has the highest $q_i$, its seat count $n_i$ is incremented, and the process repeats until all $s$ seats are allocated.

If two parties tie on quotient, the party with more raw votes wins the seat.

Before the quotient rounds run, a party can be **excluded** (its votes never enter the calculation) if it falls under an electoral threshold.


## Additional rules
Many countries that use D'Hondt method implement their own set of subrules. For now, only the rules used in Serbian Parliamentary elections are implemented.
### Serbia preset

- Parties need **3%** of the total votes cast to win any seats (editable in the UI, since thresholds vary by country and by election).
- The threshold is measured against **all votes cast**, invalid/blank ballots included - not just the sum of party votes.
- Parties representing **national minorities** are exempt from the threshold, and their votes are multiplied by **1.35** before seats are allocated.

## About

This is a static, dependency-free web app build using plain HTML, CSS, and JavaScript. Given a list of parties and their votes, it:

- runs the D'Hondt allocation above and shows the resulting seats per party,
- displays a semicircular hemicycle chart of the resulting parliament,
- reports vote share, seat share, and (optionally) turnout, once "registered voters" and/or "total votes cast" are filled in,
- lets you step through the calculation round by round in a quotient table,
- switches between a **Basic** mode (custom threshold, no special rules) and a **Serbia** mode (threshold + minority-party rules) via a mode toggle.

## Running the program

You can run the simulation by visiting the following [link](https://projects.andrijasokovic.com/d-hondt/)

## Future updates

Future updates of this project will focus on implementing the rules found in other legislatures and additional country-specific presets.