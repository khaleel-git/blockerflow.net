<div align="center">

<img src="https://blockerflow.net/assets/icon-512.png" width="96" alt="Blockerflow icon">

# Blockerflow

**Block distractions. Stay accountable.**

Blocks adult content and distracting social video feeds on Android and Mac, backed by a real
accountability system.

[![Google Play](https://img.shields.io/badge/Google%20Play-Get%20Blockerflow-3DDC84?logo=googleplay&logoColor=white)](https://play.google.com/store/apps/details?id=eu.khaleel.blockerflow)
[![Download for Mac](https://img.shields.io/badge/Mac-Download%20.dmg-000000?logo=apple&logoColor=white)](https://github.com/khaleel-git/blockerflow.net/releases/download/mac-v1.0.0/Blockerflow-mac-1.0.0.dmg)

**[blockerflow.net](https://blockerflow.net)**

</div>

## Blockerflow for Mac

**[Download Blockerflow-mac-1.0.0.dmg](https://github.com/khaleel-git/blockerflow.net/releases/download/mac-v1.0.0/Blockerflow-mac-1.0.0.dmg)**
(macOS 12 or later, Apple silicon and Intel) · [Full install guide](https://blockerflow.net/guides/how-to-install-blockerflow-on-mac/)

1. Open the `.dmg` and drag **Blockerflow** onto **Applications**.
2. Right click the app, choose **Open**, then **Open** again.
3. Allow the certificate and proxy setup on the first start. HTTPS sites cannot be filtered without it.

> [!IMPORTANT]
> **"Blockerflow is damaged and can't be opened"?** The app is not damaged. It is distributed without an
> Apple Developer licence, so it is not notarized. Run this once in Terminal, then open the app again:
>
> ```
> xattr -cr /Applications/Blockerflow.app
> ```

**Supported browsers:** Safari, Google Chrome, Firefox, Opera, Vivaldi, DuckDuckGo, Brave, Microsoft Edge,
Orion and Yandex. Tor Browser, Maxthon and Arc are not supported.

**Uninstall:** turn off Uninstall Protection in Settings, then use **Uninstall App**.

The release page also lists "Source code" files. Those are this website, not the Mac app. The Mac app source
is not published: request it at [hello@khaleel.eu](mailto:hello@khaleel.eu).

## What it blocks

- **Adult content:** a 1.1M+ domain and keyword list, checked on your device. Nothing you browse is uploaded.
- **Social video:** Instagram and Facebook Reels, YouTube Shorts, Snapchat Spotlight.
- **Focus Mode:** timed sessions that block your chosen distractions.
- **Accountability partner:** Myself, Time Delay, a Friend by email, or an AI Coach.
- **Uninstall Protection:** stops the app being removed as a shortcut around its own blocks.

## This repository

The source of [blockerflow.net](https://blockerflow.net) (Vite, React, Tailwind, deployed to Cloudflare Pages)
and the home of the Mac app releases. Pages: [setup guide](https://blockerflow.net/guide/),
[guides](https://blockerflow.net/guides/), [privacy](https://blockerflow.net/privacy/),
[terms](https://blockerflow.net/terms/).

Contact: [hello@khaleel.eu](mailto:hello@khaleel.eu)
