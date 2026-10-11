---
title: Getting started
---

Use release <a data-doc-release href="https://github.com/PrivacyDataCoin-Project/PDC/releases/latest"><span data-doc-version>v2.4.2</span></a>, published <span data-doc-date>10 October 2026</span>. That number is the latest release of [PrivacyDataCoin-Project/PDC](https://github.com/PrivacyDataCoin-Project/PDC). Stay on the current release for both the wallet and the node.

<div data-release-files>
<table>
<thead><tr><th>File</th><th>Role</th><th>Size</th></tr></thead>
<tbody>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-linux-x64-gui-2.4.2.9-337176a.AppImage">pdc-linux-x64-gui-2.4.2.9-337176a.AppImage</a></td><td>Linux desktop wallet</td><td>166 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-linux-arm64-gui-2.4.2.9-337176a.AppImage">pdc-linux-arm64-gui-2.4.2.9-337176a.AppImage</a></td><td>Linux desktop wallet</td><td>175 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-windows-x64-gui-2.4.2.9-337176a-installer.exe">pdc-windows-x64-gui-2.4.2.9-337176a-installer.exe</a></td><td>Windows installer</td><td>194 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-windows-x64-gui-2.4.2.9-337176a.zip">pdc-windows-x64-gui-2.4.2.9-337176a.zip</a></td><td>Windows desktop wallet archive</td><td>281 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-macos-arm64-gui-v2.4.2.9.337176a.dmg">pdc-macos-arm64-gui-v2.4.2.9.337176a.dmg</a></td><td>macOS desktop wallet</td><td>271 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-macos-x64-gui-v2.4.2.9.337176a.dmg">pdc-macos-x64-gui-v2.4.2.9.337176a.dmg</a></td><td>macOS desktop wallet</td><td>244 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-linux-x64-cli-2.4.2.9-337176a.tar.bz2">pdc-linux-x64-cli-2.4.2.9-337176a.tar.bz2</a></td><td>Linux daemon and simplewallet</td><td>15.4 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-linux-arm64-cli-2.4.2.9-337176a.tar.bz2">pdc-linux-arm64-cli-2.4.2.9-337176a.tar.bz2</a></td><td>Linux daemon and simplewallet</td><td>15.7 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-windows-x64-cli-2.4.2.9-337176a.zip">pdc-windows-x64-cli-2.4.2.9-337176a.zip</a></td><td>Windows daemon and simplewallet</td><td>108 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-macos-arm64-cli-v2.4.2.9.337176a.tar.bz2">pdc-macos-arm64-cli-v2.4.2.9.337176a.tar.bz2</a></td><td>macOS daemon and simplewallet</td><td>12.7 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-macos-x64-cli-v2.4.2.9.337176a.tar.bz2">pdc-macos-x64-cli-v2.4.2.9.337176a.tar.bz2</a></td><td>macOS daemon and simplewallet</td><td>12.9 MB</td></tr>
<tr><td><a href="https://github.com/PrivacyDataCoin-Project/PDC/releases/download/v2.4.2/pdc-macos-universal-cli-v2.4.2.9.337176a.tar.bz2">pdc-macos-universal-cli-v2.4.2.9.337176a.tar.bz2</a></td><td>macOS daemon and simplewallet</td><td>25.6 MB</td></tr>
</tbody>
</table>
</div>

The GUI binaries in that release are a Qt 6.8 build. A source build that should match them uses Qt 6.8.3, as the repository README describes. CMake still accepts Qt 5 if `Qt5WebEngineWidgets` is found. Release builds do not use it.

## First launch

1. Install the desktop wallet, or unpack the command-line archive.
2. Let the node sync from the seed `169.58.142.131:19121`. A new node keeps that seed as a priority peer so it still has someone to stay connected to when the seed's peer list is empty.
3. Create a new wallet, or restore one from the 24-word phrase.
4. Write the phrase down offline. The wallet cannot recover funds from the phrase if you never saved it.
5. Wait until the wallet height matches the node. Coinbase outputs spend after 10 confirmations. A coinstake also needs to age 10 blocks.

On Linux the default data directory is `~/.PDC`. On macOS it is `~/Library/Application Support/PDC`. On 64-bit Windows it is the roaming application data folder named `PDC`. Override it with `--data-dir`.

## Check that you are on the right chain

The genesis hash must be:

```text
df35cba557c857756f20612ce3c9d2aa315d0ae8fc2aaffe6c5c59d37e00b10a
```

You can also open [the block explorer](https://explorer.privacydatacoin.com/) and compare the height with your node. The explorer is a view of public data. It does not reveal wallet transfers.

## A first command-line session

From the directory that contains the binaries:

```text
./pdcd
```

In another terminal, against the default RPC at `127.0.0.1:19211`:

```text
./simplewallet --generate-new-wallet=mywallet --daemon-address=127.0.0.1:19211
```

Inside the wallet, `help` lists every command. `address` prints the `Px` address. `balance` shows whitelisted assets. `refresh` pulls new blocks.

> The exact generate-wallet flag follows the binary's `--help` text. If a flag name differs in a build, trust `simplewallet --help` over a remembered example. The commands inside a running wallet are the handlers in `src/simplewallet/simplewallet.cpp`.
