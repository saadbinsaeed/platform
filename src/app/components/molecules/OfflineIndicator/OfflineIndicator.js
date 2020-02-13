/* @flow */

import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Indicator = styled.div`
  width: 60px;
  text-align: center;
  padding: .3rem;
  border-radius: .7rem;
`;

const Online = styled(Indicator)`
  background: MEDIUMAQUAMARINE;
`;
const Offline = styled(Indicator)`
  background: indianred;
`;

/**
 * Small component to detect whether you're online
 */
class OfflineIndicator extends PureComponent<Object, Object> {
    /**
     * Create our default state
     * @param props
     */
    constructor(props: Object) {
        super(props);
        this.state = { online: true };
    }
    state: Object;

    /**
     * Add event listeners for window.online and check window exists for SSR Support
     */
    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('online', this.goOnline);
            window.addEventListener('offline', this.goOffline);
        }
    }

    /**
     * Remove listeners when component is no longer shown
     */
    componentWillUnmount() {
        window.removeEventListener('online', this.goOnline);
        window.removeEventListener('offline', this.goOffline);
    }

    goOnline = () => {
        this.setState({ online: true });
    };
    goOffline = () => {
        this.setState({ online: false });
    };

    /**
     * Render our indicator
     * TODO: Make it look pretty, add animations etc;
     */
    render() {
        if (this.state.online) {
            return <Online>Online</Online>;
        }
        return <Offline>Offline</Offline>;
    }
}

export default OfflineIndicator;
