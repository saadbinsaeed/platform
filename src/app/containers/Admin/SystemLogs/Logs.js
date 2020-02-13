/* @flow */

import React, { Component } from 'react';
import PageTemplate from 'app/components/templates/PageTemplate';
import IFrame from 'app/components/atoms/IFrame/IFrame';

/**
 * Renders the view to display the classification.
 */
class Logs extends Component<Object, Object> {

    /**
     * @override
     */
    render(): Object {
        return (
            <PageTemplate title="System Logs" overflowHidden>
                <IFrame title="System Logs" src="/logs/">
                </IFrame>
            </PageTemplate>
        );
    }
}

export default Logs;
