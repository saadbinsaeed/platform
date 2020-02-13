/* @flow */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
/**
 * Recipient Renderer displays the user group and recipient information
 */
class BroadcastEditRenderer extends PureComponent<Object, Object> {
    /**
     * Render
     */
    render() {
        const { data } = this.props;
        return (
            <Link to={`/broadcasts/edit/${data.id}`}>
                {data.id}
            </Link>
        );
    }
}

export default BroadcastEditRenderer;
