/* @flow */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from 'app/components/templates/PageTemplate';
import affectliSso from 'app/auth/affectliSso';
import Alert from 'app/components/molecules/Alert/Alert';
import Flex from 'app/components/atoms/Flex/Flex';

/**
 * If user profile not found container
 */
class UserNotFound extends Component<Object, Object> {
    /**
     * @override
     */
    render() {
        const username = affectliSso.getUserLogin();
        return (
            <PageTemplate title="User not found" overflowHidden>
                <Flex grow style={{ height: '100%', justifyContent: 'center' }}>
                    <Alert type="error">
                        <div>You are currently logged <b>{username}</b> while trying to access <b>{window.location.hostname}</b>.</div>
                        <div><b>{username}</b> does not exist or is not allowed to log in to this domain.</div>
                        <div><Link to="#" onClick={() => affectliSso.logout()}>Click here to log out</Link></div>
                    </Alert>
                </Flex>
            </PageTemplate>
        );
    }
}

export default UserNotFound;
