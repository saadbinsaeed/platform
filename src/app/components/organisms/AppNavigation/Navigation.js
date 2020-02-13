/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';
import { LargeScreenMin } from 'app/components/atoms/Responsive/Responsive';
import Title from 'app/components/atoms/Title/Title';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import { hasOneOf } from 'app/utils/utils';
import NavigationApplications from './NavigationApplications';
import NavigationContent from './NavigationContent';
import NavApplicationIcon from './NavApplicationIcon';
import NavHeader from './NavHeader';
import AboxMenu from './menus/AboxMenu';
import DashboardsMenu from './menus/DashboardsMenu';
import EventsMenu from './menus/EventsMenu';
import MapsMenu from './menus/MapsMenu';
import EtitiesMenu from './menus/EtitiesMenu';
import AnalyticsMenu from './menus/AnalyticsMenu';
import MarketplaceMenu from './menus/MarketplaceMenu';
import AdminMenu from './menus/AdminMenu';
import BroadcastsMenu from './menus/BroadcastsMenu';

const NavigationStyle = styled.aside`
    grid-area: gNav;
    position: fixed;
    top:0;
    left:0;
    bottom:0;
    overflow: hidden;
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    z-index: 998;
    transition: .3s ease-in-out;
    box-shadow: ${( { theme } ) => theme.shadow.z2 };
    background: ${( { theme } ) => theme.navigation.background };
    ${( { theme } ) => theme.navigation.width === '0px' ? 'display: none;' : 'width: 90%'};
    ${({ theme, isLeftOpen }) => isLeftOpen ? 'transform: translateX(0);' : 'transform: translateX(-100%);'};
    @media(min-width: ${({ theme }) => theme.media.md}) {
        transform: translateX(0);
        ${({ theme, isLeftOpen }) => isLeftOpen ?
        `width: ${theme.navigation.width};
             max-width: ${theme.navigation.width};
             min-width: ${theme.navigation.width};`
        :
        `width:  ${theme.navigation.apps.width };
            min-width:  ${theme.navigation.apps.width };
            max-width:  ${theme.navigation.apps.width };` };
    };
`;


/**
 * The main application navigation
 */
class Navigation extends PureComponent<Object, Object> {

    static propTypes = {
        toggleMenu: PropTypes.func,
        openMenu: PropTypes.func,
        isLeftOpen: PropTypes.bool,
        isAdmin: PropTypes.bool,
        permissions: PropTypes.array,
    };

    static defaultProps = { IsAdmin: false, permissions: [] };

    menu: Array<Object>;

    /**
     * @param props
     */
    constructor(props) {
        super(props);
        const { isAdmin, permissions } = props;
        this.menu = [
            { permission: 'abox', key: 'abox', name: 'abox', type: 'af', title: 'A-Box', content: <AboxMenu onClick={this.props.toggleMenu} isAdmin={isAdmin} permissions={permissions} /> },
            { permission: 'dashboard.view', key: 'dashboard', name: 'dashboard', type: 'af', title: 'Dashboards', content: <DashboardsMenu onClick={this.props.toggleMenu} isAdmin={isAdmin} permissions={permissions} /> },
            { permission: 'mistream.menu', key: 'stream', name: 'stream', type: 'af', title: 'Mi-Stream', content: <EventsMenu onClick={this.props.toggleMenu} isAdmin={isAdmin} permissions={permissions} /> },
            { permission: 'maps.sa.view', key: 'maps', name: 'maps', type: 'af', title: 'Maps', content: <MapsMenu onClick={this.props.toggleMenu} isAdmin={isAdmin} permissions={permissions} /> },
            { permission: 'entity.menu', key: 'things', name: 'things', type: 'af', title: 'Entities', content: <EtitiesMenu onClick={this.props.toggleMenu} isAdmin={isAdmin} permissions={permissions} /> },
            { permission: 'broadcast.view', key: 'signal-variant', name: 'signal-variant', title: 'Broadcasts', content: <BroadcastsMenu onClick={this.props.toggleMenu} isAdmin={isAdmin} permissions={permissions} /> },
            { permission: 'intelligence.menu', key: 'charts', name: 'charts', type: 'af', title: 'Affectli Intelligence', content: <AnalyticsMenu onClick={this.props.toggleMenu} isAdmin={isAdmin} permissions={permissions} /> },
            { permission: 'marketplace.designer1.view', key: 'designer', name: 'designer', type: 'af', title: 'Marketplace', largeScreenOnly: true, content: <MarketplaceMenu onClick={this.props.toggleMenu} isAdmin={isAdmin} permissions={permissions} /> },
            { permission: 'admin.menu', key: 'admin', name: 'admin', type: 'af', title: 'Admin Console', content: <AdminMenu onClick={this.props.toggleMenu} isAdmin={isAdmin} permissions={permissions} /> },
        ];
        const item = this.menu[0];
        this.state = { title: item.title, content: item.content };
    }

    openMenu = () => {
        !this.props.isLeftOpen && this.props.openMenu();
    };

    /**
     * Pass our icon content prop to the content layout
     * @param item
     */
    setNavigationContent(item) {
        const { content, title } = item;
        this.setState({ content, title }, this.openMenu);
    }

    /**
     * Load the menu
     */
    loadMenus(menu, permissions, isAdmin) {
        let accessibleItems = [];
        if (isAdmin) {
            accessibleItems = menu;
        } else {
            const permissionSet = new Set(permissions);
            permissionSet.add('abox'); // everyone can see abox
            if (hasOneOf(permissionSet, ['entity.classification.view', 'entity.directory.view', 'entity.organisation.view', 'entity.person.view', 'entity.thing.view'])) {
                permissionSet.add('entity.menu');
            }
            if (hasOneOf(permissionSet, ['mistream.events.view', 'mistream.main.view'])) {
                permissionSet.add('mistream.menu');
            }
            if (hasOneOf(permissionSet, ['admin.group.view', 'admin.user.view', 'admin.logs.view'])) {
                permissionSet.add('admin.menu');
            }
            if (permissionSet.has('intelligence.analytics.view')) {
                permissionSet.add('intelligence.menu');
            }
            accessibleItems = menu.filter(item => permissionSet.has(item.permission));
        }
        return accessibleItems.map((item, index) => {
            const { largeScreenOnly, key, ...navIconProps } = item;
            const icon = <NavApplicationIcon {...navIconProps} key={key} index={index} onClick={() => this.setNavigationContent(item)} />;
            if (largeScreenOnly) {
                return <LargeScreenMin key={key}>{icon}</LargeScreenMin>;
            }
            return icon;
        });
    }

    /**
     * Render our Navigation component
     */
    render() {
        const { permissions, isAdmin } = this.props;
        return (
            <NavigationStyle className={'app-navigation'} isLeftOpen={this.props.isLeftOpen}>
                <NavigationApplications isLeftOpen={this.props.isLeftOpen}>
                    { this.loadMenus(this.menu, permissions, isAdmin) }
                </NavigationApplications>
                <NavigationContent isLeftOpen={this.props.isLeftOpen}>
                    <NavHeader>
                        <Title as="h1">{this.state.title}</Title>
                        <HeaderActions><ButtonIcon icon="close" onClick={this.props.toggleMenu} /></HeaderActions>
                    </NavHeader>
                    {this.state.content}
                </NavigationContent>
            </NavigationStyle>
        );
    }
}

const mapStateToProps = (state: Object) => ({
    permissions: state.user.profile.permissions,
    isAdmin: state.user.profile.isAdmin,
});
export default withRouter(connect(mapStateToProps, {})(Navigation));
