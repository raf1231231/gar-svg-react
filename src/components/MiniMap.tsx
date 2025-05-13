import React from 'react';
import { BlobData } from '../utils';

interface MiniMapProps {
    width: number;
    height: number;
    gameWidth: number;
    gameHeight: number;
    mainBlob: BlobData;
    blobsPositions: BlobData[];
}

const MiniMap: React.FC<MiniMapProps> = ({ width, height, gameWidth, gameHeight, mainBlob, blobsPositions }) => {
    // MiniMap dimensions - increased size for better visibility
    const miniMapSize = 200;
    const miniMapWidth = miniMapSize;
    const miniMapHeight = miniMapSize * (gameHeight / gameWidth);

    // Calculate scale to fit the entire game area in the minimap
    const scale = miniMapWidth / gameWidth;

    // Calculate the actual dimensions of the game area in the minimap
    const scaledWidth = gameWidth * scale;
    const scaledHeight = gameHeight * scale;

    // Calculate offsets to center the game area in the minimap
    const offsetX = (miniMapWidth - scaledWidth) / 2;
    const offsetY = (miniMapHeight - scaledHeight) / 2;

    // Helper function to convert game coordinates to minimap coordinates
    const toMiniMapCoords = (x: number, y: number) => ({
        x: offsetX + (x + gameWidth/2) * scale,
        y: offsetY + (y + gameHeight/2) * scale
    });

    // Calculate viewport indicator dimensions
    const viewportWidth = width * scale;
    const viewportHeight = height * scale;

    return (
        <div style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: 12,
            borderRadius: 8,
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <svg width={miniMapWidth} height={miniMapHeight}>
                <defs>
                    {/* Background gradient */}
                    <linearGradient id="minimapBg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(10, 10, 42, 0.9)" />
                        <stop offset="100%" stopColor="rgba(0, 0, 0, 0.9)" />
                    </linearGradient>

                    {/* Border gradient */}
                    <linearGradient id="minimapBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                        <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.3)" />
                    </linearGradient>

                    {/* Grid pattern */}
                    <pattern id="minimapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5"/>
                    </pattern>

                    {/* Player glow */}
                    <radialGradient id="playerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="rgba(52, 152, 219, 0.8)" />
                        <stop offset="100%" stopColor="rgba(52, 152, 219, 0)" />
                    </radialGradient>

                    {/* Food glow */}
                    <radialGradient id="foodGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                    </radialGradient>

                    {/* Viewport gradient */}
                    <linearGradient id="viewportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(52, 152, 219, 0.3)" />
                        <stop offset="50%" stopColor="rgba(52, 152, 219, 0.1)" />
                        <stop offset="100%" stopColor="rgba(52, 152, 219, 0.3)" />
                    </linearGradient>

                    {/* Viewport glow */}
                    <filter id="viewportGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Background with gradient */}
                <rect
                    width={miniMapWidth}
                    height={miniMapHeight}
                    fill="url(#minimapBg)"
                    rx={6}
                />

                {/* Grid pattern */}
                <rect
                    width={miniMapWidth}
                    height={miniMapHeight}
                    fill="url(#minimapGrid)"
                    rx={6}
                />

                {/* Game area boundary */}
                <rect
                    x={offsetX}
                    y={offsetY}
                    width={scaledWidth}
                    height={scaledHeight}
                    fill="none"
                    stroke="url(#minimapBorder)"
                    strokeWidth={2}
                    rx={2}
                />

                {/* Grid lines */}
                <g stroke="rgba(255, 255, 255, 0.15)" strokeWidth={1}>
                    {/* Vertical center line */}
                    <line
                        x1={offsetX + scaledWidth/2}
                        y1={offsetY}
                        x2={offsetX + scaledWidth/2}
                        y2={offsetY + scaledHeight}
                        strokeDasharray="4,4"
                    />
                    {/* Horizontal center line */}
                    <line
                        x1={offsetX}
                        y1={offsetY + scaledHeight/2}
                        x2={offsetX + scaledWidth}
                        y2={offsetY + scaledHeight/2}
                        strokeDasharray="4,4"
                    />
                </g>

                {/* Food blobs */}
                {blobsPositions.map((blob) => {
                    const pos = toMiniMapCoords(blob.position.x, blob.position.y);
                    return (
                        <g key={blob.id}>
                            <circle
                                cx={pos.x}
                                cy={pos.y}
                                r={Math.max(1.5, blob.r * scale)}
                                fill="url(#foodGlow)"
                            />
                            <circle
                                cx={pos.x}
                                cy={pos.y}
                                r={Math.max(1, blob.r * scale)}
                                fill="rgba(255, 255, 255, 0.8)"
                            />
                        </g>
                    );
                })}

                {/* Player blob */}
                {(() => {
                    const pos = toMiniMapCoords(mainBlob.position.x, mainBlob.position.y);
                    return (
                        <g>
                            <circle
                                cx={pos.x}
                                cy={pos.y}
                                r={Math.max(3, mainBlob.r * scale)}
                                fill="url(#playerGlow)"
                            />
                            <circle
                                cx={pos.x}
                                cy={pos.y}
                                r={Math.max(2, mainBlob.r * scale)}
                                fill="rgba(52, 152, 219, 1)"
                            />
                        </g>
                    );
                })()}

                {/* Viewport indicator */}
                {(() => {
                    const pos = toMiniMapCoords(mainBlob.position.x, mainBlob.position.y);
                    return (
                        <g>
                            {/* Viewport background */}
                            <rect
                                x={pos.x - viewportWidth/2}
                                y={pos.y - viewportHeight/2}
                                width={viewportWidth}
                                height={viewportHeight}
                                fill="url(#viewportGradient)"
                                opacity="0.2"
                                rx={3}
                            />
                            
                            {/* Viewport border */}
                            <rect
                                x={pos.x - viewportWidth/2}
                                y={pos.y - viewportHeight/2}
                                width={viewportWidth}
                                height={viewportHeight}
                                fill="none"
                                stroke="rgba(52, 152, 219, 0.8)"
                                strokeWidth={2}
                                strokeDasharray="4,4"
                                rx={3}
                                filter="url(#viewportGlow)"
                            />

                            {/* Corner markers for viewport */}
                            <g stroke="rgba(52, 152, 219, 0.9)" strokeWidth={2}>
                                {/* Top-left */}
                                <line x1={pos.x - viewportWidth/2} y1={pos.y - viewportHeight/2 + 8} 
                                      x2={pos.x - viewportWidth/2} y2={pos.y - viewportHeight/2} />
                                <line x1={pos.x - viewportWidth/2} y1={pos.y - viewportHeight/2} 
                                      x2={pos.x - viewportWidth/2 + 8} y2={pos.y - viewportHeight/2} />
                                
                                {/* Top-right */}
                                <line x1={pos.x + viewportWidth/2 - 8} y1={pos.y - viewportHeight/2} 
                                      x2={pos.x + viewportWidth/2} y2={pos.y - viewportHeight/2} />
                                <line x1={pos.x + viewportWidth/2} y1={pos.y - viewportHeight/2} 
                                      x2={pos.x + viewportWidth/2} y2={pos.y - viewportHeight/2 + 8} />
                                
                                {/* Bottom-left */}
                                <line x1={pos.x - viewportWidth/2} y1={pos.y + viewportHeight/2 - 8} 
                                      x2={pos.x - viewportWidth/2} y2={pos.y + viewportHeight/2} />
                                <line x1={pos.x - viewportWidth/2} y1={pos.y + viewportHeight/2} 
                                      x2={pos.x - viewportWidth/2 + 8} y2={pos.y + viewportHeight/2} />
                                
                                {/* Bottom-right */}
                                <line x1={pos.x + viewportWidth/2 - 8} y1={pos.y + viewportHeight/2} 
                                      x2={pos.x + viewportWidth/2} y2={pos.y + viewportHeight/2} />
                                <line x1={pos.x + viewportWidth/2} y1={pos.y + viewportHeight/2 - 8} 
                                      x2={pos.x + viewportWidth/2} y2={pos.y + viewportHeight/2} />
                            </g>

                            {/* Center crosshair */}
                            <g stroke="rgba(52, 152, 219, 0.6)" strokeWidth={1}>
                                <line x1={pos.x - 4} y1={pos.y} x2={pos.x + 4} y2={pos.y} />
                                <line x1={pos.x} y1={pos.y - 4} x2={pos.x} y2={pos.y + 4} />
                            </g>
                        </g>
                    );
                })()}
            </svg>
        </div>
    );
};

export default MiniMap; 