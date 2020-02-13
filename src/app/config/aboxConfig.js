// @flow

const PRIORITY_LABELS = [ 'Highest', 'High', 'Medium', 'Low', 'Lowest' ];
const PRIORITY_COLORS = [ 'danger', 'warning', 'alert', 'info', 'success' ];

export const normalizePriorityValue = (priorityValue?: string | number) => {
    let priority = priorityValue && Number(priorityValue);
    priority = priority && priority >= 1 && priority <= 5 ? priority : 3;
    return priority;
};

export const PRIORITY_OPTIONS = [
    {  value: 1, label: PRIORITY_LABELS[0] },
    {  value: 2, label: PRIORITY_LABELS[1] },
    {  value: 3, label: PRIORITY_LABELS[2] },
    {  value: 4, label: PRIORITY_LABELS[3] },
    {  value: 5, label: PRIORITY_LABELS[4] },
];

export const getPriorityLabel = (priority?: string | number) => PRIORITY_LABELS[normalizePriorityValue(priority) - 1];

export const getPriorityColor = (priority?: string | number) => PRIORITY_COLORS[normalizePriorityValue(priority) - 1];
