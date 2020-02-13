/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import styled, { css } from 'styled-components';
import Button from 'app/components/atoms/Button/Button';
import Icon from 'app/components/atoms/Icon/Icon';
import { Row, Col } from 'react-styled-flexboxgrid';
import Title from 'app/components/atoms/Title/Title';

const commonStyles = css`
    white-space: nowrap;
    max-width: 300px;
    overflow: hidden;
`;

const HeaderSubTitle = styled(Title)`
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.7rem;
    font-weight: 300;
    min-height: 16px;
    ${commonStyles}
`;
HeaderSubTitle.displayName = 'HeaderSubTitle';

const HeaderTitle = styled(Title)`
    ${commonStyles}
`;
HeaderTitle.displayName = 'HeaderTitle';

const StyledRow = styled(Row)`
    background: ${({ color, theme }) => color || theme.header.background};
`;

const ButtonStyle = styled(Button)`
    font-size: 16px;
    height: 50px;
    &:disabled {
        background-color: #2890d9 !important;
    }
`;

ButtonStyle.displayName = 'ButtonStyle';

const NextButton = ({ title, subTitle, children, step, steps, onPrevious, onClose, formId, disabled, hideOnSave }: Object) => {
    if (step < steps) {
        return (
            <ButtonStyle title="Go to the next step" type="submit" form={formId}>
                Next
                <Icon style={{ marginLeft: '10px' }} name="chevron-right" size="lg" />
            </ButtonStyle>
        );
    }
    const doneProps = {
        title: 'Click to complete',
        type: 'submit',
        form: formId,
        disabled,
        style: { marginLeft: '15px' }
    };
    if (step > 1) {
        return <ButtonStyle {...doneProps}>Done</ButtonStyle>;
    }
    if (!hideOnSave) {
        return <ButtonStyle {...doneProps}>Save</ButtonStyle>;
    }
    return null;
};

const StepperComponent = (props: Object) => {
    const { title, subTitle, children, step, steps, onPrevious, onClose } = props;
    return (
        <div>
            <StyledRow middle="xs">
                <Col xs={1}>
                    <ButtonIcon icon="close" title="Close Current View" onClick={onClose} />
                </Col>
                <Col xs={11}>
                    <HeaderTitle as="h1">{title}</HeaderTitle>
                    <HeaderSubTitle as="h2">{subTitle}</HeaderSubTitle>
                </Col>
            </StyledRow>

            <StyledRow middle="xs">
                <Col xs={1}>{step > 1 ? <ButtonIcon icon="chevron-left" title="Go to the previous step" onClick={onPrevious} /> : null}</Col>
                <Col xs={8} md={10}>
                    <span className="step-status">
                        STEP {step} / {steps}
                    </span>
                </Col>
                <Col xs={3} sm={2} md={1}>
                    <NextButton {...props} />
                </Col>
            </StyledRow>
            <div className="content-wrap">{children}</div>
        </div>
    );
};

StepperComponent.propTypes = {
    title: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    steps: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    subTitle: PropTypes.string
};

StepperComponent.defaultProps = {
    subTitle: ''
};

export default StepperComponent;
