// @flow

// FIXME: this is not correct, we should use withTheme in the Component or a styled-component to access to the curent theme
import theme from 'app/themes/theme.default';

/**
 * @deprecated
 *
 * Set the correct color from a priority number passed
 * @param priority
 * @returns {string}
 */
export function priorityColor(priority: number) {
    // console.log('colorPassed', priority);
    let priorityColor = '';

    switch (priority) {
        case (1):
            priorityColor = theme.color.success;
            break;
        case 2:
            priorityColor = theme.color.info;
            break;
        case 3:
            priorityColor = theme.color.alert;
            break;
        case 4:
            priorityColor = theme.color.danger;
            break;
        case 5:
            priorityColor = theme.color.error;
            break;
        default:
            priorityColor = theme.color.success;
    }
    // console.log('colorPassedReturns', priorityColor);
    return priorityColor;

}
