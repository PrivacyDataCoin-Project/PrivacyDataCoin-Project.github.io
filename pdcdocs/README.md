# PDC documentation

English manual for Privacy Data Coin. The section order follows a full-chain manual: learn the protocol, use a wallet, build and integrate, mine, stake, and read the source. The colors, the logo, and the facts are PDC.

Numbers come from [ArqTras/pdc](https://github.com/ArqTras/pdc) branch `pdc`, especially `src/currency_core/currency_config.h`, and from the [latest release](https://github.com/PrivacyDataCoin-Project/PDC/releases/latest).

## Read it

The rendered manual is published at https://privacydatacoin.com/pdcdocs/.

The markdown sources are in `content/`. The HTML next to this README is what that address serves. Regenerate it after an edit:

```text
python3 -m pip install markdown
python3 tools/build.py
```

Public references used in the manual:

- Site: https://privacydatacoin.com/
- Explorer: https://explorer.privacydatacoin.com/
- Asset whitelist: https://api.privacydatacoin.com/assets_whitelist.json

## Sections

- Learn: what PDC is, how a transfer works, FAQ
- Use: install the latest release, wallets, security, troubleshooting
- Build: compile the tree, node RPC, assets, aliases, escrow and swaps
- Mine: RandomARQ and stratum port 19777
- Stake: online staking and the Zarcanum rules
- Code: the parameter table and a map of the source tree
