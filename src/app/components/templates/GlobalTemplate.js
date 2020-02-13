
/* @flow */
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import Drawer from 'app/components/atoms/Drawer/Drawer';
import FullHeight from 'app/components/atoms/FullHeight/FullHeight';
import NotificationsBar from 'app/components/molecules/NotificationsBar/NotificationsBar';
import AppContent from 'app/components/organisms/AppContent/Content';
import Header from 'app/components/organisms/AppHeader/Header';
import AppNavigation from 'app/components/organisms/AppNavigation/Navigation';
import Chat from 'app/components/organisms/Chat/Chat';
import Notifications from 'app/components/organisms/Notifications/Notifications';
import Toastr from 'app/containers/Toastr/Toastr';
import primeTheme from 'app/themes/prime';
import { ChildrenProp } from 'app/utils/propTypes/common';
import { toggleNav, openNav, toggleChat, toggleNotifications } from 'store/actions/app/appActions';
import { fetchBroadcastNotifications, markBroadcastRead } from 'store/actions/broadcasts/broadcastsActions';
import { loadNotifications } from 'store/actions/app/appActions';
import Messenger from 'app/components/organisms/Messenger/Messenger';

const GlobalThemeWrapper = styled(FullHeight)`
   ${primeTheme}; // as the whole application using the prime react components so it should be included as global stylesheet because it overrrides the styles used in styled components
   #datatable-filters {
       .ui-multiselect-panel .ui-multiselect-filter-container .fa {
           position: absolute;
           left: 5px;
           top: 12px;
       }
       .ui-dropdown-panel .ui-dropdown-item {
           min-height: 20px;
       }
       .ui-inputtext {
           min-height: 0;
       }
   }

   a {
       color: ${({ theme }) => theme.base.linkColor};
   }

   *::-webkit-scrollbar {
       width: 7px;
       height: 7px;
   }
   *::-webkit-scrollbar-thumb {
       border-radius: 5px;
       box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
       background-color: rgba(255,255,255,.2);
       min-height: 65px;
   }
   *::-webkit-scrollbar-track {
       box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
       border-radius: 0;
       background-color: transparent;
   }

`;

const CssGridLayout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "gNav gContent gMessenger";
  height: 100%;
  overflow: auto;
`;

const DrawerWrapper = styled.div`
    position: relative;
    z-index: 900;
`;

const DatePickerWrapper = styled.div`
    position: relative;
    z-index: 99999;
`; // z-index needed to be higher than modal items, as date picker can be inside modal

/**
 * Layout that controls the page
 */
class GlobalTemplate extends PureComponent<Object> {
    static propTypes = {
        children: ChildrenProp,
        app: PropTypes.object,
        activeBroadcasts: PropTypes.array,
        loadNotifications: PropTypes.func.isRequired,
        fetchBroadcastNotifications: PropTypes.func.isRequired,
        markBroadcastRead: PropTypes.func.isRequired,
        toggleNav: PropTypes.func.isRequired,
        openNav: PropTypes.func.isRequired,
        toggleChat: PropTypes.func.isRequired,
        toggleNotifications: PropTypes.func.isRequired,
    };

    interval;

    /**
     * @override
     */
    componentDidMount() {
        this.props.fetchBroadcastNotifications();
        this.interval = setInterval(this.props.loadNotifications, 60000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    markNotificationRead = (id) => {
        this.props.markBroadcastRead(id).then(this.props.fetchBroadcastNotifications);
    };

    buildMessages = memoize(activeBroadcasts =>
        (activeBroadcasts || [])
            .filter(({ broadcast: { priority } }) => priority === 'broadcast')
            .map(({ broadcast: { id, message, actionType, actionData } }) => ({ id, text: message, actionType, actionData })));

    /**
     * Render our page template
     */
    render() {
        const { children, activeBroadcasts } = this.props;
        return (
            <Fragment>
                <Toastr />
                <GlobalThemeWrapper>
                    <div id="modals" />
                    <DatePickerWrapper id="date-pickers" />
                    <div id="datatable-filters" />
                    <div id="messenger" />
                    <Drawer isToggled={this.props.toggleChat} title="Messenger" isOpen={this.props.app.isChatOpen}>
                        <Chat />
                    </Drawer>
                    <Drawer isToggled={this.props.toggleNotifications} title="Notifications" isOpen={this.props.app.isNotificationsOpen}>
                        <Notifications />
                    </Drawer>
                    <div id="carousel-item" />
                    <DrawerWrapper id="drawers" />
                    <CssGridLayout>
                        <AppNavigation toggleMenu={this.props.toggleNav} openMenu={this.props.openNav} isLeftOpen={this.props.app.isNavOpen} />
                        <AppContent isLeftOpen={this.props.app.isNavOpen}>
                            <NotificationsBar messages={this.buildMessages(activeBroadcasts)} notificationRead={this.markNotificationRead} />
                            { !this.props.app.isHeaderDisabled &&
                                <Header openMenu={this.props.toggleNav} openNotifications={this.props.toggleNotifications} openChat={this.props.toggleChat} />
                            }
                            {children}
                        </AppContent>
                        <Messenger />
                    </CssGridLayout>
                </GlobalThemeWrapper>
            </Fragment>
        );
    }
}


const mapStateToProps: Object = state => ({
    app: state.app,
    user: state.user,
    activeBroadcasts: state.broadcasts.active.records,
});

const mapDispatchToProps = {
    toggleNav,
    openNav,
    toggleChat,
    toggleNotifications,
    loadNotifications,
    fetchBroadcastNotifications,
    markBroadcastRead,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalTemplate);
