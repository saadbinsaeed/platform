/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import PropTypes from 'prop-types';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
/**
 * Component for showing ordering state
 */
class SortButtonIcon extends PureComponent<Object, Object> {
    /**
     * Set our default state
     */
    constructor(props: Object) {
        super(props);
        this.state = { direction: props.direction || 'asc' };
    }
    static propTypes = {
        direction: PropTypes.string
    };
    icon: string;
    /**
     * Set icon based on initial prop
     */
    componentDidMount = () => {
        this.setIcon();
    };
    /**
     * Handle the swap of icon depending if ASC or DESC.
     */
    handleClick = () => {
        this.setIcon();
        this.props.onClick && this.props.onClick(this.state.direction);
    };

    setIcon = () => {
        if (this.state.direction === 'asc') {
            this.icon = 'sort-ascending';
            this.setState({ direction: 'desc' });
        } else if (this.state.direction === 'desc') {
            this.icon = 'sort-descending';
            this.setState({ direction: 'asc' });
        }
    };
    /**
     * Render our ascending / descending icon
     */
    render() {
        return (<ButtonIcon icon={this.icon} onClick={this.handleClick} />);
    }
}

export default SortButtonIcon;
