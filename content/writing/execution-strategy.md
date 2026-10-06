---
title: Efficient Executions in Blood on the Clocktower
summary: A statistical analysis of why you should {always/almost never} execute players who want to die.
date: 2026-09-25
tags: blood-on-the-clocktower, probability, strategy

draft: true
---

A lot of times, when playing Trouble Brewing, I hear the following phrase said a lot: "execute me now, I don't want to be a frame on final 3".

**never, ever ever be willing to die because you're a "frame".**

In an 8 player game, good team has 3 executions. This increases to 5 for 12 player games. Let's model $P(win)$ as the probability that the player you execute will cause you to win the game. 

Normally, on Day 1, we probably won't have much information. But fortunately, we will be able to quickly clear many Demon candidates immediately.

# Pure Random

Let's say there's no Scarlet Woman. You skip on even and execute on odd. Maybe you're trusted, maybe you're not. If town trusts you, they'll never execute you, but the Demon might kill you in the night. Using purely random executions, the probability that good team wins is:

| Players | $P(\text{win}\mid\lnot\text{trusted}\land\lnot\text{scarlet woman})$ | $P(\text{win}\mid\text{trusted}\land\lnot\text{scarlet woman})$ |
| --- | --- | --- |
| 8   | 54.3% | 60.9%
| 9   | 59.4% | 65.9%
| 10  | 59.4% | 64.0% 
| 11  | 63.1% | 74.5% 
| 12  | 63.1% | 74.5%

The addition of a Scarlet Woman being a possibility changes things. If one is in play, good team needs to execute the correct player twice, on average, or the Demon in final 3. This changes things pretty significantly:

| Players | $P(\text{win}\mid\lnot\text{trusted})$ | $P(\text{win}\mid\text{trusted})$ |
| --- | --- | --- |
| 8   | 50.0% | 56.8%
| 9   | 54.8% | 61.6%
| 10  | 50.2% | 55.2% 
| 11  | 53.7% | 59.0% 
| 12  | 53.7% | 58.5%

# Who to Kill, and How to Kill Them

Blood on the Clocktower is a game about poking people with a stick and seeing how they respond. The stick, of course, is death on the chopping block, and their response is valuable social information. Not only is their response valuable, the response of the players is as well: who's willing to vote on them, who's willing to come to their defense, and who will panic when the player has been sufficiently poked.

With that in mind, a few simplifications can be made:
- Minions will never vote on their Demon if that vote would put them on the block.
- A player who is put on the block has a 60% chance of being executed, otherwise, the next player who is put on the block has a 70% chance of being executed, and so on.
- A Demon will vote with the pattern of a good player, but will be slightly more likely to vote for the executions of good players.
- A Minion will be significantly more likely to vote for the executions of good players than evil players.

