/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AliceCarousel from 'react-alice-carousel';

import Arrow from './Arrow';

const CarouselWrapperStyled = styled.div`
    position: relative;
`;

/**
 *
 * @example AliceCarousel
 */
class Carousel extends PureComponent<Object, Object> {

    static devProps = {
        items: PropTypes.array.isRequired,
        ...AliceCarousel.PropTypes,
    }

    // $FlowFixMe
    carouselRef = React.createRef();

    slideNext = () => this.carouselRef.current && this.carouselRef.current._slideNext();
    slidePrev = () => this.carouselRef.current && this.carouselRef.current._slidePrev();

    render() {
        const { style, className, ...allProps  } = this.props;
        return (
            <CarouselWrapperStyled style={style} className={className} >
                <AliceCarousel
                    {...allProps}
                    ref={this.carouselRef}
                    dotsDisabled
                    buttonsDisabled
                />
                <Arrow onClick={this.slidePrev} />
                <Arrow onClick={this.slideNext} right />
            </CarouselWrapperStyled>
        );
    }
}

export default Carousel;
