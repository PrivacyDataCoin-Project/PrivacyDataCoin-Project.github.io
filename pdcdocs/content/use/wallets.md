---
title: Wallets
---

Two wallets ship with the project.

The desktop program is the `Pdc` executable from release <a data-doc-release href="https://github.com/PrivacyDataCoin-Project/pdc/releases/latest"><span data-doc-version>v2.4.2</span></a>. That GUI build uses Qt 6. It runs a node and a wallet together, which is what staking needs: the wallet has to be online and synced.

`simplewallet` is the command-line wallet. It talks to a `daemon` over RPC. Use it on a server, in scripts, and when you want the command list in front of you.

## Secrets

| Command | What it prints |
| --- | --- |
| `show_seed` | The 24-word recovery phrase |
| `spendkey` | The secret spend key |
| `viewkey` | The secret view key |
| `tracking_seed` | For an auditable wallet, the seed a reviewer can use |
| `address` | The public `Px` address |
| `integrated_address` | Encode or decode an `iP` address and a payment id |

Anyone with the seed or the spend key can spend the funds. Anyone with the view key can recognize incoming outputs. Treat all three as secrets. The tracking seed is a deliberate exception: you give it to an auditor and to nobody else.

## Everyday commands

| Command | Purpose |
| --- | --- |
| `refresh` | Pull new transfers and recompute the balance |
| `balance` | Show balances for whitelisted assets. `balance raw` also shows assets outside the whitelist |
| `transfer` | Send. The form is `transfer <mixin_count> [asset_id:]<address> <amount> ... [payment_id]` |
| `incoming_transfers` | List incoming outputs, optionally `available` or `unavailable` |
| `list_recent_transfers` | The latest transfers, up to 1,000, with offset and count |
| `payments` | Find transfers by payment id |
| `save` | Write the wallet file |
| `resync` | Forget cached transfers and scan again |
| `bc_height` | Node height |
| `wallet_bc_height` | Height the wallet has scanned |

`transfer` still takes a mixin count. After hard fork 4 the protocol requires 15 decoys. Passing a smaller count does not make the transfer public. The node enforces the mandatory set.

A payment id is an optional hex string. An integrated address carries one inside the `iP` string so the sender does not have to paste it separately.

## Watch-only and offline signing

`save_watch_only <filename> <password>` writes a wallet that can see funds and prepare transactions. It cannot sign them.

The signing flow is:

1. The watch-only wallet prepares an unsigned transaction.
2. `sign_transfer <unsigned_tx_file> <signed_tx_file>` signs it on the machine that holds the spend key.
3. `submit_transfer <signed_tx_file>` broadcasts the signed transaction.

## Assets from the command line

| Command | Who can run it |
| --- | --- |
| `deploy_new_asset <json>` | Creates an asset. This wallet becomes the maintainer |
| `emit_asset <asset_id> <amount>` | Mints more units. Maintainer only |
| `burn_asset <asset_id> <amount>` | Burns units the maintainer holds |
| `update_asset <asset_id> <metadata>` | Updates the descriptor metadata |
| `transfer_asset_ownership <asset_id> <new_owner_public_key>` | Hands the maintainer role to another key |
| `add_custom_asset_id` | Show an asset even if it is not on the public whitelist |
| `remove_custom_asset_id` | Drop that local approval |

Deploying, minting, and burning are explicit chain operations. They are not hidden the way a later wallet transfer of that asset is hidden.

## Tor relay

`tor_enable` and `tor_disable` switch relaying of transactions over Tor. The wallet registers this relay as enabled by default. Disabling it changes the path your transaction takes to the network. It does not change what the chain stores.

## Files

Wallet files use signature `WALLET_FILE_SIGNATURE_V2`. The serialization version in this tree is 168, and the oldest supported version is 165. Copy the wallet file and keep the seed. The file without the password is not a backup you can restore on an empty machine if you also lost the phrase and the password.
