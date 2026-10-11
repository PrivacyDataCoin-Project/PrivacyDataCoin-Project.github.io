---
title: FAQ
---

## Is there a premine?

No. `PREMINE_AMOUNT` is 0. The genesis reward uses that value. Later blocks pay a flat 1 PDC before any size penalty.

## Does the reward shrink over time?

The base reward does not. `get_base_block_reward` returns 1 PDC at every height above zero. A block that is larger than the recent median earns a reduced reward. A block larger than twice the median is not accepted.

## How fast are blocks?

The combined target is 60 seconds. Proof of work and proof of stake each target 120 seconds. Real gaps move with difficulty and with how many miners and stakers are online.

## Can I mine with ProgPoW?

No. The proof-of-work name in this tree is RandomARQ (`POW_ALGORITHM_NAME`). The epoch length is 2,048 blocks. The hashed blob is 43 bytes, and the nonce sits at offset 39. XMRig's matching algorithm is `rx/arq`.

## When does staking start?

Proof of stake is allowed from height 0. Zarcanum, the stake proof that keeps the amount sealed, activates after height 100. A coinstake must be 10 blocks old. There is no extra minimum stake in the source beyond that age.

## Do I have to leave the wallet open to stake?

Yes. The wallet scans for a valid stake on an interval of `POS_SCAN_STEP` (15 seconds) inside a 10-minute window. If the wallet or its node is offline, it cannot publish a stake block.

## What does the explorer show?

The explorer can show blocks, proof type, and public metadata such as aliases. It cannot show the sender, receiver, amount, or asset type of a wallet transfer, because those fields are not on the chain in cleartext.

## Why did my v1 wallet stop working?

Install <a data-doc-release href="https://github.com/PrivacyDataCoin-Project/pdc/releases/latest"><span data-doc-version>v2.4.2</span></a> and create or restore a wallet against this network.

## Are alias fees paid to a foundation?

No. The alias reward account's spend and view keys are all zeros. The comment in the source says the alias money is burned. The registration cost itself moves with a median of recent alias fees. The starting constant, `ALIAS_VERY_INITAL_COAST`, is 10,000 atomic units, which is 0.00000001 PDC, and the median takes over from there. Read the current cost from the node with the `get_alias_reward` RPC instead of assuming a fixed price.

## Is the RPC public?

By default the RPC binds to `127.0.0.1` on port 19211. A remote host cannot call it until you change `--rpc-bind-ip`. Leave it on localhost unless you have a reason and a firewall plan.

## Where is the asset list?

The wallet downloads `https://api.privacydatacoin.com/assets_whitelist.json` and checks it with `WALLET_ASSETS_WHITELIST_VALIDATION_PUBLIC_KEY`. `balance` hides assets that are not on that list. `balance raw`, or `add_custom_asset_id`, shows assets you have approved yourself.
