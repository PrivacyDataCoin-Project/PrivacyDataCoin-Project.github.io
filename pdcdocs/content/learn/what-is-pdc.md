---
title: What PDC is
---

PDC is the unit of account on this chain. The ticker in the source is `PDC`. Amounts use 12 decimal places, so one PDC is `1000000000000` atomic units. The constant is named `COIN`.

There is no premine. `PREMINE_AMOUNT` is 0, and the genesis block reward uses that value. From the next block onward, the base block reward is 1 PDC. The reward does not decay with height. A block that grows past the median size earns less, and a block larger than twice the median is rejected. The full-reward zone is 125,000 bytes.

## Consensus in one paragraph

Proof of work and proof of stake run together from the first blocks. Each side targets 120 seconds. The combined target is 60 seconds, so a healthy chain produces about 1,440 blocks a day and about 525,600 PDC a year. Proof of work is RandomARQ. Proof of stake starts at height 0. After height 100, hard fork 4 replaces the stake proof with Zarcanum, which keeps the staked amount sealed.

## What a normal transfer hides

A wallet transfer does not publish the four fields people usually read off a block explorer:

- The receiver is a one-time stealth output, not the published `Px` address.
- The sender is hidden in a d/v-CLSAG ring. The default decoy set has 10 members. After hard fork 4 the mandatory size is 15.
- The amount sits in a commitment. Bulletproofs+ (the `bpp` proofs in `src/crypto/range_proof_bpp.h`) show that the transaction balances without printing the number.
- The asset id is blinded, so native PDC and a user token look the same on a wallet transfer.

Issuing, minting, and burning a token are separate, explicit operations. An alias registration is also explicit: the name is public, and the fee is burned.

## Where to look

The desktop wallet and the command-line node ship in release <a data-doc-release href="https://github.com/PrivacyDataCoin-Project/pdc/releases/latest"><span data-doc-version>v2.4.2</span></a>. The block explorer is [explorer.privacydatacoin.com](https://explorer.privacydatacoin.com/). The project site is [privacydatacoin.com](https://privacydatacoin.com/).

The canonical chain identity is:

| Item | Value |
| --- | --- |
| Genesis | `df35cba557c857756f20612ce3c9d2aa315d0ae8fc2aaffe6c5c59d37e00b10a` |
| Formation version | 100 |
| Proof of work | RandomARQ, XMRig algorithm `rx/arq` |
| Peer-to-peer port | 19121 |
| Node RPC port | 19211 |
| Stratum port | 19777 |
| Hardcoded seed | `169.58.142.131:19121` |
