---
title: Mining
---

Proof of work on this chain is RandomARQ. The source constant is `POW_ALGORITHM_NAME`. It is not ProgPoW. A miner that only speaks ProgPoW will not produce valid PDC shares.

## The hash the node checks

| Parameter | Value |
| --- | --- |
| Algorithm | RandomARQ |
| XMRig name | `rx/arq` |
| Epoch length | 2,048 blocks (`RANDOMX_EPOCH_LENGTH`) |
| Blob size | 43 bytes (`POW_BLOB_SIZE`) |
| Nonce offset | 39 (`POW_NONCE_OFFSET`) |
| Proof-of-work target | 120 seconds |
| Combined block target | 60 seconds |
| Stratum port | 19777 (`STRATUM_DEFAULT_PORT`) |

The epoch changes every 2,048 blocks. A miner has to rebuild the dataset when the epoch changes. The daemon's stratum server listens on 19777 so a separate miner process can request work.

## CPU mining inside the daemon

The daemon can mine on its own CPUs. The JSON body for `start_mining` is `miner_address` plus `threads_count`. `simplewallet` exposes the same switch:

```text
start_mining <threads_count>
stop_mining
```

The reward address must be an address your wallet can spend. Mined outputs unlock after 10 blocks.

`start_mining` is also an HTTP route on the RPC port. Because that port binds to localhost, another machine cannot start your miner unless you change `--rpc-bind-ip`.

## Block reward

A proof-of-work block and a proof-of-stake block share `get_base_block_reward`. Above height 0 that is 1 PDC, reduced if the block is larger than the median, and rejected if it is larger than twice the median. There is no separate finder fee and no premine on top of this.

## What mining does not reveal

The block header shows that RandomARQ work was done and which address the coinbase pays, once that coinbase output is constructed for the miner. It does not publish the miner's existing balance. The coinbase itself is a chain output the miner can later spend in a confidential transfer.

## A practical setup

1. Run `daemon` and wait until it follows the genesis `df35cba5…b10a`.
2. Point XMRig at `127.0.0.1:19777` with algorithm `rx/arq`, or call `start_mining` if you only want the daemon's own threads.
3. Use a payout address from a wallet built for release <a data-doc-release href="https://github.com/PrivacyDataCoin-Project/pdc/releases/latest"><span data-doc-version>v2.4.2</span></a>.
4. Expect idle gaps. The 120-second proof-of-work target is an average shared with proof of stake, not a promise that every other block is yours.
