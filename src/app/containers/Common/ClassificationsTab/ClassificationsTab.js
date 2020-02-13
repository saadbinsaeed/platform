/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import EntityClassifications from 'app/components/Entities/Classifications/EntityClassifications';
import Loader from 'app/components/atoms/Loader/Loader';
import { deepEquals } from 'app/utils/utils';
import { loadEntityClassesAndAttributes, saveEntityAttributes } from 'store/actions/entities/common/entityAttributesActions';
import { removeEntityClass } from 'store/actions/entities/entitiesActions';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';

/**
 * Dynamically renders classifications
 */
class ClassificationsTab extends PureComponent<Object, Object> {

    static propTypes: Object = {
        type: PropTypes.oneOf(['thing', 'organisation', 'person', 'custom']).isRequired,
        classes: PropTypes.array,
        loadEntityClassesAndAttributes: PropTypes.func.isRequired,
        removeEntityClass: PropTypes.func.isRequired,
        attributes: PropTypes.object,
        saveEntityAttributes: PropTypes.func.isRequired,
        isAdmin: PropTypes.bool,
        permissions: PropTypes.array,
        entityPermissions: PropTypes.array,
        isLoading: PropTypes.bool,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
    };

    static defaultProps: Object = {
        classes: [],
        attributes: {},
        isAdmin: false,
        permissions: [],
        entityPermissions: [],
        isLoading: true,
    };

    constructor(...args: Array<any>) {
        super(...args);
        const { isAdmin, type } = this.props;
        const permissions = this.props.permissions || [];
        const entityPermissions = this.props.entityPermissions || [];
        this.state = {
            canEdit: isAdmin || (
                permissions.includes(`entity.${type}.edit`)
                && (entityPermissions.includes('edit') || entityPermissions.includes('write'))
            ),
            canViewClasses: isAdmin || permissions.includes('entity.classification.view'),
            attributes: this.props.attributes,
        };
    }

    componentDidMount() {
        this.props.loadEntityClassesAndAttributes(this.props.match.params.id);
    }

    componentWillUnmount() {
        this.props.loadEntityClassesAndAttributes(null);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.loadEntityClassesAndAttributes(this.props.match.params.id);
        }
        if (
            prevProps.isAdmin !== this.props.isAdmin
            || !deepEquals(prevProps.permissions, this.props.permissions)
            || !deepEquals(prevProps.entityPermissions, this.props.entityPermissions)
        ) {
            const { isAdmin, type } = this.props;
            const permissions = this.props.permissions || [];
            const entityPermissions = this.props.entityPermissions || [];
            this.setState({
                canEdit: isAdmin || (
                    permissions.includes(`entity.${type}.edit`)
                    && (entityPermissions.includes('edit') || entityPermissions.includes('write'))
                ),
                canViewClasses: isAdmin || permissions.includes('entity.classification.view'),
            });
        }
        if (!deepEquals(prevProps.attributes, this.props.attributes)) {
            this.setState({ attributes: this.props.attributes });
        }
    }

    removeClass = (id: number) => {
        this.props.removeEntityClass(this.props.match.params.id, id).then((response) => {
            if (response instanceof Error === false) {
                this.props.loadEntityClassesAndAttributes(this.props.match.params.id);
            }
        });
    };

    updateAttributes = (event: Object) => {
        const { name, value } = event.target;
        const { attributes } = this.state;
        this.setState({ attributes: { ...attributes, [name]: value } });
    };

    saveEntityAttributes = () => {
        if (!deepEquals(this.props.attributes, this.state.attributes)) {
            const { attributes } = this.state;
            if (attributes) {
                this.props.saveEntityAttributes(this.props.match.params.id, attributes);
            }
        }
    };

    render(): Object {
        const { isLoading } = this.props;
        if (isLoading) {
            return <Loader/>;
        }
        const { classes } = this.props;
        return (
            <EntityClassifications
                {...this.state}
                key={this.props.match.params.id}
                classes={classes}
                removeClass={this.removeClass}
                saveEntityAttributes={this.saveEntityAttributes}
                updateAttribute={this.updateAttributes}
            />
        );
    }
}

export default connect(
    (state) => {
        const { data } = state.entities.commonClassifications.classifications;
        const { classes = [], attributes = {}, entityPermissions = [] } = data || {};
        const { isAdmin = false, permissions = [] } = state.user.profile;
        const isLoading1 = state.entities.commonClassifications.classifications.isLoading || false;
        const isLoading2 = state.entities.common.removingClass || false;
        return {
            classes,
            isLoading: isLoading1 || isLoading2,
            attributes,
            entityPermissions,
            isAdmin,
            permissions,
        };
    },
    {
        loadEntityClassesAndAttributes,
        removeEntityClass,
        saveEntityAttributes,
    },
)(withRouter(ClassificationsTab));
