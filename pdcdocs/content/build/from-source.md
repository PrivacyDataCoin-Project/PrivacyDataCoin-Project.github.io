---
title: Build from source
---

The repository is [github.com/PrivacyDataCoin-Project/PDC](https://github.com/PrivacyDataCoin-Project/PDC), branch `master`. Clone it with submodules. A clone without `--recursive` misses the bundled libraries and will not configure.

```text
git clone --recursive https://github.com/PrivacyDataCoin-Project/PDC.git
```

The steps below follow the README in that repository. Release CI builds on those pins. If a checksum in the README changes, follow the README of the commit you are building.

## What the build produces

| Target | Binary | You need it for |
| --- | --- | --- |
| `daemon` | `build/src/pdcd` | A full node |
| `simplewallet` | `build/src/simplewallet` | Command-line wallet |
| `connectivity_tool` | `build/src/connectivity_tool` | Peer and network checks |
| `Pdc` | `build/src/Pdc` | Desktop wallet and GUI staking |

CMake also builds test targets (`coretests`, `crypto-tests`, and others) under `tests/`. They are for contributors, not for mainnet.

## Versions the README uses

These are the versions in the current release CI (Linux AppImage, Windows, and macOS jobs on `master`).

| Component | Release CI |
| --- | --- |
| GCC, Linux | 11, on Ubuntu 22.04 |
| MSVC | 2022 (`windows-2022`) |
| Xcode | macOS 14 or newer host. The GUI deployment target is macOS 12.0 because of Qt 6.8 |
| CMake | 3.16 or newer |
| Boost | 1.84.0, static libraries |
| OpenSSL | 3.5.8 on Linux and Windows, 3.5.7 on macOS, static (`no-shared`) |
| Qt, GUI only | 6.8.3. Modules: Widgets, WebEngine, WebChannel, PrintSupport, plus WebEngine's `qtpositioning` and `qtserialport` |

CMake still accepts Qt 5 if `Qt5WebEngineWidgets` is found. Release builds do not use Qt 5. `utils/build_script_linux.sh` is an older helper. Its Qt 5 library list does not match Qt 6.8.3. Use the `cmake` commands below.

A server build produces `pdcd`, `simplewallet`, and `connectivity_tool`. A GUI build also produces `Pdc`.

## Linux

Use Ubuntu 22.04 if the binary should match the release AppImage. Newer hosts can compile. The shipped x64 image is still built on 22.04.

Server packages:

```text
sudo apt-get update
sudo apt-get install -y --no-install-recommends \
  build-essential g++ cmake git curl ca-certificates bzip2 pkg-config perl \
  libbz2-dev zlib1g-dev libicu-dev
```

GUI packages are the server list plus the libraries the Linux CI image installs before Qt 6.8:

```text
sudo apt-get update
sudo apt-get install -y --no-install-recommends \
  build-essential g++ cmake git curl ca-certificates bzip2 pkg-config perl \
  python3 python3-pip python3-venv \
  libbz2-dev zlib1g-dev libicu-dev \
  libevent-dev libminizip-dev \
  libgl1-mesa-dev libglu1-mesa-dev \
  libnss3 libnspr4 \
  libxkbcommon-x11-0 libxcb-cursor0 libxcb-xinerama0 \
  desktop-file-utils file patchelf rsync
```

`python3` is only needed to install Qt with `aqtinstall`. `patchelf` is only needed when packing an AppImage.

Build static Boost 1.84.0. `STATIC=TRUE` needs `runtime-link=static`, and `find_package` asks for the `log` component.

```text
curl -fL -O https://archives.boost.io/release/1.84.0/source/boost_1_84_0.tar.bz2
echo "cc4b893acf645c9d4b698e9a0f08ca8846aa5d6c68275c14c3e7949c24109454  boost_1_84_0.tar.bz2" | sha256sum -c
tar -xjf boost_1_84_0.tar.bz2
cd boost_1_84_0
./bootstrap.sh --prefix=$HOME/boost_1_84_0 \
  --with-libraries=system,filesystem,thread,date_time,chrono,regex,serialization,atomic,program_options,locale,timer,log
./b2 -j"$(nproc)" link=static runtime-link=static threading=multi variant=release install
cd ..
```

Install Qt 6.8.3 for a GUI build:

```text
python3 -m pip install --user 'aqtinstall==3.3.0'
python3 -m aqt install-qt linux desktop 6.8.3 linux_gcc_64 -O "$HOME/Qt" \
  -m qtwebengine qtwebchannel qtpositioning qtserialport
```

The prefix used below is `$HOME/Qt/6.8.3/gcc_64`.

Build static OpenSSL 3.5.8. Do not point the build at OpenSSL 1.1.1.

```text
curl -fL -o openssl-3.5.8.tar.gz \
  https://github.com/openssl/openssl/releases/download/openssl-3.5.8/openssl-3.5.8.tar.gz
echo "a8f84a39918ec6415ce765d9b429d313ba97b8143169c172e734b9514464f5b2  openssl-3.5.8.tar.gz" | sha256sum -c
tar -xzf openssl-3.5.8.tar.gz
cd openssl-3.5.8
./Configure linux-x86_64 no-shared no-tests --prefix=$HOME/openssl --openssldir=$HOME/openssl --libdir=lib
make -j"$(nproc)" && make install_sw
cd ..
```

Export the prefixes, then open a new shell so they apply:

```text
export BOOST_ROOT=$HOME/boost_1_84_0
export BOOST_LIBRARYDIR=$HOME/boost_1_84_0/lib
export OPENSSL_ROOT_DIR=$HOME/openssl
export QT_PREFIX_PATH=$HOME/Qt/6.8.3/gcc_64
```

From the repository root, a server build:

```text
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DSTATIC=TRUE -DBUILD_GUI=FALSE \
  -DBOOST_ROOT="$BOOST_ROOT" -DBOOST_LIBRARYDIR="$BOOST_LIBRARYDIR" \
  -DOPENSSL_ROOT_DIR="$OPENSSL_ROOT_DIR" -DOPENSSL_USE_STATIC_LIBS=TRUE
cmake --build build --parallel --target daemon simplewallet connectivity_tool
```

A GUI build:

```text
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DSTATIC=TRUE -DBUILD_GUI=TRUE \
  -DBOOST_ROOT="$BOOST_ROOT" -DBOOST_LIBRARYDIR="$BOOST_LIBRARYDIR" \
  -DOPENSSL_ROOT_DIR="$OPENSSL_ROOT_DIR" -DOPENSSL_USE_STATIC_LIBS=TRUE \
  -DCMAKE_PREFIX_PATH="$QT_PREFIX_PATH"
cmake --build build --parallel --target Pdc
```

The GUI must link the shared `libstdc++` that Qt loads. Do not pass `-static-libstdc++` to `Pdc`. `STATIC=TRUE` applies that flag only to the CLI targets. Add `-DTESTNET=TRUE` for a testnet build. Testnet uses different ports and different hard-fork heights. Do not point a testnet binary at mainnet peers and expect them to sync.

The release AppImage is built on Ubuntu 22.04. It does not bundle GL, EGL, or X11. If the GUI fails to start, install the host libraries named by `utils/Pdc_appimage_wrapper.sh`:

```text
sudo apt-get install -y libegl1 libgl1 libopengl0 libxcb-xinerama0 libx11-6 libxcb1
```

On a machine without FUSE: `APPIMAGE_EXTRACT_AND_RUN=1 ./pdc-linux-x64-gui-*.AppImage`.

## Windows and macOS

Windows release CI uses Windows 11 x64, MSVC 2022, Boost 1.84.0 (static libs, shared CRT), OpenSSL 3.5.8 (static libs, shared CRT), and Qt 6.8.3 (MSVC 2022 x64, WebEngine). Edit paths in `utils/configure_local_paths.cmd`, run the Visual Studio generator script for your MSVC version, and build `Pdc.sln`. Deploy the GUI with `windeployqt` on `Pdc.exe`, then copy `src/gui/qt-daemon/html` next to the executable.

macOS release CI uses Boost 1.84.0, OpenSSL 3.5.7, and Qt 6.8.3. The GUI deployment target is macOS 12.0. Set the variables in `utils/macosx_build_config.command`. A self-signed “Pdc” code-signing certificate is required for the GUI script `utils/build_script_mac_osx.sh`.

## Where the node writes data

The default data directory is `~/.PDC` on Linux, `~/Library/Application Support/PDC` on macOS, and the roaming `PDC` folder on 64-bit Windows. `--data-dir` overrides it.

Inside that folder the chain uses a directory whose name starts with `blockchain_` and ends with `_v2`. The peer cache is `p2pstate.bin`. The GUI keeps `gui_settings.json` and `gui_secure_conf.bin`. The miner config file name is `miner_conf.json`.
