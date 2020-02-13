//@flow
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
/**
 * Tasks Renderer displays the tasks id
 */
class TasksRenderer extends PureComponent<Object, Object> {
    /**
     * Render
     */
    render(){
        const process = this.props.value;
        return (
            <Link to={`/legacy/process/${process}`}>
                <span>{process}</span>
            </Link>
        );
    }
}

export default TasksRenderer;
