/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Switch, Route, Redirect } from 'react-router-dom';
import memoize from 'fast-memoize';

import TabRow from 'app/components/molecules/Tabs/TabRow';
import TabItem from 'app/components/molecules/Tabs/TabItem';
import PageTemplate from 'app/components/templates/PageTemplate';
import { formatDate } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { loadClassification, updateClassification } from 'store/actions/classifications/classificationsActions';
import history from 'store/History';
import { showToastr } from 'store/actions/app/appActions';
import ClassificationDetailAbout from 'app/components/Classifications/ClassificationDetailAbout/ClassificationDetailAbout';
import { ClassificationDetailAttributes } from 'app/components/Classifications/ClassificationDetailAttributes/ClassificationDetailAttributes';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Loader from 'app/components/atoms/Loader/Loader';
import ClassificationEntitiesTab from './Tabs/ClassificationEntitiesTab';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';

/**
 * Classification container
 */
class ClassificationDetail extends PureComponent<Object, Object> {
    static propTypes: Object = {
        id: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        classification: PropTypes.object,
        loadClassification: PropTypes.func,
        updateClassification: PropTypes.func,
        showToastr: PropTypes.func,
        userProfile: PropTypes.object
    };
    static defaultProps: Object = {};

    /**
     * @override
     */
    componentDidMount(): void {
        this.props.loadClassification(this.props.id);
    }

    /**
     * @override
     * @param prevProps the properties that the component will receive.
     */
    componentDidUpdate(prevProps: Object) {
        const { id } = this.props;
        if (id !== prevProps.id && id !== 'add') {
            this.props.loadClassification(id);
        }
    }

    /** Add an attribute */
    addAttribute = () => {
        history.push(`/classifications/${this.props.id}/attributes/new`);
    };

    buildInfo = memoize((createdBy: string, modified: string, status: string) => [
        { key: 'Created by', value: createdBy },
        { key: 'Last Modified', value: modified },
        { key: 'Status', value: status }
    ]);

    /**
     * @override
     */
    render(): Object {
        const { classification, match, userProfile, isLoading, id, showToastr, updateClassification } = this.props;

        const { createdBy, createdDate, modifiedDate, active } = classification || {};
        if (!isLoading && !classification.id) {
            return <PageNotAllowed title={`Classification. (ID:${id})`} />;
        }

        const createdInfo = `${createdBy ? `${String(get(createdBy, 'name') || '')} on ` : ''} ${formatDate(createdDate)}`;
        const modified = formatDate(modifiedDate);
        const status = active ? 'Active' : 'Inactive';

        return (
            <Fragment>
                {isLoading && <Loader absolute backdrop />}
                <PageTemplate
                    title={get(classification, 'name')}
                    subTitle={`#${String(get(classification, 'uri') || '')}`}
                    info={this.buildInfo(createdInfo, modified, status)}
                    right={<ButtonIcon icon="plus" onClick={this.addAttribute} />}
                >
                    <TabRow>
                        <TabItem label="About" to={`/classifications/${id}/about`} />
                        <TabItem label="Attributes" to={`/classifications/${id}/attributes`} />
                        <TabItem label="Entities" to={`/classifications/${id}/entities`} />
                    </TabRow>
                    <Switch>
                        <Route path={match.url} exact component={() => <Redirect to={`${match.url}/about`} />} />
                        <Route
                            path={`${match.url}/about`}
                            render={() => (
                                <ClassificationDetailAbout
                                    classification={classification}
                                    showToastr={showToastr}
                                    updateClassification={updateClassification}
                                    userProfile={userProfile}
                                />
                            )}
                        />
                        <Route
                            path={`${match.url}/attributes`}
                            render={() => (
                                <ClassificationDetailAttributes
                                    classification={classification}
                                    updateClassification={this.props.updateClassification}
                                    addAttribute={this.addAttribute}
                                    userProfile={userProfile}
                                    match={match}
                                />
                            )}
                        />
                        <Route path={`${match.url}/entities`} component={ClassificationEntitiesTab} />
                    </Switch>
                </PageTemplate>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: Object, ownProps: Object): Object => {
    return {
        isLoading: state.classifications.details.isLoading || state.classifications.update.isLoading,
        classification: state.classifications.details.data || {},
        userProfile: state.user.profile,
        id: ownProps.match.params.id
    };
};

export default connect(
    mapStateToProps,
    {
        loadClassification,
        updateClassification,
        showToastr
    }
)(withRouter(ClassificationDetail));
