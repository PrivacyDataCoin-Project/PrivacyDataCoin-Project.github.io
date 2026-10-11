# PDC documentation

English manual for Privacy Data Coin. The section order follows a full-chain manual: learn the protocol, use a wallet, build and integrate, mine, stake, and read the source. The colors, the logo, and the facts are PDC.

Protocol numbers come from the PDC source, especially `src/currency_core/currency_config.h`. The edition number and the install files follow the latest GitHub release of [PrivacyDataCoin-Project/PDC](https://github.com/PrivacyDataCoin-Project/PDC). The published manual reads that release on each page load. The release current at the time of this writing is [v2.4.2](https://github.com/PrivacyDataCoin-Project/PDC/releases/tag/v2.4.2) (10 October 2026).

## Read it

The rendered manual is published at https://docs.privacydatacoin.com/.

The markdown sources are in `content/`. The HTML next to this README is what that address serves. Regenerate it after an edit:

```text
python3 -m pip install markdown
python3 tools/build.py
```

Public references used in the manual:

- Site: https://privacydatacoin.com/
- Explorer: https://explorer.privacydatacoin.com/
- Asset whitelist: https://api.privacydatacoin.com/assets_whitelist.json
- Current binaries: https://github.com/PrivacyDataCoin-Project/PDC/releases/latest

## Sections

- Learn: what PDC is, how a transfer works, FAQ
- Use: install the current release, wallets, security, troubleshooting
- Build: compile the tree, node RPC, assets, aliases, escrow and swaps
- Mine: RandomARQ and stratum port 19777
- Stake: online staking and the Zarcanum rules
- Code: the parameter table and a map of the source tree
