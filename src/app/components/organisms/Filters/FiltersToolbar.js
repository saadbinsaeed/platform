/* @flow */

// $FlowFixMe
import React, { memo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, TextField, IconButton, MdiIcon, Tooltip } from '@mic3/platform-ui';
import defaultTheme from 'app/themes/theme.default';

const inputProps: Object = { disableUnderline: true };

const FiltersToolbar  = ({ children, classes, toggleDrawer, onSearch, searchValue, leftToolbar, rightToolbar, isAnyDefinitions }: Object) => {
    inputProps.className = classes.searchInput;
    const [search, setSearch] = useState('');
    useEffect(() => {
        setSearch(searchValue || '');
    }, [searchValue]);
    const onChangeSearch = useCallback((event) => {
        if (event.persist) {
            event.persist();
        }
        setSearch(event.target.value);
        onSearch(event.target.value);
    }, [onSearch]);
    return (
        <Grid container spacing={16} alignItems="center" className={classes.searchBar}>
            {leftToolbar}
            <Grid item xs>
                <TextField
                    onChange={onChangeSearch}
                    value={search}
                    fullWidth
                    variant="standard"
                    margin="none"
                    placeholder="Search..."
                    InputProps={inputProps}
                />
            </Grid>
            {rightToolbar}
            {isAnyDefinitions && <Tooltip title="Filters">
                <IconButton onClick={toggleDrawer}>
                    <MdiIcon name="filter-variant" color="inherit" />
                </IconButton>
            </Tooltip>}
        </Grid>
    );
};

FiltersToolbar.propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    isAnyDefinitions: PropTypes.bool.isRequired,
    leftToolbar: PropTypes.node,
    rightToolbar: PropTypes.node

};

const styles = theme => ({
    searchBar: {
        background: defaultTheme.filters.toolbarBackground,
        fontSize: theme.typography.fontSize,
        padding: '8px 16px 0px',
    },
    searchInput: {
        fontSize: theme.typography.fontSize,
    },
});

export default memo(withStyles(styles)(FiltersToolbar));
