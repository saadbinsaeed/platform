/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import json2mq from 'json2mq';
import canUseDOM from 'can-use-dom';

import { InnerSlider } from './inner-slider';
import defaultProps from './default-props';

const enquire = canUseDOM && require('enquire.js');

/**
 *
 */
export default class Slider extends PureComponent<Object, Object> {

    static propTypes = {
        children: PropTypes.array.isRequired,
    };

    innerSlider = null;
    _responsiveMediaHandlers = [];

    /**
     *
     */
    constructor(props: Object) {
        super(props);
        this.state = { breakpoint: null };
        (this: Object).innerSliderRefHandler = this.innerSliderRefHandler.bind(this);
    }

    /**
     *
     */
    innerSliderRefHandler(ref: Object) {
        this.innerSlider = ref;
    }

    /**
     *
     */
    media(query: string, handler: Function) {
        enquire.register(query, handler);
        this._responsiveMediaHandlers.push({query, handler});
    }

    /**
     *
     */
    componentWillMount() {
        if (this.props.responsive) {
            const breakpoints = this.props.responsive.map(breakpt => breakpt.breakpoint);
            breakpoints.sort((x, y) => x - y);

            breakpoints.forEach((breakpoint, index) => {
                let bQuery;
                if (index === 0) {
                    bQuery = json2mq({minWidth: 0, maxWidth: breakpoint});
                } else {
                    bQuery = json2mq({minWidth: breakpoints[index-1], maxWidth: breakpoint});
                }
                canUseDOM && this.media(bQuery, () => {
                    this.setState({breakpoint: breakpoint});
                });
            });

            // Register media query for full screen. Need to support resize from small to large
            const query = json2mq({minWidth: breakpoints.slice(-1)[0]});

            canUseDOM && this.media(query, () => {
                this.setState({breakpoint: null});
            });
        }
    }

    /**
     *
     */
    componentWillUnmount() {
        this._responsiveMediaHandlers.forEach(function(obj) {
            enquire.unregister(obj.query, obj.handler);
        });
    }

    /**
     *
     */
    slickPrev() {
        this.innerSlider && this.innerSlider.slickPrev();
    }

    /**
     *
     */
    slickNext() {
        this.innerSlider && this.innerSlider.slickNext();
    }

    /**
     *
     */
    slickGoTo(slide: string) {
        this.innerSlider && this.innerSlider.slickGoTo(slide);
    }

    /**
     *
     */
    render() {
        let children = this.props.children;
        if (!children) {
            return null;
        }
        if (!Array.isArray(children)) {
            children = [children];
        }
        if (!children.length) {
            return null;
        }

        let settings;
        let newProps;
        if (this.state.breakpoint) {
            newProps = this.props.responsive.filter(resp => resp.breakpoint === this.state.breakpoint);
            settings = newProps[0].settings === 'unslick' ? 'unslick' : Object.assign({}, this.props, newProps[0].settings);
        } else {
            settings = Object.assign({}, defaultProps, this.props);
        }

        // Children may contain false or null, so we should filter them
        children = children.filter(child => child);

        if (settings === 'unslick') {
            // if 'unslick' responsive breakpoint setting used, just return the <Slider> tag nested HTML
            return <div>{children}</div>;
        }
        return (
            <InnerSlider ref={this.innerSliderRefHandler} {...settings}>
                {children}
            </InnerSlider>
        );
    }
}
