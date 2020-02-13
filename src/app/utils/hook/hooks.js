/* @flow */

// $FlowFixMe
import { useCallback, useEffect, useState } from 'react';

export const useToggle = () => {
    const [isOpen, show] = useState(false);
    const toggle = useCallback(() => show(!isOpen), [isOpen]);
    return [isOpen, toggle, show];
};

/**
 * Use this hook to handle the variable changes providing an additional onChange function.
 *
 * @param value the property value
 * @param refresh if "true" it refreshes the value on every change, otherwise it set the value only the first time. This flag shouldn't be modified during the hook life cycle!
 *
 * @return three items: the value, the onChange function, the set function.
 */
export const useOnChange = (value: any, refresh: ?boolean = true) => {
    const [val, setValue] = useState(value);
    refresh && useEffect(() => { // eslint-disable-line react-hooks/rules-of-hooks
        setValue(value);
    }, [value]);
    const onChange = useCallback((e: Object) => {
        setValue(e.target.value);
    }, [setValue]);
    return [val, onChange, setValue];
};

/**
 * Use a Redux action.
 *
 * @param action the action (required). If the action is asyncronous it must return a Promise.
 * @param paramters an array containing the action parameters (optional).
 * @param disableUI the function to disable the UI (optional).
 * @param onSuccess the function to call on success (optional).
 * @param onError the function to call on error (optional).
 */
export const useReduxAction = (
    {
        action,
        parameters,
        disableUI,
        onSuccess,
        onError,
    }: {
        action: Function,
        parameters?: Array<any>,
        disableUI?: Function,
        onSuccess?: Function,
        onError?: Function,
    }
) =>
    useCallback(() => {
        disableUI && disableUI(true);
        const result = parameters
            ? action(...parameters)
            : action();
        const promise = result instanceof Promise ? result : Promise.resolve(result);
        return promise.then((res) => {
            disableUI && disableUI(false);
            if (res instanceof Error) {
                onError && onError(res);
            } else {
                onSuccess && onSuccess(res);
            }
            return res;
        });
    }, [ parameters, action, disableUI, onError, onSuccess ]);
