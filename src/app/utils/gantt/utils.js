import { formatDate } from '../date/date';

/* @flow */

const getLatestPredecessor = (task: Object, taskWithPredecessor: Object[]) => {
    // get all predecessor related to the current task and get the dues dates
    const predecessorTasks = taskWithPredecessor
        .filter((predecessorTask) => {
            return predecessorTask.sourceTaskId === task.id;
        });

    // get the latest due date and compare with current task start date
    const latestDueDate = new Date(Math.max.apply(null, predecessorTasks.map(({ predecessor: { dueDate } }) => {
        return new Date(dueDate);
    })));

    return predecessorTasks.find(({ predecessor: { dueDate } }) => {
        return formatDate(dueDate, 'DD-MM-YYYY HH:mm') === formatDate(latestDueDate, 'DD-MM-YYYY HH:mm');
    });
};

const validateTaskStartDate = (task: Object, taskWithPredecessor: Object[]) => {
    const { id, start_date } = { ...task };
    const newStartDate = new Date(start_date);
    const taskHasPredecessor = taskWithPredecessor.find(d => d.sourceTaskId === id);

    // if task doesn't have any predecessor update the task
    if (!taskHasPredecessor) return true;

    // get latest predecessor
    const latestPredecessor = getLatestPredecessor(task, taskWithPredecessor);

    if (latestPredecessor && latestPredecessor.predecessor && new Date(latestPredecessor.predecessor.dueDate) > newStartDate) {
        return false;
    }

    return true;
};

export {
    getLatestPredecessor,
    validateTaskStartDate
};