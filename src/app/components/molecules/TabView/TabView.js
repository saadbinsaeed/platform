/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { TabView as TabViewPrime } from 'primereact/components/tabview/TabView';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';

const TabView = ({ id, activeIndex, style, className, children }: Object) =>
    <TabViewPrime
        id={id}
        activeIndex={activeIndex}
        style={style}
        className={className}
    >
        { children }
    </TabViewPrime>;

export default compose(
    onlyUpdateForKeys(['children']),
    setPropTypes({
        id: PropTypes.string,
        activeIndex: PropTypes.number,
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.any,
    })
)(TabView);
