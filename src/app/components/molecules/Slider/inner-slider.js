
import React from 'react';
import EventHandlersMixin from './mixins/event-handlers';
import HelpersMixin from './mixins/helpers';
import initialState from './initial-state';
import defaultProps from './default-props';
import createReactClass from 'create-react-class';
import classnames from 'classnames';
import assign from 'object-assign';

import {Track} from './track';
import {Dots} from './dots';
import {PrevArrow, NextArrow} from './arrows';

import styled from 'styled-components';

const InnerSliderStyle = styled.div`
    z-index: 0;
    position: relative;
    display: block;
    box-sizing: border-box;
    -webkit-touch-callout: none;
    user-select: none;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    & .slick-track, & .slick-list {
         transform: translate3d(0, 0, 0);
    }
    .slick-slide {
        float: left;
        height: 100%;
        min-height: 1px;
        [dir="rtl"] & {
            float: right;
        }
    img {
        display: block;
    }
    &.slick-loading img {
        display: none;
    }
    &.dragging img {
        pointer-events: none;
    }

    .slick-initialized & {
        display: block;
    }

    .slick-loading & {
        visibility: hidden;
    }

    .slick-vertical & {
        display: block;
        height: auto;
        border: 1px solid transparent;
    }
}
.slick-arrow.slick-hidden {
    display: none;
}
`;

const SlickListStyle = styled.div`
    position: relative;
    overflow: hidden;
    display: block;
    margin: 0;
    padding: 0;
    &:focus {
        outline: none;
    }
    &.dragging {
        cursor: pointer;
        cursor: hand;
    }
`;


export const InnerSlider = createReactClass({

    mixins: [HelpersMixin, EventHandlersMixin],
    list: null,
    track: null,
    resized: 0,

    listRefHandler: function (ref) {
        this.list = ref;
    },

    trackRefHandler: function (ref) {
        this.track = ref;
    },

    getInitialState: function () {
        return Object.assign({}, initialState, {
            currentSlide: this.props.initialSlide
        });
    },

    getDefaultProps: function () {
        return defaultProps;
    },

    componentWillMount: function () {
        if (this.props.init) {
            this.props.init();
        }
        this.setState({
            mounted: true
        });
        const lazyLoadedList = [];
        for (let i = 0; i < React.Children.count(this.props.children); i++) {
            if (i >= this.state.currentSlide && i < this.state.currentSlide + this.props.slidesToShow) {
                lazyLoadedList.push(i);
            }
        }

        if (this.props.lazyLoad && this.state.lazyLoadedList.length === 0) {
            this.setState({
                lazyLoadedList: lazyLoadedList
            });
        }
    },

    componentDidMount: function componentDidMount() {
        // Hack for autoplay -- Inspect Later
        this.initialize(this.props);
        this.adaptHeight();

        // To support server-side rendering
        if (!window) {
            return;
        }
        if (window.addEventListener) {
            window.addEventListener('resize', this.onWindowResized);
        } else {
            window.attachEvent('onresize', this.onWindowResized);
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        if (this.animationEndCallback) {
            clearTimeout(this.animationEndCallback);
        }
        if (window.addEventListener) {
            window.removeEventListener('resize', this.onWindowResized);
        } else {
            window.detachEvent('onresize', this.onWindowResized);
        }
        if (this.state.autoPlayTimer) {
            clearInterval(this.state.autoPlayTimer);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.slickGoTo !== nextProps.slickGoTo) {
            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn('react-slick deprecation warning: slickGoTo prop is deprecated and it will be removed in next release. Use slickGoTo method instead');
            }
            this.changeSlide({
                message: 'index',
                index: nextProps.slickGoTo,
                currentSlide: this.state.currentSlide
            });
        } else if (this.state.currentSlide >= nextProps.children.length) {
            this.update(nextProps);
            this.changeSlide({
                message: 'index',
                index: nextProps.children.length - nextProps.slidesToShow,
                currentSlide: this.state.currentSlide
            });
        } else {
            this.update(nextProps);
        }
    },

    componentDidUpdate: function () {
        this.adaptHeight();
    },

    onWindowResized: function () {
        this.update(this.props);
        // animating state should be cleared while resizing, otherwise autoplay stops working
        this.setState({
            animating: false
        });
        clearTimeout(this.animationEndCallback);
        delete this.animationEndCallback;
    },

    slickPrev: function () {
        this.changeSlide({message: 'previous'});
    },

    slickNext: function () {
        this.changeSlide({message: 'next'});
    },

    slickGoTo: function (slide) {
        typeof slide === 'number' && this.changeSlide({
            message: 'index',
            index: slide,
            currentSlide: this.state.currentSlide
        });
    },

    render: function () {
        const className = classnames('slick-initialized', 'slick-slider', this.props.className, {
            'slick-vertical': this.props.vertical,
        });

        const trackProps = {
            fade: this.props.fade,
            cssEase: this.props.cssEase,
            speed: this.props.speed,
            infinite: this.props.infinite,
            centerMode: this.props.centerMode,
            focusOnSelect: this.props.focusOnSelect ? this.selectHandler : null,
            currentSlide: this.state.currentSlide,
            lazyLoad: this.props.lazyLoad,
            lazyLoadedList: this.state.lazyLoadedList,
            rtl: this.props.rtl,
            slideWidth: this.state.slideWidth,
            slidesToShow: this.props.slidesToShow,
            slidesToScroll: this.props.slidesToScroll,
            slideCount: this.state.slideCount,
            trackStyle: this.state.trackStyle,
            variableWidth: this.props.variableWidth
        };

        let dots;

        if (this.props.dots === true && this.state.slideCount >= this.props.slidesToShow) {
            const dotProps = {
                dotsClass: this.props.dotsClass,
                slideCount: this.state.slideCount,
                slidesToShow: this.props.slidesToShow,
                currentSlide: this.state.currentSlide,
                slidesToScroll: this.props.slidesToScroll,
                clickHandler: this.changeSlide,
                children: this.props.children,
                customPaging: this.props.customPaging
            };

            dots = (<Dots {...dotProps} />);
        }

        let prevArrow, nextArrow;

        const arrowProps = {
            infinite: this.props.infinite,
            centerMode: this.props.centerMode,
            currentSlide: this.state.currentSlide,
            slideCount: this.state.slideCount,
            slidesToShow: this.props.slidesToShow,
            prevArrow: this.props.prevArrow,
            nextArrow: this.props.nextArrow,
            clickHandler: this.changeSlide
        };

        if (this.props.arrows) {
            prevArrow = (<PrevArrow {...arrowProps} />);
            nextArrow = (<NextArrow {...arrowProps} />);
        }

        let verticalHeightStyle = null;

        if (this.props.vertical) {
            verticalHeightStyle = {
                height: this.state.listHeight,
            };
        }

        let centerPaddingStyle = null;

        if (this.props.vertical === false) {
            if (this.props.centerMode === true) {
                centerPaddingStyle = {
                    padding: (`0px ${  this.props.centerPadding}`)
                };
            }
        } else {
            if (this.props.centerMode === true) {
                centerPaddingStyle = {
                    padding: (`${this.props.centerPadding  } 0px`)
                };
            }
        }

        const listStyle = assign({}, verticalHeightStyle, centerPaddingStyle);

        return (
            // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
            <InnerSliderStyle
                className={className}
                onMouseEnter={this.onInnerSliderEnter}
                onMouseLeave={this.onInnerSliderLeave}
                onMouseOver={this.onInnerSliderOver}
            >
                {prevArrow}
                <SlickListStyle
                    ref={this.listRefHandler}
                    className="slick-list"
                    style={listStyle}
                    onMouseDown={this.swipeStart}
                    onMouseMove={this.state.dragging ? this.swipeMove: null}
                    onMouseUp={this.swipeEnd}
                    onMouseLeave={this.state.dragging ? this.swipeEnd: null}
                    onTouchStart={this.swipeStart}
                    onTouchMove={this.state.dragging ? this.swipeMove: null}
                    onTouchEnd={this.swipeEnd}
                    onTouchCancel={this.state.dragging ? this.swipeEnd: null}
                    onKeyDown={this.props.accessibility ? this.keyHandler : null}>
                    <Track ref={this.trackRefHandler} {...trackProps}>
                        {this.props.children}
                    </Track>
                </SlickListStyle>
                {nextArrow}
                {dots}
            </InnerSliderStyle>
        );
    }
});
