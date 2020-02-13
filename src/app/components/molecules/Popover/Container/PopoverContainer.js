import React from 'react';
import styled, { keyframes } from 'styled-components';
import PopoverHeader from '../Header/PopoverHeader';
import Title from 'app/components/atoms/Title/Title';
import PopoverFooter from '../Footer/PopoverFooter';
import PopoverContainerProps from './PopoverContainerProps';
import PopoverContent from '../Content/PopoverContent';
import PopoverFooterProps from '../Footer/PopoverFooterProps';
import PopoverContentProps from '../Content/PopoverContentProps';

// Animations
const animateInFromRight = keyframes`
     from {
        transform: translateX(-20px);
        opacity: 0;
    }
    to {
        transform: translateX(0px);
        opacity: 1;
    }
`;

const animateInFromLeft = keyframes`
     from {
        transform: translateX(20px);
        opacity: 0;
    }
    to {
        transform: translateX(0px);
        opacity: 1;
    }
`;

const animateInFromTop = keyframes`
     from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0px);
        opacity: 1;
    }
`;

const animateInFromBottom = keyframes`
     from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0px);
        opacity: 1;
    }
`;

const PopoverContainerStyle = styled.aside`
    position: relative;
    ${( { isOpen } ) => isOpen ? '' : 'display: none'};
    ${( { isOpen, placement } ) => isOpen && placement.includes('right') ? `animation-name:  ${animateInFromRight}` : ''};
    ${( { isOpen, placement } ) => isOpen && placement.includes('left') ? `animation-name:  ${animateInFromLeft}` : ''};
    ${( { isOpen, placement } ) => isOpen && placement.includes('top' || 'center' || 'middle') ? `animation-name:  ${animateInFromTop}` : ''};
    ${( { isOpen, placement } ) => isOpen && placement.includes('bottom') ? `animation-name:  ${animateInFromBottom}` : ''};
    animation-duration: .3s;
    animation-timing-function: ease;
    color: ${ ( { theme } ) => theme.base.textColor };
    background: ${ ( { theme } ) => theme.widget.background };
    box-shadow: ${ ( { theme } ) => theme.shadow.z1 };

    min-width: ${( { width } ) => width || ''};
`;

const PopoverContainer = (props) => {

    const { isOpen, placement, title, headerActions, content, footer, width } = props;

    return (
        <PopoverContainerStyle isOpen={isOpen} placement={placement} width={width}>
            { headerActions && <PopoverHeader headerActions={headerActions} />}
            <PopoverContent>
                <div>
                    <Title as="h3">{title}</Title>
                    { content }
                </div>
            </PopoverContent>
            { footer && <PopoverFooter>
                { footer }
            </PopoverFooter> }
        </PopoverContainerStyle>
    );
};

PopoverContainer.propTypes = {
    ...PopoverContainerProps,
    ...PopoverContentProps,
    ...PopoverFooterProps
};

export default PopoverContainer;
