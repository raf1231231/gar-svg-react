import React, {createRef, RefObject} from 'react';
import './App.css';
import Blob from "./components/Blob";
import MiniMap from "./components/MiniMap";
import {BlobData, getMagnitude, normalize} from "./utils";

interface AppState {
    mainBlob: BlobData,
    blobsPositions: BlobData[],
    direction: { x: number, y: number }
}

const width = window.innerWidth;
const height = window.innerHeight;
const gameWidth = width * 8;  // Doubled from 4x to 8x
const gameHeight = height * 6; // Doubled from 3x to 6x
const initialSizeMainBlob = 50;
const maxPlayers = 50;
const foodCount = 200; // Doubled to maintain density

// Helper function to get random position within boundaries
const getRandomPositionInBounds = (width: number, height: number, r: number) => {
    const minX = -width/2 + r;
    const maxX = width/2 - r;
    const minY = -height/2 + r;
    const maxY = height/2 - r;
    
    return {
        x: Math.random() * (maxX - minX) + minX,
        y: Math.random() * (maxY - minY) + minY
    };
};

class App extends React.Component<{}, AppState> {
    svg: RefObject<SVGSVGElement>;

    constructor(props: any) {
        super(props);
        this.state = {
            mainBlob: {
                position: {
                    x: 0,
                    y: 0
                },
                r: initialSizeMainBlob,
                id: 0
            },
            blobsPositions: Array.from({ length: foodCount }, (_, i) => ({
                position: getRandomPositionInBounds(gameWidth, gameHeight, 10),
                r: 10,
                id: i + 1
            })),
            direction: { x: 0, y: 0 }
        };
        this.svg = createRef();
    }

    componentDidMount() {
        this.setPositionUpdater();
    }

    componentDidUpdate() {
        this.state.blobsPositions.forEach((pos: BlobData, index: number) => {
            if (this.eats(pos)) {
                const blobs = this.state.blobsPositions;
                blobs.splice(index, 1);
                // Spawn new food within boundaries
                blobs.push({
                    position: getRandomPositionInBounds(gameWidth, gameHeight, 10),
                    r: 10,
                    id: Date.now() + index
                });
                this.setState({blobsPositions: blobs});
            }
        });
    }

    updatePosition(pt: DOMPoint): void {
        const {mainBlob} = this.state;
        const svgElement = this.svg.current;
        if (svgElement) {
            const screenCTM = svgElement.getScreenCTM();
            if (screenCTM) {
                const loc = pt.matrixTransform(screenCTM.inverse());
                const normalized = normalize(loc.x - width / 2, loc.y - height / 2);
                
                // Calculate new position
                const newX = mainBlob.position.x + normalized.x;
                const newY = mainBlob.position.y + normalized.y;
                
                // Calculate boundaries
                const minX = -gameWidth/2 + mainBlob.r;
                const maxX = gameWidth/2 - mainBlob.r;
                const minY = -gameHeight/2 + mainBlob.r;
                const maxY = gameHeight/2 - mainBlob.r;
                
                // Constrain position within boundaries
                const constrainedX = Math.max(minX, Math.min(maxX, newX));
                const constrainedY = Math.max(minY, Math.min(maxY, newY));

                this.setState(prevState => ({
                    mainBlob: {
                        ...prevState.mainBlob,
                        position: {
                            x: constrainedX,
                            y: constrainedY
                        }
                    },
                    direction: normalized
                }));
            }
        }
    }

    setPositionUpdater() {
        if (this.svg.current) {
            let point = this.svg.current.createSVGPoint();
            document.onmousemove = (e) => {
                point.x = e.clientX;
                point.y = e.clientY;
            };
            document.ontouchmove = (e) => {
                point.x = e.touches[0].clientX;
                point.y = e.touches[0].clientY;
            };
            setInterval(() => this.updatePosition(point), 20);
        }
    }

    eats(other: BlobData): boolean {
        const {mainBlob} = this.state;
        const distance = getMagnitude(mainBlob.position.x - other.position.x, mainBlob.position.y - other.position.y);
        if (distance < mainBlob.r + other.r) {
            this.setState(prevState => ({
                mainBlob: {
                    ...prevState.mainBlob,
                    r: getMagnitude(mainBlob.r, other.r)
                }
            }));
            return true;
        } else {
            return false;
        }
    }

    render() {
        const fullScreen = {
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to bottom, #0a0a2a, #000000)'
        } as React.CSSProperties;

        const transition = {
            transition: "all 0.5s ease-in-out",
            WebkitTransition: "all 0.5s ease-in-out",
            MozTransition: "all 0.5s ease-in-out",
            OTransition: "all 0.5s ease-in-out"
        };

        const {mainBlob, blobsPositions} = this.state;

        return (
            <>
                <svg style={fullScreen} ref={this.svg} width={width} height={height}>
                    <defs>
                        <radialGradient id="fireflyGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="#f1c40f" stopOpacity="1" />
                            <stop offset="100%" stopColor="#f1c40f" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="#3498db" stopOpacity="1" />
                            <stop offset="100%" stopColor="#3498db" stopOpacity="0" />
                        </radialGradient>
                        
                        {/* Border gradient */}
                        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.3)" />
                        </linearGradient>
                        
                        <pattern id="spacePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="0.5" fill="white" opacity="0.3" />
                            <circle cx="30" cy="20" r="0.3" fill="white" opacity="0.2" />
                            <circle cx="50" cy="40" r="0.4" fill="white" opacity="0.25" />
                            <circle cx="70" cy="60" r="0.6" fill="white" opacity="0.15" />
                            <circle cx="90" cy="80" r="0.2" fill="white" opacity="0.2" />
                            <circle cx="20" cy="70" r="0.3" fill="white" opacity="0.25" />
                            <circle cx="40" cy="90" r="0.4" fill="white" opacity="0.2" />
                            <circle cx="60" cy="10" r="0.5" fill="white" opacity="0.15" />
                            <circle cx="80" cy="30" r="0.3" fill="white" opacity="0.25" />
                        </pattern>

                        <radialGradient id="galaxyGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="#2c3e50" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#1a1a2e" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
                        </radialGradient>
                    </defs>

                    <rect width="100%" height="100%" fill="#0a0a1a" />
                    <rect width="100%" height="100%" fill="url(#spacePattern)" />
                    <circle cx="30%" cy="40%" r="200" fill="url(#galaxyGradient)" opacity="0.4" />
                    <circle cx="70%" cy="60%" r="150" fill="url(#galaxyGradient)" opacity="0.3" />
                    <circle cx="50%" cy="20%" r="100" fill="url(#galaxyGradient)" opacity="0.2" />

                    <g style={transition}
                       transform={`translate(${width / 2}, ${height / 2}), scale(${initialSizeMainBlob / mainBlob.r})`}>
                        <g transform={`translate(${-mainBlob.position.x}, ${-mainBlob.position.y})`}>
                            {/* Game boundaries */}
                            <rect
                                x={-gameWidth/2}
                                y={-gameHeight/2}
                                width={gameWidth}
                                height={gameHeight}
                                fill="none"
                                stroke="url(#borderGradient)"
                                strokeWidth="2"
                            />
                            
                            {/* Corner markers */}
                            <g stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2">
                                {/* Top-left corner */}
                                <line x1={-gameWidth/2} y1={-gameHeight/2 + 30} x2={-gameWidth/2} y2={-gameHeight/2} />
                                <line x1={-gameWidth/2} y1={-gameHeight/2} x2={-gameWidth/2 + 30} y2={-gameHeight/2} />
                                
                                {/* Top-right corner */}
                                <line x1={gameWidth/2 - 30} y1={-gameHeight/2} x2={gameWidth/2} y2={-gameHeight/2} />
                                <line x1={gameWidth/2} y1={-gameHeight/2} x2={gameWidth/2} y2={-gameHeight/2 + 30} />
                                
                                {/* Bottom-left corner */}
                                <line x1={-gameWidth/2} y1={gameHeight/2 - 30} x2={-gameWidth/2} y2={gameHeight/2} />
                                <line x1={-gameWidth/2} y1={gameHeight/2} x2={-gameWidth/2 + 30} y2={gameHeight/2} />
                                
                                {/* Bottom-right corner */}
                                <line x1={gameWidth/2 - 30} y1={gameHeight/2} x2={gameWidth/2} y2={gameHeight/2} />
                                <line x1={gameWidth/2} y1={gameHeight/2 - 30} x2={gameWidth/2} y2={gameHeight/2} />
                            </g>

                            <Blob id={mainBlob.id} position={{x: mainBlob.position.x, y: mainBlob.position.y}}
                                  r={mainBlob.r} direction={this.state.direction}/>
                            {blobsPositions.map((blob: BlobData) =>
                                <Blob id={blob.id} position={{
                                    x: blob.position.x,
                                    y: blob.position.y
                                }} r={blob.r} key={blob.id}/>)}
                        </g>
                    </g>
                </svg>
                <MiniMap
                    width={width}
                    height={height}
                    gameWidth={gameWidth}
                    gameHeight={gameHeight}
                    mainBlob={mainBlob}
                    blobsPositions={blobsPositions}
                />
            </>
        );
    }
}

export default App;
