// @flow
// $FlowFixMe
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, SwipeableDrawer, Divider, IconButton, MdiIcon, Typography, Button } from '@mic3/platform-ui';
import { isBrowser } from 'react-device-detect';


/**
 * A view to filter data
 */
const FiltersDrawer  = ({ children, classes, open, onClose, onApply }) => (
    <SwipeableDrawer
        open={open}
        anchor="right"
        PaperProps={{className: classes.root}}
        onClose={onClose}
        variant={isBrowser ? 'persistent' : 'temporary'}
    >
        <Grid className={classes.appBar} justify="flex-start" alignItems="center" container >
            <IconButton onClick={onClose}>
                <MdiIcon name="chevron-right" />
            </IconButton>
            <Typography variant="h6" className={classes.grow}>
                Filter
            </Typography>
            <Button variant="text" className={classes.applyButton} onClick={onApply}>
                Apply
            </Button>
            <Divider/>
        </Grid>
        <Grid className={classes.content}>
            {children}
        </Grid>
    </SwipeableDrawer>
);

FiltersDrawer.propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    onApply: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool,
};

const styles = theme => ({
    root: {
        width: '290px',
        overflowY: 'auto',
        zIndex: theme.zIndex.drawer,
        WebkitOverflowScrolling: 'touch',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        outline: 'none',
        backgroundColor: '#343A45',
    },
    grow: {
        flexGrow: 1,
        paddingTop: '3px',
    },
    applyButton: {
        marginRight: '8px',
        marginTop: '6px',
    },
    appBar: {
        position: 'sticky',
        top: 0,
        minHeight: '55px',
        zIndex: 3,
        backgroundColor: '#343A45',
        borderBottom: '1px solid #bec1c3',
    },
    content: {
        matginTop: '65px',
    }
});
export default memo(withStyles(styles)(FiltersDrawer));
