/* @flow */

import React, { PureComponent } from 'react';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { DateTimePicker} from '@mic3/platform-ui';
import { set } from 'app/utils/immutable/Immutable';

class DateTime extends PureComponent<Object, Object> {

    @bind
    @memoize()
    getDialogProps(DialogProps: Object) {
        return set(DialogProps, 'style.zIndex', 3000);
    };

    render() {
        const { DialogProps, ...rest } = this.props;
        const newDialogProps = this.getDialogProps(DialogProps);
        return (
            <DateTimePicker
                DialogProps={newDialogProps}
                {...rest}
            />
        );
    }
}

export default DateTime;
