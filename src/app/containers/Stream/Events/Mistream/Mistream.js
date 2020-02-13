/* @flow */
import React, { PureComponent } from 'react';
import IFrame from 'app/components/atoms/IFrame/IFrame';
import PageTemplate from 'app/components/templates/PageTemplate';


/**
 * Renders the view to display the Kaylo.
 */
class Mistream extends PureComponent<Object, Object> {

    /**
     * @override
     */
    render(): Object {
        return(
            <PageTemplate title="Mi-Stream" overflowHidden>
                <IFrame title="Mi-Stream" src="/kylo">
                </IFrame>
            </PageTemplate>
        );
    }
}

export default Mistream;
