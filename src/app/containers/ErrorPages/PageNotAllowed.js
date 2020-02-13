/* @flow */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Alert from 'app/components/molecules/Alert/Alert';
import Flex from 'app/components/atoms/Flex/Flex';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import PageTemplate from 'app/components/templates/PageTemplate';

/**
 * If the user is not allowed to see the page.
 */
class PageNotAllowed extends Component<Object, Object> {

    static propTypes: Object = {
        title: PropTypes.string,
        errorOptions: PropTypes.object,
    };
    /**
     * @override
     */
    render() {
        const { title, errorOptions } = this.props;
        return (
            <PageTemplate title={errorOptions.isError ? 'Error' : 'User is not allowed'} overflowHidden>
                <ContentArea>
                    <Flex grow style={{ height: '100%', justifyContent: 'center' }}>
                        <Alert type="error">
                            <div>{errorOptions.isError ? errorOptions.detail : <p>You have no permission to see selected <b>{title}</b></p> }</div>
                            <div>Click here to navigate to <Link to="/" style={{ color: 'purple' }}>homepage</Link>.</div>
                        </Alert>
                    </Flex>
                </ContentArea>
            </PageTemplate>
        );
    }
}

const mapStateToProps = (state: Object): Object => {
    return {
        errorOptions: state.app.errorOptions
    };
};
export default connect(mapStateToProps,{})(PageNotAllowed);
