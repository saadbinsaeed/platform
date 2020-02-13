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
        const tasks = this.props.value || [];
        return (
            <ul>
                {
                    tasks
                        .filter(task => !task.endDate)
                        .map(task => <li key={task.id}><Link to={`/legacy/task/${task.id}`}><span>{task.id} - {task.name}</span></Link></li> )
                }
            </ul>
        );

    }
}

export default TasksRenderer;

