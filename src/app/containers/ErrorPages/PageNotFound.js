/* @flow */

import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import React, { Component } from 'react';
import Alert from 'app/components/molecules/Alert/Alert';
import Flex from 'app/components/atoms/Flex/Flex';
import PageTemplate from 'app/components/templates/PageTemplate';

/**
 * 404 page container
 */
class PageNotFound extends Component<Object, Object> {
    /**
     * @override
     */
    render() {
        return (
            <PageTemplate title="Page not found" overflowHidden>
                <ContentArea>
                    <Flex grow style={{ height: '100%', justifyContent: 'center' }}>
                        <Alert type="error">
                            <h2>Page Not Found.</h2>
                        </Alert>
                    </Flex>
                </ContentArea>
            </PageTemplate>
        );
    }
}

export default PageNotFound;
