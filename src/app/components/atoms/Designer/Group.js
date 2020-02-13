/* @flow */

import React from 'react';

const Group = ({ children, ...divProps }: Object) => {
    return <div {...divProps}>{children}</div>;
};

export default Group;
