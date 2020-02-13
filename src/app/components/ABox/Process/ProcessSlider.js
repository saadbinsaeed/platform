/* @flow */

import React from 'react';
import styled from 'styled-components';
import SummaryItem from 'app/components/molecules/Summary/SummaryItem';
import Slider from 'app/components/molecules/Slider/slider';
import { sliderSettings } from 'app/utils/slider/summarySliderUtils';
import { formatDate } from 'app/utils/date/date';

const SummaryWrapper = styled.section`
    margin-bottom: 1rem;
    box-shadow: ${({ theme }) => theme.shadow.z1};
    .Icon {
        &:before {
            color: ${({ theme }) => theme.base.textColor};
        }
    }
`;

const ProcessSlider: Object = (props: Object): Object => {
    const { summary = {} } = props;
    const { definition = [], variables = {} } = summary;
    return (
        <SummaryWrapper className={'summary-wrapper'}>
            <Slider {...sliderSettings}>
                {definition
                    .filter(({ hide }) => !hide)
                    .map(({ label, name, code }, index) => {
                        let value = variables[name];
                        if (value === undefined && code) {
                            try {
                                // $FlowFixMe
                                value = Function(`var variables = arguments[0]; ${code}`)({ endDate: (variables.endDate && new Date(variables.endDate)), createDate: new Date(variables.createDate) }); // eslint-disable-line
                                // code above is really fucked up. I.e. why are we doing something like that?..
                            } catch (e) {
                                // console.error(e);
                            }
                        } else if (name === 'endDateFormatted') {
                            value = formatDate(variables[name]);
                        }
                        return (
                            <SummaryItem
                                key={index}
                                displayName={label}
                                value={value || 'No Value'}
                            />
                        );
                    })}
            </Slider>
        </SummaryWrapper>
    );
};

export default ProcessSlider;
