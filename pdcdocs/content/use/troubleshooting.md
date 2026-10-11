---
title: Troubleshooting
---

## The wallet cannot find the network

Confirm three facts:

1. The binary is release <a data-doc-release href="https://github.com/PrivacyDataCoin-Project/pdc/releases/latest"><span data-doc-version>v2.4.2</span></a>.
2. The node is using mainnet ports: peer-to-peer 19121, RPC 19211. A testnet build moves these. Testnet peer-to-peer is `19211 + 100` (19311), testnet RPC is 19111, and testnet stratum is 19888.
3. The hardcoded seed `169.58.142.131:19121` is reachable from your network. The node also accepts extra seeds with `--seed-node`.

The genesis you want is `df35cba557c857756f20612ce3c9d2aa315d0ae8fc2aaffe6c5c59d37e00b10a`. If a block explorer or another node shows a different genesis, you are on a different chain.

## The daemon is running and the wallet still says it cannot connect

The RPC listens on `127.0.0.1` by default. Point `simplewallet` at `127.0.0.1:19211` when both programs are on the same machine. If the wallet is on another machine, start the daemon with an explicit `--rpc-bind-ip` and allow that port through the firewall. Do this only on a host you administer.

## Sync looks stuck on a young network

On a young network the seed often has an empty peer list. This tree keeps the hardcoded seed as a priority peer so the connection stays open and the node can still download blocks. Give it time, and confirm the seed answers on TCP 19121.

## Balance looks wrong

`balance` filters assets through the whitelist at `https://api.privacydatacoin.com/assets_whitelist.json`. An asset you issued yourself, or one that is not on that list, is hidden until you run `balance raw` or `add_custom_asset_id`.

`resync` drops the wallet's scanned transfers and scans the chain again. Use it when the wallet file and the chain disagree. It does not delete the keys.

## A transfer will not send

Check the fee. The minimum is 0.01 PDC. Check the unlock: mined outputs wait 10 blocks. After hard fork 4 the ring must contain 15 decoys, and a transaction needs at least 2 outputs. The wallet builds those rules for you. If you hand-build a transaction, the node will reject one that breaks them.

Also check that the chain is past the height your wallet has scanned. A transfer signed against a stale height can miss its expiration window. The expiration check uses a median shifted by `TX_EXPIRATION_MEDIAN_SHIFT`.

## Staking never pays

Staking pays only while the wallet and a synced node are online. Closing the laptop pauses it. There is no minimum balance beyond the 10-block coinstake age, but a larger balance wins the stake lottery more often. Rewards are the block reward of 1 PDC, subject to the block-size rule, not a quoted interest rate.

A long run of proof-of-stake blocks is capped at 21. After that the chain expects proof of work before another long stake run.

## The GUI and an old Qt note

The repository README builds the GUI with Qt 6.8.3. CMake still accepts Qt 5 if `Qt5WebEngineWidgets` is found. Release builds do not use Qt 5. The published GUI binaries for <a data-doc-release href="https://github.com/PrivacyDataCoin-Project/PDC/releases/latest"><span data-doc-version>v2.4.2</span></a> are the Qt 6.8 build. Prefer those binaries unless you intend to compile. The [build page](../build/from-source.md) follows the README.
