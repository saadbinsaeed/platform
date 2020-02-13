/**
 * Our Modal styles
 */
/* @flow */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import history from 'store/History';
import Title from 'app/components/atoms/Title/Title';
import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';
import ButtonIcon from '../ButtonIcon/ButtonIcon';
import Backdrop from 'app/components/atoms/Backdrop/Backdrop';

const ModalStyle = styled.div`
    display: grid;
    grid-template-areas: "ModalHeader ModalContent ModalFooter"
    grid-template-rows: auto 1fr auto;
    width: 100%;
    max-height: 100%;
    height: 100%;
    min-height: ${({theme, height}) => theme && height ? `${Number(height)}px` : 'auto'};
    display: flex;
    flex-direction: column;
    @media(min-width: ${ ( { theme } ) => theme.media.md }) {
        min-width: 240px;
        max-width: 640px;
        height: auto;
    }
    color: ${ ( { theme } ) => theme.base.textColor };
    background: ${ ( { theme } ) => theme.base.background };
    box-shadow: ${ ( { theme } ) => theme.shadow.z3 };
    border-radius: .3rem;
    a {
      color: ${ ( { theme } ) => theme.color.primary };
    }
`;

const ModalTitle = styled.header`
    grid-area: ModalHeader;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    color: ${( { theme } ) => theme.widget.header.textColor };
    background: ${ ( { theme } ) => theme.widget.header.background };
    & .Icon:before {
        color: ${( { theme } ) => theme.widget.header.iconColor };
   }
`;
const ModalContent = styled.main`
    grid-area: ModalContent;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    padding: ${( { noPadding } ) => noPadding ? '0' : '1rem'};
`;
const ModalFooter = styled.footer`
    grid-area: ModalFooter;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
`;
/**
 * Generate our Modal component
 */
class Modal extends Component<Object, Object> {

    static propTypes = {
        open: PropTypes.bool,
        title: PropTypes.string,
        footer: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        disableBack: PropTypes.bool,
        noPadding: PropTypes.bool,
        closeUrl: PropTypes.string,
        onToggle: PropTypes.func,
        height: PropTypes.number,
    };

    state: {
        isOpened: boolean,
        isBackDisabled: boolean,
    };

    /**
     * Define our initial state for the modal
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            isOpened: this.props.open || false,
            isBackDisabled: this.props.disableBack || false
        };
    }

    /**
     * @override
     * @param nextProps the properties that the Components will receive.
     */
    componentWillReceiveProps(nextProps: Object) {
        if (nextProps.open !== this.props.open) {
            this.setState({ isOpened: nextProps.open });
        }
    }

    /**
     * Toggle the modal dialog
     */
    toggleModal = (e: Object) => {
        e.preventDefault();

        if (this.props.onToggle) {
            this.props.onToggle();
        } else if (this.props.closeUrl) {
            this.setState({ isOpened: false });
            history.push(this.props.closeUrl);
        } else if (this.state.isBackDisabled !== true) {
            history.pushBack();
        } else {
            this.setState({ isOpened: !this.state.isOpened });
        }
    };

    /**
     * Render our modal container class
     */
    render() {
        const { children, title, footer, noPadding, height } = this.props;
        return (
            this.state.isOpened &&
            <Portal isBackDisabled={this.props.disableBack} node={document && document.getElementById('modals')}>
                <Backdrop>
                    <ModalStyle height={height}>
                        <ModalTitle>
                            <Title>{ title }</Title>
                            <HeaderActions>
                                <ButtonIcon icon="close" size="sm" onClick={this.toggleModal} />
                            </HeaderActions>
                        </ModalTitle>
                        <ModalContent noPadding={noPadding}>{ children }</ModalContent>
                        { footer && <ModalFooter>{ footer }</ModalFooter>}
                    </ModalStyle>
                </Backdrop>
            </Portal>
        );
    }
}

export default Modal;
