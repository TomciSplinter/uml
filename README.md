# $UML — Unlimited Money Limited

Launch site for $UML on Solana. Plain static HTML/CSS/JS with no build step.

## Deploy on Vercel
1. Import this repo in Vercel.
2. Framework preset: **Other**. Leave the build command and output directory empty.
3. Deploy.

## Before launch, fill in
- **Contract address:** set (`7GEWPxezFsYZL4LWT4LU7AWKyndSaVm62UXakTgepump`). To change it, edit `window.UML_CONFIG.contractAddress` near the top of `index.html`.
- **Links:** search `index.html` for these placeholders and replace them with real URLs:
  `[X LINK]`, `[TELEGRAM LINK]` (buy and chart links already point to pump.fun and DexScreener)
- **Tokenomics:** search for `[SUPPLY]`, `[TAX]`, `[LP STATUS]`, `[STATUS]`

## Files
- `index.html`: page markup
- `styles.css`: styles and animations
- `app.js`: scroll film, story track, counter, timer, cursor and other interactions
- `assets/`: scroll video, images, icons

## Disclaimer
$UML is a fan-tribute memecoin. It is not affiliated with or endorsed by Max Fosh or the original Unlimited Money Limited. Not financial advice.
