// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

const ContentStyle = styled.section`
    grid-area: gContent;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-areas: "header"
                         "content";
    height: ${({height}) => `${height}px`};
    overflow: hidden;
    color: ${( { theme } ) => theme.base.textColor };
    background: ${( { theme } ) => theme.base.background };
    transition: .3s ease-in-out;
    /*Only on desktop if left is open*/
    @media(min-width: ${ ( { theme } ) => theme.media.md }) {
      ${({ theme, isLeftOpen }) => isLeftOpen ? ` width: calc(100% - ${theme.navigation.width}); transform: translateX(${theme.navigation.width})` : `width: calc(100% - ${theme.navigation.apps.width}); transform: translateX(${theme.navigation.apps.width})`
}
`;
/**
 * The app content container
 */
class AppContent extends PureComponent<Object, Object> {

    height: number = 0;

    setHeight = () => {
        this.height = window.document.body.getBoundingClientRect().height;
        this.forceUpdate();
    };

    componentWillMount() {
        this.setHeight();
    }

    componentDidMount() {
        this.setHeight();
        window.addEventListener('resize', this.setHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setHeight);
    }

    render() {
        const { children, isLeftOpen } = this.props;
        return (
            <ContentStyle className={'app-content'} isLeftOpen={isLeftOpen} height={this.height}>
                {children}
            </ContentStyle>
        );
    }
};

export default AppContent;
