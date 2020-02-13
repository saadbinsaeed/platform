/* @flow */

import React, { Component } from 'react';
import PageTemplate from 'app/components/templates/PageTemplate';
import IFrame from 'app/components/atoms/IFrame/IFrame';

/**
 * Renders the view to display the classification.
 */
class Designer extends Component<Object, Object> {

    /**
     * @override
     */
    render(): Object {
        return (
            <PageTemplate title="Designer" overflowHidden>
                <IFrame title="Designer" src="/activiti/editor/">
                </IFrame>
            </PageTemplate>
        );
    }
}

export default Designer;
