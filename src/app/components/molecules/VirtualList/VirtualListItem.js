import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a list item.
 *
 * Usage example:
 *
 * <ListItem index={index} resize={resize} padding={8}>
 *   <ChildComponent />
 * </ListItem>
 */
class VirtualListItem extends PureComponent<Object, Object> {

    static propTypes = {
        style: PropTypes.object.isRequired,
        index: PropTypes.number.isRequired,
        resize: PropTypes.func.isRequired,
        padding: PropTypes.number,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]).isRequired
    }

    // $FlowFixMe
    ref = React.createRef();

    willUnmount = false;

    componentDidMount() {
        setTimeout(() => !this.willUnmount && this.resizeRow(), 200);
    }

    componentWillUnmount() {
        this.willUnmount = true;
    }

    resizeRow = () => {
        const { index, resize, style } = this.props;
        const padding = (this.props.padding || 10) * 2;
        const componentHeight = this.ref.current && this.ref.current.children[0].clientHeight;
        const height = componentHeight + padding;
        // we need to resize if the style.height is less than the components height
        // or if the component height is less that style.height - 12
        const isDifferent = style.height !== height;
        const needResize = isDifferent && (style.height < height || height < style.height - 12);
        if (needResize) {
            resize(index, componentHeight + padding);
        }
    };

    render() {
        const { style, children } = this.props;
        return (
            <div ref={this.ref} style={style}>
                {children}
            </div>
        );
    }
}


export default VirtualListItem;
