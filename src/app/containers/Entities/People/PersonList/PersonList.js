/* @flow */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PeopleGrid from 'app/components/People/PeopleGrid/PeopleGrid';
import PageTemplate from 'app/components/templates/PageTemplate';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
/**
 * Renders the view to display the people.
 */
class PeopleListComponent extends PureComponent<Object, Object> {
    /**
     * @override
     */
    render(): Object {
        return (
            <PageTemplate title="People">
                <ContentArea>
                    <PeopleGrid />
                </ContentArea>
            </PageTemplate>
        );
    }
}

export const PeopleList = withRouter(PeopleListComponent);
