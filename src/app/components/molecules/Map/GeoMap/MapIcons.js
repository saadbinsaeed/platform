// @flow

import React from 'react';
import styled from 'styled-components';
import DivIcon from 'react-leaflet-div-icon';
import { onlyUpdateForKeys } from 'recompose';
import { priorityColor } from 'app/utils/styles/PriorityColor';
import Avatar from 'app/components/molecules/Avatar/Avatar';

/**
 * We need a function to take the priority string, extract the number, convert to a number and pass to the priorityColor function to get the correct color.
 * @param p
 * @returns {string}
 */
function convertPriorityStringToNumber(p) {
    return priorityColor(Number(Object.keys(p).toString().replace(/[^0-9.]/g, '')));
}

/**
 * Convert the priority level object to value string
 * @param l
 * @returns {any[]}
 */
function convertPriorityLevel(l) {
    return Object.values(l).toString();
}

/**
 * Basic Markers to cover some leaflet basics
 */

const Svg = styled.svg`
    width: 60px;
    background: transparent;
    border-radius: 50%;
`;

const FeatureMarker = styled.div`
    position: absolute;
    z-index: 1000;
    margin-left: -20px;
    margin-top: -20px;
`;

const ImageMarker = styled(FeatureMarker)`
    border-radius: 50%;
    width: 36px;
    height: 36px;
    border: solid 2px white;
`;

export const MyMarkerComponent = (props: { position: Array<number>, user: Object }) => {
    return <DivIcon position={props.position}>
        <ImageMarker>
            <Avatar src={props.user.image} width={'32px'} height={'32px'} />
        </ImageMarker>
    </DivIcon>;
};

export const MyMarker = onlyUpdateForKeys(['position', 'user'])(MyMarkerComponent);


const Cluster4Component = (props: { position: Object, priorityLevels: Array<Object>, onClick: Function }) => {
    return <DivIcon position={props.position} onClick={props.onClick}>
        <FeatureMarker>
            <Svg width="100%" height="100%" viewBox="0 0 126 129">
                <g transform="matrix(0.065625,0,0,0.119444,0,0)">
                    <rect x="0" y="0" width="1920" height="1080" style={{ fill: 'none' }} />
                    <g transform="matrix(15.2381,0,0,8.37209,-594.286,-552.558)">
                        <circle cx="101.5" cy="129.5" r="61.5" style={{fill:'white'}}/>
                    </g>
                    <g transform="matrix(15.2381,0,0,8.37209,-579.048,-510.698)">
                        <g transform="matrix(1,0,0,1,2.08337e-05,-12)">
                            <path d="M100.5,83L100.5,83C130.027,83 154,106.973 154,136.5L100.5,136.5L100.5,83Z" fill={convertPriorityStringToNumber(props.priorityLevels[1])} />
                        </g>
                        <g transform="matrix(-1,0,0,1,201,-12)">
                            <path d="M100.5,83L100.5,83C130.027,83 154,106.973 154,136.5L100.5,136.5L100.5,83Z" fill={convertPriorityStringToNumber(props.priorityLevels[3])} />
                        </g>
                        <g transform="matrix(1,0,0,-1,1.04168e-05,261)">
                            <path d="M100.5,83L100.5,83C130.027,83 154,106.973 154,136.5L100.5,136.5L100.5,83Z" fill={convertPriorityStringToNumber(props.priorityLevels[0])} />
                        </g>
                        <g transform="matrix(-1,0,0,-1,201,261)">
                            <path d="M100.5,83L100.5,83C130.027,83 154,106.973 154,136.5L100.5,136.5L100.5,83Z" fill={convertPriorityStringToNumber(props.priorityLevels[2])} />
                        </g>
                    </g>
                    <g transform="matrix(15.2381,0,0,8.37209,-73.8652,20.5931)">
                        <text x="39.428px" y="44.72px" style={{fontFamily:'Verdana, sans-serif', fontSize:'20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[3])}</text>
                    </g>
                    <g transform="matrix(15.2381,0,0,8.37209,623.133,23.1673)">
                        <text x="39.428px" y="44.72px" style={{fontFamily:'Verdana, sans-serif', fontSize:'20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[2])}</text>
                    </g>
                    <g transform="matrix(15.2381,0,0,8.37209,-65.9081,406.714)">
                        <text x="39.428px" y="44.72px" style={{fontFamily:'Verdana, sans-serif', fontSize:'20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[1])}</text>
                    </g>
                    <g transform="matrix(15.2381,0,0,8.37209,585.336,409.288)">
                        <text x="39.428px" y="44.72px" style={{fontFamily:'Verdana, sans-serif', fontSize:'20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[0])}</text>
                    </g>
                </g>
            </Svg>
        </FeatureMarker>
    </DivIcon>;
};
export const Cluster4 = onlyUpdateForKeys(['position', 'priorityLevels', 'onClick'])(Cluster4Component);

const Cluster3Component = (props: { position: Object, priorityLevels: Array<Object>, onClick: Function }) => {
    return <DivIcon position={props.position} onClick={props.onClick}>
        <FeatureMarker>
            <Svg width="100%" height="100%" viewBox="0 0 126 129">
                <g transform="matrix(1,0,0,1,-314,0)">
                    <g transform="matrix(0.065625,0,0,0.119444,314,0)">
                        <rect x="0" y="0" width="1920" height="1080" style={{fill:'none'}}/>
                        <g transform="matrix(15.2381,0,0,8.37209,-594.286,-544.186)">
                            <circle cx="101.5" cy="129.5" r="61.5" style={{fill:'white'}}/>
                        </g>
                        <g transform="matrix(15.2381,0,0,8.37209,-579.047,-2819.31)">
                            <g transform="matrix(1,0,0,1,-1.39247e-05,33)">
                                <path d="M100.5,315L100.5,368.5L54.168,395.25C49.628,387.387 47.166,378.502 47.008,369.433L47.006,369.284L47.004,369.163L47.001,368.885L47.001,368.802L47,368.5C47,338.972 70.972,315 100.5,315Z" fill={convertPriorityStringToNumber(props.priorityLevels[2])}/>
                            </g>
                            <g transform="matrix(-1,0,0,1,201,33)">
                                <path d="M100.5,315L100.5,368.5L54.168,395.25C49.628,387.387 47.166,378.502 47.008,369.433L47.006,369.284L47.004,369.163L47.001,368.885L47.001,368.802L47,368.5C47,338.972 70.972,315 100.5,315Z" fill={convertPriorityStringToNumber(props.priorityLevels[1])}/>
                            </g>
                            <g transform="matrix(0.5,-0.866025,-0.866025,-0.5,369.213,672.286)">
                                <path d="M100.5,315L100.5,368.5L54.168,395.25C49.628,387.387 47.166,378.502 47.008,369.433L47.006,369.284L47.004,369.163L47.001,368.885L47.001,368.802L47,368.5C47,338.972 70.972,315 100.5,315Z" fill={convertPriorityStringToNumber(props.priorityLevels[0])}/>
                            </g>
                        </g>
                        <g transform="matrix(15.2381,0,0,8.37209,-143.774,110.688)">
                            <text x="39.428px" y="44.72px" style={{fontFamily: 'Verdana , sans-serif', fontSize: '20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[0])}</text>
                        </g>
                        <g transform="matrix(15.2381,0,0,8.37209,611.716,107.47)">
                            <text x="39.428px" y="44.72px" style={{fontFamily: 'Verdana , sans-serif', fontSize: '20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[1])}</text>
                        </g>
                        <g transform="matrix(15.2381,0,0,8.37209,248.612,471.068)">
                            <text x="39.428px" y="44.72px" style={{fontFamily: 'Verdana , sans-serif', fontSize: '20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[2])}</text>
                        </g>
                    </g>
                </g>
            </Svg>
        </FeatureMarker>
    </DivIcon>;
};
export const Cluster3 = onlyUpdateForKeys(['position', 'priorityLevels', 'onClick'])(Cluster3Component);


export const Cluster2Component = (props: { position: Object, priorityLevels: Array<Object>, onClick: Function }) => {
    return <DivIcon position={props.position} onClick={props.onClick}>
        <FeatureMarker>
            <Svg width="100%" height="100%" viewBox="0 0 126 129">
                <g transform="matrix(1,0,0,1,-314,0)">
                    <g transform="matrix(0.065625,0,0,0.119444,314,0)">
                        <rect x="0" y="0" width="1920" height="1080" style={{fill:'none'}}/>
                        <g transform="matrix(15.2381,0,0,8.37209,-579.048,-544.186)">
                            <circle cx="101.5" cy="129.5" r="61.5" style={{fill: 'white'}} />
                        </g>
                        <g transform="matrix(15.2381,0,0,8.37209,-563.81,-1573.95)">
                            <path d="M100.5,252.5L100.5,306L100.5,306L100.493,306C70.969,305.996 47,282.025 47,252.5C47,222.973 70.972,199 100.5,199L100.5,252.5Z" fill={convertPriorityStringToNumber(props.priorityLevels[1])} />
                            <g transform="matrix(-1,0,0,1,201,0)">
                                <path d="M100.5,252.5L100.5,306L100.5,306L100.493,306C70.969,305.996 47,282.025 47,252.5C47,222.973 70.972,199 100.5,199L100.5,252.5Z" fill={convertPriorityStringToNumber(props.priorityLevels[0])} />
                            </g>
                        </g>
                        <g transform="matrix(15.2381,0,0,8.37209,-134.448,223.307)">
                            <text x="39.428px" y="44.72px" style={{fontFamily: 'Verdana , sans-serif', fontSize: '20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[0])}</text>
                        </g>
                        <g transform="matrix(15.2381,0,0,8.37209,650.324,220.089)">
                            <text x="39.428px" y="44.72px" style={{fontFamily: 'Verdana , sans-serif', fontSize: '20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[1])}</text>
                        </g>
                    </g>
                </g>
            </Svg>
        </FeatureMarker>
    </DivIcon>;
};
export const Cluster2 = onlyUpdateForKeys(['position', 'priorityLevels', 'onClick'])(Cluster2Component);


export const Cluster1Component = (props: { position: Object, priorityLevels: Array<Object>, onClick: Function }) => {
    return <DivIcon position={props.position} onClick={props.onClick}>
        <FeatureMarker>
            <Svg width="100%" height="100%" viewBox="0 0 126 129">
                <g transform="matrix(1,0,0,1,-628,0)">
                    <g id="mapchart1x" transform="matrix(0.065625,0,0,0.119444,628.775,0)">
                        <rect x="0" y="0" width="1920" height="1080" fill="none" />
                        <g transform="matrix(15.2381,0,0,8.37209,-579.048,-544.186)">
                            <circle cx="101.5" cy="129.5" r="61.5" fill="white"/>
                        </g>
                        <g transform="matrix(15.2381,0,0,8.37209,-7135.05,-5.14828)">
                            <circle cx="532.312" cy="65.435" r="53.192" fill={convertPriorityStringToNumber(props.priorityLevels[0])} />
                        </g>
                        <g transform="matrix(15.2381,0,0,8.37209,278.544,229.109)">
                            <text x="39.428px" y="44.72px" style={{fontFamily: 'Verdana , sans-serif', fontSize: '20px', fill:'white'}}>{convertPriorityLevel(props.priorityLevels[0])}</text>
                        </g>
                    </g>
                </g>
            </Svg>
        </FeatureMarker>
    </DivIcon>;
};
export const Cluster1 = onlyUpdateForKeys(['position', 'priorityLevels', 'onClick'])(Cluster1Component);


const baseSvgMarketSize = {
    width: '70px',
    height: '70px'
};

const BaseSvgMarkerComponent = (props: { position: Object, priority?: number, svgIconPath?: string, onClick?: Function  }) => {
    return <DivIcon position={props.position} onClick={props.onClick}>
        <FeatureMarker style={baseSvgMarketSize}>
            <svg width="70px" height="70px" viewBox="0 0 69 69">
                <rect id="BaseMarker" x="0" y="0" width="69.5" height="69.5" fill="none"/>
                <path d="M35.436,5.615c-11.244,0 -20.359,8.977 -20.359,20.051c0,3.562 0.971,6.893 2.624,9.79c0.275,0.481 0.563,0.955 0.875,1.411l16.86,28.901l16.86,-28.901c0.259,-0.378 0.483,-0.779 0.715,-1.175l0.16,-0.236c1.652,-2.897 2.624,-6.228 2.624,-9.79c0,-11.074 -9.116,-20.051 -20.359,-20.051Z" fill={priorityColor(Number(props.priority))}/>
                <svg x="23" y="18" width="100%" height="100%" viewBox="0 0 69 69">
                    {(props.svgIconPath && <path fill="white" d={props.svgIconPath} />) || <circle cx="12.156" cy="9.05" r="4.504" fill="white" /> }
                </svg>
            </svg>
        </FeatureMarker>
    </DivIcon>;
};

// Add our common icon keys here, as they're all the same and I don't want to repeat myself with every change.
const iconKeys = ['position', 'priority', 'svgIconPath', 'onClick'];

export const BaseSvgMarker = onlyUpdateForKeys(iconKeys)(BaseSvgMarkerComponent);

export const DefaultSvgMarker = onlyUpdateForKeys(['position', 'priority', 'onClick'])((props: Object) => {
    return <BaseSvgMarker position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const EnvironmentalMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const ActivityMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M18,1.83C17.5,1.83 17,2 16.59,2.41C13.72,5.28 8,11 8,11L9.5,12.5L6,16H4L2,20L4,22L8,20V18L11.5,14.5L13,16C13,16 18.72,10.28 21.59,7.41C22.21,6.5 22.37,5.37 21.59,4.59L19.41,2.41C19,2 18.5,1.83 18,1.83M18,4L20,6L13,13L11,11L18,4Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const HybridMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M23.05,11H20.05V4L15.05,14H18.05V22M12,20H4L4.05,6H12.05M12.72,4H11.05V2H5.05V4H3.38A1.33,1.33 0 0,0 2.05,5.33V20.67C2.05,21.4 2.65,22 3.38,22H12.72C13.45,22 14.05,21.4 14.05,20.67V5.33A1.33,1.33 0 0,0 12.72,4Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const SolarMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26L6.76,4.84Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const DieselMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14C17,12.89 16.1,12 15,12H14V5C14,3.89 13.1,3 12,3H6C4.89,3 4,3.89 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const RectifierMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M1294.03,636.301L1270.48,659.85L1255.88,645.253L1279.5,621.642L1279.5,410.627L1254.01,385.14L1268.61,370.543L1293.09,395.03L1519.24,395.03L1546.55,367.728L1561.14,382.325L1534.72,408.751L1534.72,619.766L1561.14,646.191L1546.55,660.788L1521.94,636.177L1521.58,636.177L1521.58,636.301L1294.03,636.301ZM1300.14,415.673L1300.14,615.658L1514.08,615.658L1514.08,415.673L1300.14,415.673ZM1435.35,478.879L1460.1,449.021L1466.6,454.41L1441.86,484.268L1465.37,503.752C1467.25,505.316 1468.2,507.746 1467.86,510.174C1467.52,512.602 1465.95,514.681 1463.7,515.669L1402.18,542.785L1447.47,580.325L1441.49,587.549L1392.58,547.015L1388.28,548.908L1360.62,582.283L1354.12,576.894L1381.15,544.279L1382.46,538.633L1334.56,498.934L1340.55,491.709L1384.84,528.414L1399.43,465.629C1400.12,462.662 1402.3,460.264 1405.19,459.291C1408.07,458.318 1411.26,458.908 1413.6,460.852L1435.35,478.879Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const InfrastructureMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z'}  position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const ControlPanelMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M5,3V12H3V14H5V21H7V14H9V12H7V3M11,3V8H9V10H11V21H13V10H15V8H13V3M17,3V14H15V16H17V21H19V16H21V14H19V3'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const DcdgGenMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M96.255,106.876c0.738,0 1.388,-0.061 1.962,-0.19c0.566,-0.123 1.106,-0.293 1.611,-0.505l0,-3.49l-2.277,0c-0.336,0 -0.601,-0.089 -0.787,-0.27c-0.187,-0.181 -0.285,-0.405 -0.285,-0.678l0,-2.938l8.183,0l0,9.716c-0.589,0.431 -1.203,0.802 -1.841,1.118c-0.638,0.307 -1.315,0.56 -2.039,0.764c-0.721,0.201 -1.491,0.347 -2.307,0.442c-0.815,0.095 -1.694,0.141 -2.63,0.141c-1.684,0 -3.243,-0.299 -4.673,-0.894c-1.437,-0.594 -2.677,-1.413 -3.723,-2.461c-1.045,-1.048 -1.87,-2.289 -2.464,-3.731c-0.595,-1.436 -0.893,-2.996 -0.893,-4.685c0,-1.717 0.287,-3.291 0.853,-4.727c0.568,-1.436 1.381,-2.677 2.441,-3.72c1.06,-1.042 2.338,-1.855 3.84,-2.435c1.502,-0.58 3.177,-0.87 5.032,-0.87c0.957,0 1.858,0.077 2.7,0.241c0.842,0.158 1.617,0.37 2.329,0.646c0.713,0.276 1.365,0.6 1.953,0.982c0.589,0.377 1.118,0.784 1.583,1.23l-1.548,2.355c-0.149,0.218 -0.325,0.393 -0.531,0.523c-0.204,0.123 -0.428,0.189 -0.67,0.189c-0.316,0 -0.646,-0.106 -0.982,-0.319c-0.419,-0.252 -0.819,-0.471 -1.192,-0.657c-0.373,-0.181 -0.755,-0.331 -1.146,-0.449c-0.388,-0.117 -0.796,-0.201 -1.229,-0.252c-0.434,-0.052 -0.916,-0.078 -1.454,-0.078c-1.005,0 -1.901,0.175 -2.702,0.529c-0.799,0.353 -1.482,0.853 -2.045,1.493c-0.563,0.646 -1,1.413 -1.304,2.318c-0.302,0.899 -0.457,1.901 -0.457,3.007c0,1.224 0.17,2.312 0.506,3.254c0.339,0.948 0.804,1.75 1.398,2.407c0.595,0.652 1.301,1.149 2.114,1.494c0.81,0.33 1.706,0.5 2.674,0.5Zm-39.575,-2.1c0.129,0 0.252,0.023 0.382,0.066c0.126,0.052 0.247,0.129 0.364,0.247l2.114,2.226c-0.925,1.212 -2.088,2.125 -3.484,2.743c-1.396,0.612 -3.047,0.919 -4.954,0.919c-1.747,0 -3.315,-0.299 -4.699,-0.893c-1.385,-0.595 -2.562,-1.413 -3.524,-2.462c-0.962,-1.048 -1.704,-2.289 -2.218,-3.731c-0.517,-1.436 -0.775,-2.995 -0.775,-4.684c0,-1.718 0.296,-3.292 0.885,-4.728c0.591,-1.436 1.413,-2.677 2.47,-3.719c1.059,-1.043 2.329,-1.856 3.799,-2.436c1.471,-0.58 3.102,-0.87 4.883,-0.87c0.862,0 1.675,0.077 2.442,0.23c0.764,0.152 1.476,0.364 2.136,0.634c0.664,0.27 1.276,0.589 1.836,0.965c0.557,0.371 1.054,0.785 1.488,1.241l-1.801,2.413c-0.118,0.152 -0.256,0.287 -0.414,0.405c-0.161,0.123 -0.379,0.184 -0.663,0.184c-0.19,0 -0.368,-0.046 -0.537,-0.13c-0.173,-0.083 -0.348,-0.183 -0.538,-0.307c-0.189,-0.118 -0.399,-0.253 -0.626,-0.393c-0.227,-0.147 -0.497,-0.276 -0.804,-0.4c-0.31,-0.117 -0.672,-0.218 -1.091,-0.307c-0.42,-0.083 -0.902,-0.123 -1.462,-0.123c-0.971,0 -1.856,0.169 -2.654,0.511c-0.802,0.342 -1.488,0.836 -2.062,1.47c-0.575,0.641 -1.023,1.408 -1.345,2.318c-0.318,0.902 -0.482,1.925 -0.482,3.048c0,1.183 0.164,2.226 0.482,3.148c0.319,0.913 0.759,1.688 1.313,2.312c0.551,0.629 1.195,1.105 1.936,1.43c0.735,0.325 1.525,0.488 2.367,0.488c0.485,0 0.924,-0.023 1.329,-0.066c0.4,-0.052 0.77,-0.129 1.112,-0.247c0.342,-0.112 0.669,-0.264 0.982,-0.448c0.307,-0.184 0.623,-0.416 0.939,-0.689c0.127,-0.101 0.262,-0.19 0.411,-0.259c0.149,-0.069 0.307,-0.106 0.463,-0.106Zm-29.966,5.954l-8.938,0l0,-23.018l8.938,0c1.792,0 3.421,0.293 4.891,0.871c1.471,0.577 2.723,1.378 3.769,2.401c1.039,1.019 1.849,2.237 2.427,3.642c0.568,1.404 0.856,2.938 0.856,4.587c0,1.665 -0.288,3.202 -0.859,4.607c-0.577,1.407 -1.385,2.625 -2.427,3.65c-1.043,1.025 -2.298,1.824 -3.768,2.401c-1.468,0.572 -3.096,0.859 -4.889,0.859Zm44.2,0l-8.938,0l0,-23.018l8.938,0c1.792,0 3.418,0.293 4.888,0.871c1.471,0.577 2.726,1.378 3.772,2.401c1.039,1.019 1.849,2.237 2.424,3.642c0.571,1.404 0.859,2.938 0.859,4.587c0,1.665 -0.291,3.202 -0.862,4.607c-0.575,1.407 -1.382,2.625 -2.424,3.65c-1.043,1.025 -2.301,1.824 -3.771,2.401c-1.465,0.572 -3.094,0.859 -4.886,0.859Zm-44.197,-18.913l-3.567,0l0,14.803l3.567,0c1.02,0 1.936,-0.17 2.734,-0.511c0.799,-0.342 1.479,-0.836 2.028,-1.471c0.554,-0.64 0.979,-1.413 1.272,-2.335c0.293,-0.908 0.443,-1.942 0.443,-3.09c0,-1.135 -0.15,-2.16 -0.443,-3.079c-0.295,-0.914 -0.718,-1.689 -1.272,-2.33c-0.549,-0.64 -1.229,-1.128 -2.028,-1.47c-0.798,-0.342 -1.714,-0.517 -2.734,-0.517Zm44.2,0l-3.57,0l0,14.803l3.57,0c1.02,0 1.933,-0.17 2.734,-0.511c0.796,-0.342 1.477,-0.836 2.028,-1.471c0.551,-0.64 0.979,-1.413 1.269,-2.335c0.296,-0.908 0.443,-1.942 0.443,-3.09c0,-1.135 -0.147,-2.16 -0.443,-3.079c-0.292,-0.914 -0.718,-1.689 -1.269,-2.33c-0.551,-0.64 -1.232,-1.128 -2.028,-1.47c-0.801,-0.342 -1.714,-0.517 -2.734,-0.517Zm14.056,-10.893l-54.571,0l0,-51.699l54.571,0l0,51.699Zm-5.744,-43.083l-43.083,0l0,34.466l43.083,0l0,-34.466Zm-2.872,31.594l-37.338,0l0,-28.722l37.338,0l0,28.722Zm-20.105,-11.489l-11.489,0l0,5.745l11.489,0l0,-5.745Zm16.092,-4.552l-1.352,0l0,3.981l1.352,0l0,-3.981Zm-34.664,-44.305l0,16.625l14.45,0c0,-8.617 -5.833,-16.625 -14.45,-16.625Zm-2.872,16.625l-4.015,0l-3.461,-17.234l7.476,0l0,17.234Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const AcdgGenMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M98.181,109.819c0.783,0 1.474,-0.064 2.08,-0.201c0.604,-0.131 1.173,-0.311 1.71,-0.537l0,-3.701l-2.413,0c-0.357,0 -0.637,-0.095 -0.838,-0.286c-0.198,-0.192 -0.302,-0.43 -0.302,-0.719l0,-3.117l8.68,0l0,10.306c-0.625,0.457 -1.274,0.85 -1.953,1.185c-0.673,0.326 -1.395,0.595 -2.16,0.811c-0.768,0.213 -1.584,0.368 -2.446,0.469c-0.869,0.101 -1.798,0.149 -2.791,0.149c-1.788,0 -3.439,-0.317 -4.96,-0.947c-1.52,-0.631 -2.836,-1.499 -3.948,-2.611c-1.109,-1.112 -1.98,-2.428 -2.611,-3.958c-0.631,-1.526 -0.947,-3.18 -0.947,-4.971c0,-1.822 0.301,-3.492 0.904,-5.015c0.601,-1.523 1.463,-2.839 2.59,-3.945c1.127,-1.106 2.48,-1.968 4.07,-2.584c1.594,-0.612 3.373,-0.923 5.338,-0.923c1.017,0 1.971,0.082 2.867,0.256c0.892,0.168 1.715,0.393 2.47,0.685c0.756,0.293 1.447,0.637 2.072,1.042c0.624,0.399 1.185,0.832 1.676,1.304l-1.643,2.498c-0.158,0.232 -0.341,0.418 -0.563,0.555c-0.216,0.131 -0.451,0.201 -0.71,0.201c-0.335,0 -0.682,-0.113 -1.039,-0.338c-0.445,-0.268 -0.868,-0.5 -1.267,-0.698c-0.396,-0.192 -0.802,-0.35 -1.213,-0.475c-0.411,-0.125 -0.847,-0.213 -1.307,-0.268c-0.46,-0.055 -0.972,-0.082 -1.541,-0.082c-1.064,0 -2.017,0.185 -2.864,0.56c-0.85,0.375 -1.575,0.905 -2.172,1.584c-0.594,0.686 -1.06,1.499 -1.38,2.459c-0.323,0.953 -0.488,2.017 -0.488,3.19c0,1.297 0.18,2.452 0.536,3.451c0.36,1.006 0.853,1.856 1.484,2.553c0.631,0.692 1.38,1.219 2.245,1.585c0.86,0.353 1.807,0.533 2.834,0.533Zm-41.973,-2.227c0.134,0 0.269,0.024 0.403,0.07c0.134,0.055 0.265,0.137 0.386,0.262l2.246,2.361c-0.984,1.285 -2.218,2.254 -3.696,2.909c-1.48,0.649 -3.232,0.975 -5.255,0.975c-1.855,0 -3.516,-0.317 -4.987,-0.947c-1.472,-0.631 -2.715,-1.499 -3.738,-2.611c-1.021,-1.112 -1.807,-2.428 -2.352,-3.958c-0.549,-1.523 -0.82,-3.177 -0.82,-4.969c0,-1.821 0.311,-3.491 0.936,-5.014c0.627,-1.523 1.498,-2.84 2.623,-3.945c1.124,-1.106 2.467,-1.969 4.027,-2.584c1.566,-0.612 3.29,-0.923 5.179,-0.923c0.914,0 1.776,0.082 2.59,0.244c0.81,0.161 1.569,0.387 2.27,0.673c0.7,0.286 1.349,0.625 1.946,1.024c0.588,0.393 1.115,0.831 1.575,1.316l-1.91,2.559c-0.122,0.161 -0.271,0.304 -0.439,0.429c-0.167,0.131 -0.402,0.195 -0.7,0.195c-0.201,0 -0.393,-0.048 -0.573,-0.137c-0.18,-0.088 -0.369,-0.195 -0.57,-0.326c-0.198,-0.125 -0.423,-0.268 -0.664,-0.417c-0.237,-0.155 -0.524,-0.293 -0.853,-0.424c-0.329,-0.124 -0.713,-0.231 -1.158,-0.326c-0.441,-0.088 -0.956,-0.131 -1.547,-0.131c-1.03,0 -1.968,0.18 -2.815,0.543c-0.85,0.362 -1.581,0.886 -2.191,1.56c-0.606,0.679 -1.081,1.492 -1.422,2.458c-0.342,0.957 -0.512,2.041 -0.512,3.233c0,1.255 0.17,2.361 0.512,3.339c0.338,0.968 0.804,1.791 1.389,2.452c0.585,0.667 1.27,1.173 2.053,1.517c0.783,0.344 1.621,0.518 2.514,0.518c0.511,0 0.981,-0.024 1.407,-0.07c0.427,-0.055 0.82,-0.137 1.182,-0.262c0.363,-0.119 0.707,-0.28 1.039,-0.475c0.332,-0.195 0.664,-0.442 0.996,-0.731c0.137,-0.107 0.281,-0.201 0.436,-0.275c0.167,-0.076 0.326,-0.112 0.493,-0.112Zm-17.374,6.315l-4.39,0c-0.491,0 -0.896,-0.113 -1.213,-0.338c-0.316,-0.232 -0.542,-0.524 -0.661,-0.88l-1.444,-4.26l-9.283,0l-1.444,4.26c-0.109,0.31 -0.326,0.594 -0.652,0.843c-0.326,0.25 -0.718,0.375 -1.188,0.375l-4.423,0l9.45,-24.415l5.801,0l9.447,24.415Zm32.47,0l-9.481,0l0,-24.415l9.481,0c1.901,0 3.628,0.311 5.188,0.923c1.56,0.613 2.888,1.463 3.997,2.547c1.103,1.082 1.962,2.373 2.575,3.863c0.606,1.49 0.908,3.117 0.908,4.866c0,1.767 -0.305,3.396 -0.911,4.886c-0.613,1.493 -1.469,2.785 -2.575,3.872c-1.106,1.088 -2.437,1.935 -3.997,2.547c-1.553,0.606 -3.284,0.911 -5.185,0.911Zm0.003,-20.061l-3.787,0l0,15.702l3.784,0c1.082,0 2.053,-0.18 2.9,-0.543c0.847,-0.362 1.569,-0.886 2.151,-1.56c0.588,-0.679 1.039,-1.498 1.35,-2.476c0.314,-0.963 0.472,-2.06 0.472,-3.278c0,-1.204 -0.158,-2.291 -0.469,-3.266c-0.314,-0.969 -0.762,-1.792 -1.35,-2.471c-0.582,-0.68 -1.304,-1.197 -2.151,-1.56c-0.846,-0.362 -1.818,-0.548 -2.9,-0.548Zm-48.16,10.73l6.669,0l-2.245,-6.688c-0.146,-0.423 -0.317,-0.923 -0.509,-1.498c-0.195,-0.576 -0.39,-1.198 -0.579,-1.868c-0.179,0.685 -0.362,1.316 -0.554,1.892c-0.189,0.582 -0.366,1.081 -0.536,1.511l-2.246,6.651Zm67.211,-22.623l-57.884,0l0,-54.838l57.884,0l0,54.838Zm-6.093,-45.699l-45.698,0l0,36.559l45.698,0l0,-36.559Zm-3.046,33.512l-39.605,0l0,-30.465l39.605,0l0,30.465Zm-21.326,-12.186l-12.186,0l0,6.093l12.186,0l0,-6.093Zm17.07,-4.829l-1.435,0l0,4.223l1.435,0l0,-4.223Zm-37.38,-46.655l0,17.633l15.328,0c0,-9.139 -6.188,-17.633 -15.328,-17.633Zm-3.046,17.633l-4.259,0l-3.671,-18.279l7.93,0l0,18.279Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const ActiveEquipmentMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const ForceMajeurMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M14.04,12H10V11H5.5A3.5,3.5 0 0,1 2,7.5A3.5,3.5 0 0,1 5.5,4C6.53,4 7.45,4.44 8.09,5.15C8.5,3.35 10.08,2 12,2C13.92,2 15.5,3.35 15.91,5.15C16.55,4.44 17.47,4 18.5,4A3.5,3.5 0 0,1 22,7.5A3.5,3.5 0 0,1 18.5,11H14.04V12M10,16.9V15.76H5V13.76H19V15.76H14.04V16.92L20,19.08C20.58,19.29 21,19.84 21,20.5A1.5,1.5 0 0,1 19.5,22H4.5A1.5,1.5 0 0,1 3,20.5C3,19.84 3.42,19.29 4,19.08L10,16.9Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const AccessMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const CascadedMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M12,10A2,2 0 0,1 14,12C14,12.5 13.82,12.94 13.53,13.29L16.7,22H14.57L12,14.93L9.43,22H7.3L10.47,13.29C10.18,12.94 10,12.5 10,12A2,2 0 0,1 12,10M12,8A4,4 0 0,0 8,12C8,12.5 8.1,13 8.28,13.46L7.4,15.86C6.53,14.81 6,13.47 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12C18,13.47 17.47,14.81 16.6,15.86L15.72,13.46C15.9,13 16,12.5 16,12A4,4 0 0,0 12,8M12,4A8,8 0 0,0 4,12C4,14.36 5,16.5 6.64,17.94L5.92,19.94C3.54,18.11 2,15.23 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12C22,15.23 20.46,18.11 18.08,19.94L17.36,17.94C19,16.5 20,14.36 20,12A8,8 0 0,0 12,4Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});

export const TowerMarker = onlyUpdateForKeys(iconKeys)((props: Object) => {
    return <BaseSvgMarker svgIconPath={'M12,10A2,2 0 0,1 14,12C14,12.5 13.82,12.94 13.53,13.29L16.7,22H14.57L12,14.93L9.43,22H7.3L10.47,13.29C10.18,12.94 10,12.5 10,12A2,2 0 0,1 12,10M12,8A4,4 0 0,0 8,12C8,12.5 8.1,13 8.28,13.46L7.4,15.86C6.53,14.81 6,13.47 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12C18,13.47 17.47,14.81 16.6,15.86L15.72,13.46C15.9,13 16,12.5 16,12A4,4 0 0,0 12,8M12,4A8,8 0 0,0 4,12C4,14.36 5,16.5 6.64,17.94L5.92,19.94C3.54,18.11 2,15.23 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12C22,15.23 20.46,18.11 18.08,19.94L17.36,17.94C19,16.5 20,14.36 20,12A8,8 0 0,0 12,4Z'} position={props.position} priority={props.priority} onClick={props.onClick} />;
});
