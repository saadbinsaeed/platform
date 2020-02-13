// @flow
// $FlowFixMe
import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, MenuItem, TextField, Typography, MdiIcon, IconButton } from '@mic3/platform-ui';

const FiltersOrderToolbar = ({ classes, onChange, sortOptions, resultCount, orderBy }) => {
    const onChangeField = useCallback((e) => {
        onChange({ ...orderBy, field: e.target.value });
    }, [onChange, orderBy]);
    const onChangeOrder = useCallback(() => {
        onChange({ ...orderBy, direction: orderBy.direction === 'desc' ? 'asc' : 'desc'  });
    }, [onChange, orderBy]);
    const options = useMemo(() => sortOptions.map(option => (
        <MenuItem key={option.value} value={option.value}>
            {option.label}
        </MenuItem>
    )), [sortOptions]);
    return (
        <Grid className={classes.appBar} container spacing={16} alignItems="center">
            <Grid item>
                <IconButton onClick={onChangeOrder}>
                    <MdiIcon name={orderBy.direction === 'desc' ? 'arrow-down' : 'arrow-up'}/>
                </IconButton>
            </Grid>
            <Grid item>
                <TextField
                    onChange={onChangeField}
                    InputProps={{
                        endAdornment: null,
                        disableUnderline: true,
                    }}
                    variant="standard"
                    margin="none"
                    value={orderBy.field}
                    select
                >
                    {options}
                </TextField>
            </Grid>
            <Grid item className={classes.counter}>
                <Typography align="right">{resultCount > 999 ? '+999' : resultCount}</Typography>
            </Grid>
        </Grid>

    );
};

FiltersOrderToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    sortOptions: PropTypes.array.isRequired,
    resultCount: PropTypes.number.isRequired,
    orderBy: PropTypes.object.isRequired,
};

const styles = theme => ({
    appBar: {
        backgroundColor: '#343A45',
        margin: 0,
    },
    counter: {
        flexGrow: 1,
        paddingRight: '32px !important',
    },
});
export default withStyles(styles)(FiltersOrderToolbar);
