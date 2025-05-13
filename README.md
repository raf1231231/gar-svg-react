# Agar.io Clone with React and SVG

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://gar-svg-react.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A modern implementation of Agar.io using React and SVG for smooth graphics rendering. This project features a responsive game area, minimap, and multiplayer-ready architecture.

## Live Demo

Play the game at: [https://gar-svg-react.vercel.app](https://gar-svg-react.vercel.app)

## Features

- Smooth SVG-based graphics rendering
- Responsive game area with proper scaling
- Interactive minimap with player position and FOV
- Food spawning system with density control
- Boundary constraints and collision detection
- Modern UI with visual effects and animations

## Game Area

- 8x window width by 6x window height playable area
- Centered coordinate system
- Proper boundary constraints
- Optimized for up to 50 players

## Minimap Features

- Real-time player position tracking
- Field of view indicator
- Food blob visualization
- Grid system for orientation
- Visual effects and animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/raf1231231/gar-svg-react.git
cd gar-svg-react
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

## Development

The project is built with:
- React
- TypeScript
- SVG for graphics
- Modern CSS features

## Deployment

This project is automatically deployed to Vercel. Any push to the main branch will trigger a new deployment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
