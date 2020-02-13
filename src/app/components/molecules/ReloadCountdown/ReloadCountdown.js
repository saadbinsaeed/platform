import React from 'react';
import PropTypes from 'prop-types';
import Button from 'app/components/atoms/Button/Button';
import Countdown from 'app/components/atoms/Countdown/Countdown';
import ButtonProps from 'app/components/atoms/Button/ButtonProps';

const ReloadCountdown = (props) => {

    const { seconds, format, action, disableCountdown } = props;

    return (
        <span title={!disableCountdown ? `Will automatically refresh list every ${seconds} seconds` : ''}>
            <Button icon="refresh" iconSize="md" noShadow onClick={action}>
                { !disableCountdown && <Countdown seconds={seconds} format={format} onCountdownTerminated={action} /> }
            </Button>
        </span>
    );
};

ReloadCountdown.propTypes = {
    ...ButtonProps,
    seconds: PropTypes.number,
    format: PropTypes.string,
    action: PropTypes.func,
    disableCountdown: PropTypes.bool,
};

export default ReloadCountdown;
