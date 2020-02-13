/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel as TabPanelPrime } from 'primereact/components/tabview/TabView';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';

const TabPanel = ({ header, leftIcon, rightIcon, disabled, headerStyle, headerClassName, contentStyle, contentClassName, children }: Object) =>
    <TabPanelPrime
        header={header}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        disabled={disabled}
        headerStyle={headerStyle}
        headerClassName={headerClassName}
        contentStyle={contentStyle}
        contentClassName={contentClassName}
    >
        { children }
    </TabPanelPrime>;

export default compose(
    onlyUpdateForKeys(['header', 'children']),
    setPropTypes({
        header: PropTypes.string,
        leftIcon: PropTypes.string,
        rightIcon: PropTypes.string,
        disabled: PropTypes.bool,
        headerStyle: PropTypes.object,
        headerClassName: PropTypes.string,
        contentStyle: PropTypes.object,
        contentClassName: PropTypes.string,
        children: PropTypes.any,
    })
)(TabPanel);
