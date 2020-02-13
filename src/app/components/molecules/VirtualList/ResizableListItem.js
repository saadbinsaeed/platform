import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import VirtualListItem from 'app/components/molecules/VirtualList/VirtualListItem';

/**
 * Renders a resizable list item. The child element has to call the resizeRow function every time his hight is changed.
 *
 * Usage example:
 *
 * <ResizableListItem index={index} resize={resize} padding={8}>
 *   {(resizeRow) => <ChildComponent resizeRow={resizeRow} />}
 * </ResizableListItem>
 */
class ResizableListItem extends PureComponent<Object, Object> {

    static propTypes = {
        ...VirtualListItem.propTypes,
        children: PropTypes.func.isRequired,
    }

    // $FlowFixMe
    ref = React.createRef();

    resizeRow = () => {
        this.ref.current.resizeRow();
    };

    render() {
        const { children, ...props } = this.props;
        return (
            <VirtualListItem ref={this.ref} {...props}>
                {children(this.resizeRow)}
            </VirtualListItem>
        );
    }
}


export default ResizableListItem;
