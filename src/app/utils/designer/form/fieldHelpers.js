import React, { Fragment } from 'react';
import { Typography } from '@mic3/platform-ui';

const getHelper = type => ({
    name: (
        <Typography>Unique reference used for field (ng-model)</Typography>
    ),
    label: (
        <Typography>Label for the field.</Typography>
    ),
    local: (
        <Typography>Set variable for as local to the form or global for the process.</Typography>
    ),
    fieldValue: (
        <Fragment>
            <Typography>In depend what we need to return from options.</Typography>
            <Typography>If we need whole option object leave this field empty.</Typography>
            <Typography>If we need return some value, we have to fill this field with full path to the field from option.</Typography>
        </Fragment>
    ),
    expanded: (
        <Typography>Set default behaviour of panel: Expanded or Collapsed.</Typography>
    ),
    help: (
        <Typography>Displays custom intructions for the user. </Typography>
    ),
    onChange: (
        <Fragment>
            <Typography>
                {'This function triggers when the value is changed.'}
                <br />
                {'The function will receive 2 parameters:'}
            </Typography>
            <ul>
                <li>a JSON representation of the DOM event.</li>
                <li>a JSON that contains the form variables.</li>
            </ul>
            <Typography>
                {'The function can return an object. The object returned will updates the form variables.'}
                <br />
                {'Following an example function to handle the onChange event:'}
            </Typography>
            <code>
                {`(event, variables) => {
                    const { target: { name, value } } = event;
                    const { b } = variables;
                    return {
                        a: Number(value),
                        sum: Number(value) + (b || 0),
                    };
                }`}
            </code>
        </Fragment>
    ),
    staticOptions: (
        <Fragment>
            <Typography>Enter your options on seperate lines, with key and value (CSV) </Typography>
            <Typography>Example:</Typography>
            <Typography>1,High</Typography>
            <Typography>2,Medium</Typography>
            <Typography>3,Low</Typography>
        </Fragment>
    ),
})[type];

export default getHelper;
