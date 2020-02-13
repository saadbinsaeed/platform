/**
 * Define list of properties that we need to
 * have in this simple component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Title from 'app/components/atoms/Title/Title';
import PanelHeader from './PanelHeader';
import PanelContent from './PanelContent';
//import ButtonIcon from '../ButtonIcon/ButtonIcon';
import { ChildrenProp } from 'app/utils/propTypes/common';
import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';

const PanelStyle = styled.div`
   display: flex;
   flex-direction: column;
   background: ${( { theme } ) => theme.widget.background };
   box-shadow: ${( { theme } ) => theme.shadow.z1 };
   margin-bottom: 1rem;
   ${( { theme } ) => theme.shadow.z1 };
`;

/**
 * Panel component to show a list of collapsible panels
 */
class Panel extends Component<Object, Object> {

    static propTypes = {
        children: ChildrenProp,
        header: ChildrenProp,
        title: PropTypes.string,
    };
    /**
     * Set our default state
     */
    constructor(props) {
        super(props);
        this.state = {
            allPanelsOpen: false
        };
    }

    /**
     * Toggle all open panel sections
     */
    /*toggleAll = (e) => {
        e.preventDefault();
        this.setState({
            allPanelsOpen: !this.state.allPanelsOpen
        });
    };*/

    /**
     * Render our panels
     */
    render() {

        const { children, header, title } = this.props;

        return (

            <PanelStyle>
                <PanelHeader header={header}>
                    <Title>{ title }</Title>
                    <HeaderActions>
                        { header }
                        {/*<ButtonIcon icon="arrow-down" size="sm" onClick={this.toggleAll} />*/}
                    </HeaderActions>
                </PanelHeader>
                <PanelContent allOpen={this.state.allPanelsOpen}>
                    { children }
                </PanelContent>
            </PanelStyle>

        );
    }

}

export default Panel;
