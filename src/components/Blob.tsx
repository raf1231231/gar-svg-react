import * as React from "react";
import {BlobData} from "../utils";

interface BlobProps extends BlobData {
    direction?: { x: number, y: number };
}

const Blob = (props: BlobProps) => {
    const transition = {
        transition: "all 0.2s ease-in-out",
        WebkitTransition: "all 0.2s ease-in-out",
        MozTransition: "all 0.2s ease-in-out",
        OTransition: "all 0.2s ease-in-out"
    };

    // Main blob (player) is a firefly
    if (props.id === 0) {
        // Calculate rotation angle based on direction
        const angle = props.direction ? Math.atan2(props.direction.y, props.direction.x) * 180 / Math.PI : 0;
        
        return (
            <g transform={`translate(${props.position.x}, ${props.position.y}) rotate(${angle})`}>
                {/* Glow effect */}
                <circle
                    r={props.r * 1.2}
                    fill="url(#fireflyGlow)"
                    opacity="0.3"
                >
                    <animate
                        attributeName="opacity"
                        values="0.3;0.5;0.3"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Firefly body */}
                <circle 
                    style={transition}
                    r={props.r * 0.8}
                    fill="#2c3e50"
                />

                {/* Cute wings */}
                <path
                    d={`M ${-props.r * 0.4} ${-props.r * 0.2} 
                        Q ${-props.r * 0.6} ${-props.r * 0.4} 
                          ${-props.r * 0.8} ${-props.r * 0.2}
                        Q ${-props.r * 0.6} 0 
                          ${-props.r * 0.4} ${-props.r * 0.2} Z`}
                    fill="#34495e"
                    opacity="0.8"
                >
                    <animate
                        attributeName="d"
                        dur="0.8s"
                        repeatCount="indefinite"
                        values={`
                            M ${-props.r * 0.4} ${-props.r * 0.2} 
                            Q ${-props.r * 0.6} ${-props.r * 0.4} 
                              ${-props.r * 0.8} ${-props.r * 0.2}
                            Q ${-props.r * 0.6} 0 
                              ${-props.r * 0.4} ${-props.r * 0.2} Z;
                            M ${-props.r * 0.4} ${-props.r * 0.2} 
                            Q ${-props.r * 0.5} ${-props.r * 0.3} 
                              ${-props.r * 0.6} ${-props.r * 0.2}
                            Q ${-props.r * 0.5} ${-props.r * 0.1} 
                              ${-props.r * 0.4} ${-props.r * 0.2} Z
                        `}
                    />
                </path>
                <path
                    d={`M ${props.r * 0.4} ${-props.r * 0.2} 
                        Q ${props.r * 0.6} ${-props.r * 0.4} 
                          ${props.r * 0.8} ${-props.r * 0.2}
                        Q ${props.r * 0.6} 0 
                          ${props.r * 0.4} ${-props.r * 0.2} Z`}
                    fill="#34495e"
                    opacity="0.8"
                >
                    <animate
                        attributeName="d"
                        dur="0.8s"
                        repeatCount="indefinite"
                        values={`
                            M ${props.r * 0.4} ${-props.r * 0.2} 
                            Q ${props.r * 0.6} ${-props.r * 0.4} 
                              ${props.r * 0.8} ${-props.r * 0.2}
                            Q ${props.r * 0.6} 0 
                              ${props.r * 0.4} ${-props.r * 0.2} Z;
                            M ${props.r * 0.4} ${-props.r * 0.2} 
                            Q ${props.r * 0.5} ${-props.r * 0.3} 
                              ${props.r * 0.6} ${-props.r * 0.2}
                            Q ${props.r * 0.5} ${-props.r * 0.1} 
                              ${props.r * 0.4} ${-props.r * 0.2} Z
                        `}
                    />
                </path>

                {/* Glowing center */}
                <circle
                    cx={0}
                    cy={0}
                    r={props.r * 0.5}
                    fill="url(#fireflyGlow)"
                >
                    <animate
                        attributeName="r"
                        values={`${props.r * 0.5};${props.r * 0.55};${props.r * 0.5}`}
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </circle>
            </g>
        );
    }

    // Other blobs are glowing orbs
    return (
        <g transform={`translate(${props.position.x}, ${props.position.y})`}>
            {/* Outer glow */}
            <circle
                r={props.r * 1.2}
                fill="url(#orbGlow)"
                opacity="0.3"
            >
                <animate
                    attributeName="opacity"
                    values="0.3;0.5;0.3"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>
            
            {/* Main orb */}
            <circle
                style={transition}
                r={props.r * 0.8}
                fill="url(#orbGlow)"
            >
                <animate
                    attributeName="r"
                    values={`${props.r * 0.8};${props.r * 0.85};${props.r * 0.8}`}
                    dur="1s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Inner glow */}
            <circle
                style={transition}
                r={props.r * 0.4}
                fill="#fff"
                opacity="0.8"
            >
                <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </circle>
        </g>
    );
};

export default Blob;