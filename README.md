# Samarth Silver Jewellery — Virtual Business Card

Built with **Vite + React + Three.js + @react-three/fiber + @react-three/drei**

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

### Option 1 — Vercel CLI (fastest)
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Option 2 — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click **Deploy** ✓

## Features
- 3D silver card with PBR metalness / roughness shading
- Gold accent bars, shimmer sweep, floating gem particles
- Drag / swipe to rotate (mouse + touch)
- Idle float animation + mouse-follow tilt
- Floor reflection (MeshReflectorMaterial)
- Sparkle particles (Drei Sparkles)
- ACES filmic tone mapping

## Card Details
- **Brand**: Samarth Silver Jewellery
- **Owner**: Dilip Gahalot — Proprietor
- **Phone**: +91 99300 71426
- **GST**: 27AABPG2689J1ZI
- **Location**: Vile Parle East, Mumbai
