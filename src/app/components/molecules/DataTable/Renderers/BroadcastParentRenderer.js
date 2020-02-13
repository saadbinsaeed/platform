/* @flow */
import React from 'react';
import { Link } from 'react-router-dom';


/**
 * Recipient Renderer displays the user group and recipient information
 * @param props the Component's properties.
 */
const BroadcastParentRenderer = ({ data }: Object) => {
    return (
        data.parent && <Link to={`/broadcasts/edit/${data.parent.id}`}>
            {data.parent.id}
        </Link>
    );
};


export default BroadcastParentRenderer;
