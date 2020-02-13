/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropResult, DragStart, DragDropContext } from 'react-beautiful-dnd';

import Card from 'app/components/molecules/Card/Card';
import List from './List';
import { moveField } from './dragDropUtils';


/*const Column = styled.div`
    margin: 0 16px;
`;*/

/**
 *
 */
export default class DragDropApp extends Component<Object, Object> {

    static propTypes: Object = {
        fields: PropTypes.any,
        removeListItem: PropTypes.func,
        handleChange: PropTypes.func,
        canEdit: PropTypes.bool,
        classId: PropTypes.number,
    };

    state: Object;

    /**
     *
     * @param props
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            fields: this.manipulateInputData(props.fields),
        };
    }

    /**
     * componentWillReceiveProps - description
     *
     * @param  {type} nextProps description
     * @return {type}           description
     */
    componentWillReceiveProps(nextProps: Object) {
        if (this.props.fields !== nextProps.fields) {
            this.setState({
                fields: this.manipulateInputData(nextProps.fields),
            });
        }
    }


    /**
     * This function will take the input Array
     * and convert it to an object structure with each key
     * represents the group name
     */
    manipulateInputData = (fields: Object) => {
        const matrix = (fields || []).map(arr => arr.map(item => ({ id: item.f_uri, ...item })));
        const obj = {};
        matrix.forEach((data, index) => { obj[data[0].group_name] = data; });
        return obj;
    };

    onDragStart = (initial: DragStart) => {
    };

    onDragEnd = (dropResult: DropResult) => {
        if (!dropResult.destination) return;

        const groups = moveField(this.state.fields, dropResult);
        this.props.handleChange(groups);
    };

    /**
     * render - description
     *
     * @return {type}  description
     */
    render() {
        const { fields } = this.state;
        const { canEdit, classId } = this.props;
        return (
            <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
                <div>
                    {/* Here each key will represents the group name */}
                    {Object.keys(fields).map((key) => {
                        return (
                            <Card
                                key={key}
                                collapsible
                                title={key}
                                description={<List
                                    classId={classId}
                                    key={key}
                                    title={key}
                                    listId={key}
                                    listType="card"
                                    groupData={fields[key]}
                                    canEdit={canEdit}
                                    removeListItem={this.props.removeListItem}
                                />}
                            />);
                    }
                    )}
                </div>
            </DragDropContext>
        );
    }
}
