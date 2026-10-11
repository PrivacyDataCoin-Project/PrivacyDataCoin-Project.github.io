---
title: Source map
---

The tree you want is branch `master` of [PrivacyDataCoin-Project/pdc](https://github.com/PrivacyDataCoin-Project/pdc). Paths below are from the repository root.

| Path | What lives there |
| --- | --- |
| `src/currency_core/currency_config.h` | Ports, reward, fees, forks, addresses, alias rules, whitelist URL |
| `src/currency_core/currency_format_utils.cpp` | `get_base_block_reward` and transaction construction |
| `src/currency_core/blockchain_storage.cpp` | Block and transaction validation, alias burn checks, hard-fork gates |
| `src/currency_core/bc_escrow_service.h` | Escrow instruction codes |
| `src/currency_core/bc_offers_service.h` | Marketplace offers |
| `src/crypto/clsag.h` | d/v-CLSAG signatures |
| `src/crypto/range_proof_bpp.h` | Bulletproofs+ range proofs (`bpp`) |
| `src/p2p/net_node.inl` | Seed nodes, peer limits, the priority-peer fallback |
| `src/rpc/core_rpc_server.h` | JSON-RPC method names and legacy HTTP paths |
| `src/rpc/core_rpc_server_commands_defs.h` | Request and response fields, `DOC_COMMAND` texts |
| `src/rpc/core_rpc_server.cpp` | RPC bind address and `getinfo` assembly |
| `src/stratum/stratum_server.cpp` | Stratum for external miners |
| `src/miner/simpleminer.cpp` | In-process proof-of-work miner |
| `src/daemon/daemon.cpp` | `daemon` target. The binary name is `pdcd`. `--data-dir` is read here |
| `src/simplewallet/simplewallet.cpp` | Every interactive wallet command |
| `src/wallet/` | Wallet scan, balances, transaction building |
| `src/gui/qt-daemon/` | Desktop wallet shell |
| `src/common/util.cpp` | Default data directory |
| `tests/` | Core, crypto, and functional tests |
| `utils/` | Platform build scripts |
| `README.md` | Dependency versions and the long build procedure |

## Binaries and the public services

| Piece | Where it is published |
| --- | --- |
| Desktop wallet and node binaries | [PrivacyDataCoin-Project/pdc releases](https://github.com/PrivacyDataCoin-Project/pdc/releases/latest), currently <span data-doc-version>v2.4.2</span> |
| Project site | [privacydatacoin.com](https://privacydatacoin.com/) |
| Block explorer | [explorer.privacydatacoin.com](https://explorer.privacydatacoin.com/) |
| Asset whitelist | [api.privacydatacoin.com/assets_whitelist.json](https://api.privacydatacoin.com/assets_whitelist.json) |

This documentation repository renders the pages you are reading. The markdown sources are under `content/`. Regenerate the HTML with:

```text
python3 tools/build.py
```

The generator needs the Python `markdown` package. It does not contact the network and it does not read the chain. When a constant in `currency_config.h` changes, edit the matching page under `content/` and run the generator again.

## Names inside the headers

Several macros still use a historical prefix, including `ZANO_HARDFORK_04_ZARCANUM`. Those identifiers are how the C++ refers to fork numbers. The chain they configure in this tree is PDC, ticker `PDC`, formation version 100.
