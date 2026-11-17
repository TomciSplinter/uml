# $UML — Unlimited Money Limited

Launch site for $UML on Solana. Plain static HTML/CSS/JS with no build step.

## Deploy on Vercel
1. Import this repo in Vercel.
2. Framework preset: **Other**. Leave the build command and output directory empty.
3. Deploy.

## Before launch, fill in
- **Contract address:** in `index.html`, edit `window.UML_CONFIG.contractAddress` near the top.
- **Links:** search `index.html` for these placeholders and replace them with real URLs:
  `[BUY LINK]`, `[PUMP.FUN / DEX LINK]`, `[DEXSCREENER LINK]`, `[X LINK]`, `[TELEGRAM LINK]`
- **Tokenomics:** search for `[SUPPLY]`, `[TAX]`, `[LP STATUS]`, `[STATUS]`, `[PUMP.FUN / JUPITER / RAYDIUM]`

## Files
- `index.html`: page markup
- `styles.css`: styles and animations
- `app.js`: scroll film, story track, counter, timer, cursor and other interactions
- `assets/`: scroll video, images, icons

## Disclaimer
$UML is a fan-tribute memecoin. It is not affiliated with or endorsed by Max Fosh or the original Unlimited Money Limited. Not financial advice.
