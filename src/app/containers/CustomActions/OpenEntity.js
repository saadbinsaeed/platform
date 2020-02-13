/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { getEntityType } from 'store/actions/entities/entitiesActions';
import { get } from 'app/utils/lo/lo';
import { showToastr } from 'store/actions/app/appActions';
import Loader from 'app/components/atoms/Loader/Loader';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import { isDefined } from 'app/utils/utils';

/**
 *
 */
class OpenEntity extends PureComponent<Object, Object> {
    static propTypes = {
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string }),
        getEntityType: PropTypes.func.isRequired,
        showToastr: PropTypes.func.isRequired
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            isLoading: true,
            entityType: null
        };
    }

    componentDidMount() {
        const entityId = String(get(this.props, 'match.params.id'));
        if (entityId && this.props.getEntityType) {
            this.fetchEntitiyType();
        }
    }

    fetchEntitiyType = () => {
        const entityId = String(get(this.props, 'match.params.id'));
        this.props.getEntityType(entityId).then((response: Object) => {
            const type = get(response, 'entity.type');
            if (!(response instanceof Error)) {
                if (isDefined(type)) {
                    this.setState({ entityType: String(type), isLoading: false });
                } else {
                    this.setState({ entityType: null, isLoading: false });
                    this.props.showToastr({ severity: 'warn', detail: 'Invalid Entity Id' });
                }
            }
        });
    };

    componentDidUpdate(prevProps) {
        const entityId = String(get(this.props, 'match.params.id'));
        const prevId = String(get(prevProps, 'match.params.id'));
        if (entityId !== prevId) {
            this.fetchEntitiyType();
        }
    }

    /**
     * render - description
     *
     * @return {type}  description
     */
    render() {
        const { entityType, isLoading } = this.state;
        const entityId = String(get(this.props, 'match.params.id'));

        if (isLoading) return <Loader absolute backdrop />;

        if (entityType && entityId) {
            const linkTo = {
                thing: `/things/${entityId}`,
                person: `/people/${entityId}`,
                organisation: `/organisations/${entityId}`,
                custom: `/custom-entities/${entityId}`
            }[entityType];
            if (linkTo) return <Redirect to={linkTo} />;
        }
        return <PageNotAllowed title={`Entity (ID:${entityId})`} />;
    }
}

export default connect(
    null,
    {
        showToastr,
        getEntityType
    }
)(OpenEntity);
