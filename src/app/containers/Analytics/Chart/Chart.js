/* @flow */

import React, { Component } from 'react';
import PageTemplate from 'app/components/templates/PageTemplate';
import IFrame from 'app/components/atoms/IFrame/IFrame';

/**
 * Renders the view to display the classification.
 */
class Chart extends Component<Object, Object> {

    /**
     * @override
     */
    render(): Object {
        return (
            <PageTemplate title="Analytics" overflowHidden>
                <IFrame title="Analytics" src="/pentaho">
                </IFrame>
            </PageTemplate>
        );
    }
}

export default Chart;
