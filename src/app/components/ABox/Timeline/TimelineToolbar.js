import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { IconButton, MdiIcon, Tooltip, MenuItem } from '@mic3/platform-ui';
import { TimelineToolbarSelect } from './style';

const TimelineToolbar = (props) => {
    const { onChangeRange, onPrevious, onNext, onToday, range, totalRecords } = props;

    return (
        <Fragment>
            <TimelineToolbarSelect
                onChange={onChangeRange}
                disableUnderline={true} 
                value={range}
                inputProps={{
                    name: 'range',
                    id: 'range',
                }}
            >
                <MenuItem value={'days'}>DAY</MenuItem>
                <MenuItem value={'weeks'}>WEEK</MenuItem>
                <MenuItem value={'months'}>MONTH</MenuItem>
                <MenuItem value={'years'}>YEAR</MenuItem>
            </TimelineToolbarSelect>
            <Tooltip title="Previous">
                <IconButton onClick={onPrevious}>
                    <MdiIcon name="chevron-left" color="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Next">
                <IconButton onClick={onNext}>
                    <MdiIcon name="chevron-right" color="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Today">
                <IconButton onClick={onToday}>
                    <MdiIcon name="calendar-range" color="inherit" />
                </IconButton>
            </Tooltip>
            <b>{totalRecords}</b>&nbsp;Tasks Found
        </Fragment>
    );
};

TimelineToolbar.propTypes = {
    onChangeRange: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onToday: PropTypes.func.isRequired,
    range: PropTypes.string,
    totalRecords: PropTypes.number
};

TimelineToolbar.defaultProps = {
    range: 'weeks',
    totalRecords: 0
};

export default TimelineToolbar;
