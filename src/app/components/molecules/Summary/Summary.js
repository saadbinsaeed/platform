/* @flow */

import React from 'react';
import styled from 'styled-components';
import { sliderSettings } from 'app/utils/slider/summarySliderUtils';
import SummaryItem from './SummaryItem';
import Slider from '../Slider';
import { displayByKind } from 'app/utils/date/date';

const SummaryWrapper = styled.section`
  margin-bottom: 1rem;
  box-shadow: ${ ({theme} ) => theme.shadow.z1 };
  .Icon {
    &:before {
      color: ${ ({theme} ) => theme.base.textColor };
    }
  }
`;

const formatValue = (meta: Object, value: any) => {
    const { type, text_ext, text_ext_position, kind } = meta || {};
    let val = value;
    switch (type) {
        case 'timestamp':
            val = displayByKind(kind, value);
            break;
        case 'bool':
            val = value ? 'Yes' : 'No';
            break;
        case 'custom':
            if (value && typeof value === 'object' && value.id !== undefined && value.name !== undefined) {
                val = `${value.name} (${value.id})`;
            }
            break;
        default:
    }
    if (text_ext_position && text_ext) {
        return text_ext_position === 'before' ? `${text_ext}${val}` : `${val}${text_ext}`;
    }
    return val;
};

const generateReactElement = ({ values, metadata }: { values: Object, metadata: Object }) => {
    const keys = Object.keys(values);
    return keys.map((key, i) => {
        const meta = metadata[key];
        const value = formatValue(meta, values[key]);
        const label = meta && meta.name;
        return (
            <div key={i}>
                <SummaryItem key={i} displayName={label} value={value || ''}/>
            </div>
        );
    });
};

const Summary = ({ values, metadata }: { values: Object, metadata: Object }) => {
    if (!values || !Object.keys(values).length) {
        return null;
    }
    const elements = generateReactElement({ values, metadata });
    return (
        <SummaryWrapper>
            <Slider {...sliderSettings}>{elements}</Slider>
        </SummaryWrapper>
    );
};

export default Summary;
