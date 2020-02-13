/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import PersonAutocomplete from 'app/components/molecules/Autocomplete/PersonAutocomplete';
import RelationDefinitionAutocomplete from 'app/components/molecules/Autocomplete/RelationDefinitionAutocomplete';
import OrganisationAutocomplete from 'app/components/molecules/Autocomplete/OrganisationAutocomplete';
import ThingAutocomplete from 'app/components/molecules/Autocomplete/ThingAutocomplete';
import CustomEntitesAutocomplete from 'app/components/molecules/Autocomplete/CustomEntitesAutocomplete';
import Button from 'app/components/atoms/Button/Button';
import Form from 'app/components/atoms/Form/Form';
import Modal from 'app/components/molecules/Modal/Modal';
import { set } from 'app/utils/lo/lo';
import history from 'store/History';
import { createRelationship } from 'store/actions/entities/relationshipsActions';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import { allTypesProps } from 'app/utils/propTypes/common';
import ProcessesAutocomplete from 'app/components/molecules/Autocomplete/ProcessesAutocomplete';
import TasksAutocomplete from 'app/components/molecules/Autocomplete/TasksAutocomplete';

/**
 * Renders the view to add a relationship.
 */
class AddRelationship extends PureComponent<Object, Object> {

    static propTypes = {
        entityId: PropTypes.string.isRequired,
        type1: allTypesProps.isRequired,
        type2: allTypesProps.isRequired,
        location: PropTypes.object.isRequired,
        userProfile: PropTypes.object,
        createRelationship: PropTypes.func.isRequired,
    };

    state = {
        data: {},
        isDisabled: true,
    };

    aboxTypes = ['process', 'task'];

    /**
     * Adds the relationship.
     *
     * @param event SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onFormSubmit = (event) => {
        event.preventDefault();
        const { entityId, type1, type2, location } = this.props;
        const data = this.state.data || {};
        const { relationDefinition, entity2 } = data;
        if (!relationDefinition || !relationDefinition.id || !relationDefinition.entityType1 || !relationDefinition.entityType2) {
            return this.props.toster;
        }
        if (!entity2 || !entity2.id) {
            return this.props.toster;
        }
        const record = {
            relationDefinitionId: relationDefinition.id,
            nodeId1: 0,
            nodeId2: 0,
        };
        const { entityType1, entityType2, isReverse } = relationDefinition;
        if (entityType1 === type1 && entityType2 === type2 && !isReverse) {
            record.nodeId1 = Number(entityId);
            record.nodeId2 = Number(entity2.id);
        } else if (entityType1 === type2 && entityType2 === type1) {
            record.nodeId1 = Number(entity2.id);
            record.nodeId2 = Number(entityId);
        } else {
            return this.props.toster;
        }
        this.setState({ isDisabled: true });
        this.props.createRelationship(record)
            .then((mbError) => {
                if (!(mbError instanceof Error)) {
                    this.setState({ data: {}, isDisabled: true });
                    history.push(location.pathname.replace('/add', ''));
                } else {
                    this.setState({ isDisabled: false });
                }
            });
    };

    /**
     * @param event SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onChange = (event: Object) => {
        const { name, value } = event.target;
        const data = set(this.state.data, name, value);
        this.setState({ data, isDisabled: !(data.relationDefinition && data.entity2) });
    };

    _buildFilterBy = memoizeOne((data: Object, entityId, type1, type2, isAdmin: boolean = false) => {
        const nType1 = type1 === 'custom' ? 'customEntity' : type1;
        const filterBy = [];
        if (type1 === type2) {
            filterBy.push({ field: 'id', op: '<>', value: entityId });
        }
        if (data.relationDefinition) {
            filterBy.push({
                or: [
                    [
                        { field: `relationships.${nType1}1.id`, op: '<>', value: entityId },
                        {
                            field: `relationships.relationDefinition.id`,
                            op: '<>',
                            value: data.relationDefinition.id,
                        },
                    ],
                    [
                        { field: `relationships.${nType1}2.id`, op: '<>', value: entityId },
                        {
                            field: `relationships.relationDefinition.id`,
                            op: '<>',
                            value: data.relationDefinition.id,
                        },
                    ],
                ],
            });
        }
        if (!isAdmin && !this.aboxTypes.includes(type2)) {
            filterBy.push({ field: 'active', op: '=', value: true });
        }
        return filterBy;
    });

    renderEntitySelect() {
        const { type1, type2, entityId, userProfile: { isAdmin } } = this.props;
        const { data = {} } = this.state;
        if (!data.relationDefinition) {
            return null;
        }
        const props = {
            key: data.entity2 && data.entity2.id,
            name: 'entity2',
            value: data.entity2,
            onChange: this.onChange,
            filterBy: this._buildFilterBy(data, entityId, type1, type2, isAdmin),
            required: true,
        };
        if (type2 === 'thing') {
            return (<ThingAutocomplete
                {...props}
                label="Choose a thing"
            />);
        } else if (type2 === 'person') {
            return (<PersonAutocomplete
                {...props}
                label="Choose a person"
            />);
        } else if (type2 === 'organisation') {
            return (<OrganisationAutocomplete
                {...props}
                label="Choose an organisation"
            />);
        } else if (type2 === 'custom') {
            return (<CustomEntitesAutocomplete
                {...props}
                label="Choose a custom entity"
            />);
        } else if (type2 === 'process') {
            return (<ProcessesAutocomplete
                {...props}
                label="Choose a process"
            />);
        } else if (type2 === 'task') {
            return (<TasksAutocomplete
                {...props}
                label="Choose a task"
            />);
        }
        return <h2>Unsupported type</h2>;
    }

    /**
     * @override
     */
    render() {
        const { type1, type2, location, userProfile: { isAdmin } } = this.props;
        const { data, isDisabled } = this.state;
        const { relationDefinition } = data;
        const filterBy = isAdmin ? [] : [{ field: 'customEntity.active', op: '=', value: true }];
        return (
            <Modal
                title="Add a relationship"
                open
                closeUrl={location.pathname.replace('/add', '')}
            >
                <Form onSubmit={this.onFormSubmit}>
                    <RelationDefinitionAutocomplete
                        name="relationDefinition"
                        label="Choose a relationship type"
                        value={relationDefinition}
                        onChange={this.onChange}
                        type1={type1}
                        type2={type2}
                        filterBy={filterBy}
                        required
                        key={relationDefinition && relationDefinition.id}
                    />
                    {this.renderEntitySelect()}
                    <ModalFooter>
                        <Button type="button" onClick={history.pushBack}>Cancel</Button>
                        <Button type="submit" color="primary" disabled={isDisabled}>Submit</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

export default connect(state => ({
    userProfile: state.user.profile,
}), { createRelationship })(AddRelationship);
