// @flow
import { PureComponent } from 'react';

/**
 * The Ticker component will pass the current time to its RenderComponent.
 *
 * e.g.
 * <Ticker RenderComponent={(props) => props.time.toJSON()} />
 */
class Ticker extends PureComponent<Object, Object> {

    interval: any;

    constructor(props: Object) {
        super(props);
        this.state = { time: new Date() };
        const { intervalTime = 1000 } = props;
        this.interval = setInterval(() => this.setState({ time: new Date() }), intervalTime);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { RenderComponent } = this.props;
        return RenderComponent({ time: this.state.time });
    }
}


export default Ticker;
