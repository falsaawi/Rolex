# Rolex Watch Allocation Methodology

An interactive web application demonstrating a comprehensive framework for Rolex authorized dealers to allocate watches fairly and efficiently.

![Rolex Allocation System](https://img.shields.io/badge/React-18.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## Features

### 📊 Customer Scoring (CPS)
- Interactive sliders for all scoring factors
- Real-time calculation of Customer Priority Score
- Visual representation of weighted contributions
- Automatic eligibility assessment

### 🛡️ Anti-Flip Detection
- Red flag identification system
- Risk assessment gauge
- Combined eligibility matrix
- Block/Monitor/Approve status

### ⌚ Allocation Simulation
- Watch tier selection (S/A/B/C)
- Customer queue ranking
- Process flow visualization
- Real-time eligibility filtering

## Tech Stack

- **React 18** - UI Framework
- **Vite 5** - Build Tool
- **TailwindCSS 3** - Styling
- **Vercel** - Deployment

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite and configure settings
6. Click "Deploy"

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Choose "Upload" and drag the project folder
4. Click "Deploy"

## Project Structure

```
rolex-allocation-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles + Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── vercel.json          # Vercel deployment config
└── README.md            # This file
```

## Methodology Overview

### Customer Priority Score (CPS) Weights

| Factor | Weight |
|--------|--------|
| Purchase History | 25% |
| Wait Time | 20% |
| Relationship Tenure | 15% |
| Allocation History | 15% |
| Engagement | 10% |
| Wishlist Flexibility | 10% |
| Profile Verification | 5% |

### Watch Tiers

| Tier | Category | Min CPS | Examples |
|------|----------|---------|----------|
| S | Ultra-Scarce | 85 | Daytona, GMT Pepsi |
| A | High Demand | 70 | Submariner, GMT Batman |
| B | Moderate | 50 | Datejust, Explorer |
| C | Available | 0 | Air-King, Oyster Perpetual |

## License

Private - For demonstration purposes only.

## Author

Created for Rolex Dealer Allocation Process Optimization
