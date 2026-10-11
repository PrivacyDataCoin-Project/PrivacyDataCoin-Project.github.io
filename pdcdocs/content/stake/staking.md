---
title: Staking
---

Staking is how PDC produces proof-of-stake blocks. You leave coins in a wallet that stays online and synced. The wallet looks for a moment when those coins are allowed to sign a block. There is no validator set and no delegation contract in this tree.

## What you need

- A wallet and a node from release <a data-doc-release href="https://github.com/PrivacyDataCoin-Project/pdc/releases/latest"><span data-doc-version>v2.4.2</span></a>, on the same chain. The desktop wallet runs both.
- Coins that have aged at least 10 blocks (`POS_MINIMUM_COINSTAKE_AGE`).
- The process has to keep running. `POS_WALLET_MINING_SCAN_INTERVAL` is 15 seconds, inside a scan window of 10 minutes (`POS_SCAN_WINDOW`).

There is no extra minimum balance in the constants. A larger eligible balance is simply more likely to win a given block. Closing the wallet stops the search until you open it again. Nothing in the protocol slashes a wallet for going offline. You just do not earn while it is shut.

## What you earn

The block reward is the same 1 PDC base reward a proof-of-work block pays, subject to the block-size rule. This manual does not quote an annual percentage. The chance of a reward depends on your eligible coins, the coins everyone else is staking, and the proof-of-work hash rate, because both sides share the 60-second block target.

`show_staking_history` prints recent stake transfers. An optional number is how many days of history to show. The handler text uses `[2]` as the example of that option.

## Zarcanum and the amount

From height 0 the chain accepts proof-of-stake blocks. After height 100, hard fork 4 requires Zarcanum. Zarcanum is the stake proof that keeps the staked amount sealed. A stake block is public. The balance that produced it is not.

## Sequential stake blocks

`BLOCK_POS_STRICT_SEQUENCE_LIMIT` is 20. The longest allowed run of proof-of-stake blocks is 21. After that run the next blocks have to be proof of work before another long stake sequence can start. This is why a network of only stakers cannot occupy the chain forever.

## Where the wallet shows it

In the desktop wallet, enable proof-of-stake staking and leave the wallet unlocked enough to sign a stake block. A watch-only wallet cannot sign that block. The spend key has to be available to the process that stakes.

On a server, run `daemon` and `simplewallet` under a supervisor so they restart after a reboot. Point both at `~/.PDC` or at an explicit `--data-dir` on durable disk. The chain data is not small forever: plan for it to grow with the block history.
