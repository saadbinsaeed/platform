/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Alert from 'app/components/molecules/Alert/Alert';
import Loader from 'app/components/atoms/Loader/Loader';
import Field from 'app/components/molecules/Field/Field';
import { loadGroupClassificationDefinition } from 'store/actions/admin/groupsActions';
import { Col, Row } from 'react-styled-flexboxgrid';
import GroupItem from 'app/components/Entities/Classifications/GroupItem';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

/**
 * Select the group's classification and setup the classification's values.
 */
class GroupClassificationSection extends Component<Object, Object> {

    static propTypes = {
        isLoading: PropTypes.bool,
        definition: PropTypes.object,
        value: PropTypes.string,
        handleChangeClassification: PropTypes.func,
        loadGroupClassificationDefinition: PropTypes.func,
    };

    componentDidMount() {
        const uri = this.props.value;
        if (uri) {
            this.props.loadGroupClassificationDefinition(uri);
        }
    }

    componentDidUpdate(prevProps: Object) {
        const uri = this.props.value;
        if (uri && uri !== prevProps.value) {
            this.props.loadGroupClassificationDefinition(uri);
        }
    }

    @bind
    @memoize()
    generateForm(groups: ? Object[], attributes: Object, permissions: Array<string>, onChange: Function) {
        return (
            <Row>
                {(groups || []).map((group, index) => (
                    <Col key={index} xs={12}>
                        <GroupItem
                            key={index}
                            {...group}
                            canEdit={permissions.includes('edit')}
                            attributes={attributes}
                            updateAttribute={onChange}
                            isCollapsed={false}
                        />
                    </Col>
                ))}
            </Row>
        );
    };


    @bind
    @memoize()
    generateAlert(uri, isLoading, definition, isActive, abstract, form) {
        if (isLoading || !uri) {
            return null;
        }
        if (!isActive)
            return <Alert type='background'>The classification is disabled.</Alert>;

        if (!form)
            return <Alert type='background'>The classification does not have any attributes.</Alert>;

        if (!definition)
            return <Alert type='background'>{`You do not have permission to view the classification "${uri}".`}</Alert>;
        return null;
    }

    render(): Object {
        const { value, definition, isLoading, attributes, permissions } = this.props;
        const { active, abstract, groups } = definition || {};
        const uri = value;
        let form = null;
        if (!isLoading && uri && active && groups) {
            form = this.generateForm(
                groups,
                attributes,
                permissions,
                this.props.handleChangeClassification,
            );
        }
        return (
            <span>
                {(!permissions || permissions.length === 0) && <Field label="Classification" name="this.props.name" value={uri} disabled />}
                {isLoading && <Loader absolute={true} />}
                {form}
                {this.generateAlert(uri, isLoading, definition, active, abstract, form)}
            </span>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.admin.groups.group.classificationDefinition.isLoading,
        definition: state.admin.groups.group.classificationDefinition.definition,
    }),
    { loadGroupClassificationDefinition }
)(GroupClassificationSection);
