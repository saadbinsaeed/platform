/* eslint-disable */
import React from 'react';
import styled from 'styled-components';
import Icon from 'app/components/atoms/Icon/Icon';

const MapMarkerWrapper = styled(Icon)`
    position: relative;
    display: block;
`;

const MapMarkerIconShadow = styled(Icon)`
    position: absolute;
    z-index: 0;
    transform: skewX(-20deg) translateX(5px);
    &:before {
      color: black;
    }
`;

const MapMarketIcon = styled(Icon)`
    position: absolute;
    z-index: 1;
    opacity: 1 !important;
    ${({ color }) => color && `color: ${color}`}
`;

export const SimpleMarker = ({ text, iconInfo = {} }) => (
  <MapMarkerWrapper>
    <MapMarkerIconShadow
      name={iconInfo.name || "pin"}
      size="lg"
    />
    <MapMarketIcon
      name={iconInfo.name || "pin"}
      color={iconInfo.color}
      size="lg"
    />
  </MapMarkerWrapper>
);
