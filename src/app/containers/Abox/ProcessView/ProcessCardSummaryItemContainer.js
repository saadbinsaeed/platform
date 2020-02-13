/* @flow */

import React from 'react';
import ProcessCardSummaryItem from 'app/components/molecules/Summary/ProcessCardSummaryItem';
import Slider from 'app/components/molecules/Slider/slider';
import styled from 'styled-components';
import { sliderSettings } from 'app/utils/slider/summarySliderUtils';
import { onlyUpdateForKeys } from 'recompose';

const SummaryWrapper = styled.section`
    .Icon {
        &:before {
            color: ${({ theme }) => theme.base.textColor};
        }
    }
    .slick-initialized {
        padding-bottom: .8rem;
        button.slick-arrow {
            opacity: 0.8;
        }
        button.slick-arrow.slick-disabled {
            opacity: 0.1;
        }
    }
`;


const ProcessCardSummaryItemContainer: Object = onlyUpdateForKeys(['summary'])((props: Object): Object => {
    const { summary } = props;
    return (
        <SummaryWrapper>
            <Slider {...sliderSettings}>
                {(summary || []).map(({ key, value }) => <ProcessCardSummaryItem key={key} displayName={key} value={value || 'No Value'} />)}
            </Slider>
        </SummaryWrapper>
    );
});

export default ProcessCardSummaryItemContainer;
