/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * A countdown timer
 */
class CountdownTimer extends PureComponent<Object, Object> {

    static propTypes = {
        seconds: PropTypes.number.isRequired,
        format: PropTypes.oneOf(['seconds', 'minutes']),
        onCountdownTerminated: PropTypes.func,
    };

    interval: any;
    state: {
        secondsRemaining: number,
    };

    /**
     * @param props the Component's properties.
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            secondsRemaining: props.seconds,
        };
    }

    /**
     * @override
     */
    componentWillReceiveProps(nextProps: Object) {
        this.setState({ secondsRemaining: nextProps.seconds });
    }
    /**
     * @override
     */
    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.secondsRemaining > 0) {
                this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
            } else if (this.state.secondsRemaining === 0) {
                this.props.onCountdownTerminated && this.props.onCountdownTerminated();
                this.setState({ secondsRemaining: -1 });
            }
        }, 1000);
    }

    /**
     * @override
     */
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    /**
     * @override
     */
    render() {
        const format = this.props.format || 'seconds';
        const secondsRemaining = this.state.secondsRemaining > 0 ? this.state.secondsRemaining : 0;
        switch (format) {
            case 'seconds':
                return <span>{secondsRemaining}</span>;
            case 'minutes': {
                const minutes = Math.trunc(secondsRemaining / 60);
                const seconds = Math.trunc(secondsRemaining % 60);
                return <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>;
            }
            default:
                throw new Error(`Unhandled format "${format}".`);
        }
    }
}

export default CountdownTimer;
