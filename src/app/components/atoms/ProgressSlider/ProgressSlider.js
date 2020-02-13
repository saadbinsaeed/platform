// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { debounce } from 'app/utils/utils';
import { get } from 'app/utils/lo/lo';
import { createEvent } from 'app/utils/http/event';

export const trackPosition = ({ thumbSize, height }: Object) => ({
    top: (thumbSize - Math.min(height, thumbSize)) / 2,
    height,
});

const Container = styled.div`
input[type='range']::-moz-focus-outer {
  border: 0;
}
input[type=range]::-ms-track {
  width:100%;
  height:100%;
  -webkit-appearance:none;
  margin:0px;
  padding:0px;
  border:0 none;
  background:transparent;
  color:transparent;
  overflow:visible;
}
input[type=range]::-moz-range-track {
  width:100%;
  height:100%;
  -moz-appearance:none;
  margin:0px;
  padding:0px;
  border:0 none;
  background:transparent;
  color:transparent;
  overflow:visible;
}
input[type=range] {
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  -webkit-appearance:none;
  padding:0px;
  border:0 none;
  background:transparent;
  color:transparent;
  overflow:visible;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background:transparent;
  border:transparent;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-ms-thumb {
  width:12px;
  height:12px;
  border-radius:0px;
  border:0 none;
  background:transparent;
}
input[type=range]::-moz-range-thumb {
  width:12px;
  height:12px;
  border-radius:0px;
  border:0 none;
  background:transparent;
}
input[type=range]::-webkit-slider-thumb {
  width:12px;
  height:12px;
  border-radius:0px;
  border:0 none;
  background:transparent;
  -webkit-appearance:none;
}
input[type=range]::-ms-fill-lower {
  background:transparent;
  border:0 none;
}
input[type=range]::-ms-fill-upper {
  background:transparent;
  border:0 none;
}
input[type=range]::-ms-tooltip {
  display: none;
}
`;

const baseStyles = {
    baseDiv: {
        border: '0 none',
        position: 'relative',
        left: 0,
        top: 0,
        overflow: 'visible',
    },
    track: {
        border: 0,
        position: 'absolute',
        width: `100%`,
    },
    fill: {
        border: 0,
        position: 'absolute',
        pointerEvents: 'none',
    },
    thumb: {
        position: 'absolute',
        top: 0,
        border: '0 none',
        padding: 0,
        margin: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        boxShadow: '0 0 3px black',
    },
    input: {
        top: 0,
        WebkitAppearance: 'none',
        background: 'transparent',
        position: 'absolute',
        left: 0,
        overflow: 'visible',
    },
};

/**
 *
 */
class ProgressSlider extends PureComponent<Object, Object> {

    static propTypes = {
        fillColor: PropTypes.string,
        trackColor: PropTypes.string,
        thumbColor: PropTypes.string,
        height: PropTypes.number,
        thumbSize: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        onChange: PropTypes.func,
        onMouseUp: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        thumbColor: 'white',
        thumbSize: 12,
        height: 6,
        min: 0,
        max: 100,
        width: '100%',
        value: 0,
        priority: 0,
    };

    state: Object;

    constructor(props: Object) {
        super(props);
        this.state = { value: props.value };
    }

    componentDidUpdate(prevProps: Object) {
        const { value } = this.props;
        if (value !== prevProps.value && value !== this.state.value) {
            this.setState({ value });
        }
    }

    propagateOnChange = debounce(() => {
        const { name } = this.props;
        const { value } = this.state;
        this.props.onChange && this.props.onChange(createEvent('change', { name, value }));
    }, 300);

    /**
     *
     */
    onChange = (event: Object) => {
        const { disabled } = this.props;
        if (disabled) {
            return;
        }
        const value = Number(get(event, 'nativeEvent.target.value') || 0);
        this.setState({ value }, this.propagateOnChange);
    };


    render() {
        const { min, max, thumbSize, width, trackColor, height, fillColor, thumbColor, alt, disabled } = this.props;

        const val = Math.min(max, this.state.value);

        const percentProgress = val / (max - min);

        const componentHeight = Math.max(height, thumbSize);
        const newTrackColor =  fillColor && !trackColor ? `${fillColor}44` : trackColor || '#c4c2c2';
        return (
            <div style={{ width: width }}>
                <div
                    id="rrp-baseDiv"
                    style={{ ...baseStyles.baseDiv, height: componentHeight }}
                >
                    <Container disabled={disabled}>
                        <div
                            id="rrp-track"
                            style={{
                                ...baseStyles.track,
                                borderRadius: height,
                                background: newTrackColor,
                                ...trackPosition(this.props),
                            }}
                        />
                        <div
                            id="rrp-fill"
                            style={{
                                ...baseStyles.fill,
                                borderRadius: height,
                                background: fillColor,
                                width: `calc(100% * ${percentProgress} + ${(1 - percentProgress) * componentHeight}px)`,
                                ...trackPosition(this.props),
                            }}
                        />
                        {disabled ? null : (
                            <div
                                id="rrp-thumb"
                                style={{
                                    ...baseStyles.thumb,
                                    width: componentHeight,
                                    height: componentHeight,
                                    borderRadius: componentHeight,
                                    background: thumbColor,
                                    left: `calc((100% - ${componentHeight}px) * ${percentProgress})`,
                                }}
                                alt={alt}
                            />
                        )}
                        <input
                            style={{
                                ...trackPosition(this.props),
                                width: `calc(100% - ${componentHeight}px)`,
                                marginLeft: componentHeight / 2,
                                marginRight: componentHeight / 2,
                                height: componentHeight,
                                ...baseStyles.input,
                            }}
                            type="range"
                            onChange={this.onChange}
                            onMouseUp={this.props.onMouseUp}
                            min={min}
                            max={max}
                            alt={alt}
                        />
                    </Container>
                </div>
            </div>
        );
    }
}

export default ProgressSlider;
