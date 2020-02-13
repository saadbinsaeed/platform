/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import history from 'store/History';
import { createRelationship, loadEntityData } from 'store/actions/entities/relationshipsActions';
import { allTypesProps } from 'app/utils/propTypes/common';
import Stepper from 'app/components/Stepper/Stepper';
import RelationshipAddFirstStep from 'app/containers/Entities/Relationships/RelationshipAddFirstStep';
import RelationshipAddSecondStep from 'app/containers/Entities/Relationships/RelationshipAddSecondStep';
import RelationshipAddThirdStep from 'app/containers/Entities/Relationships/RelationshipAddThirdStep';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';
import Loader from 'app/components/atoms/Loader/Loader';
import { bind } from 'app/utils/decorators/decoratorUtils';

/**
 *  ThingNewRelationship view
 */
export class AddRelationshipNew extends Component<Object, Object> {
    static propTypes = {
        userProfile: PropTypes.object,
        type1: allTypesProps.isRequired,
        entityId: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        entityData: PropTypes.object,
        loadEntityData: PropTypes.func.isRequired,
    };

    state: Object = {};

    constructor(props: Object) {
        super(props);
        this.fetchEntityData();
    }

    /**
     * this should produce data like this:
     *
     nodeId1: BigInt!
     nodeId2: BigInt!

     relationDefinitionId: BigInt

     attributes: JSON
     * @param data
     * @param type1
     * @param entityId
     * @returns {{remove: string}|{nodeId2: number, nodeId1: number, relationDefinitionId: *}}
     */
    static prepareCreateData(data: Object, type1: string, entityId: string) {
        const { relationDefinition, type2, entity2, attributes } = data;
        const record = {
            relationDefinitionId: relationDefinition.id,
            nodeId1: 0,
            nodeId2: 0,
            attributes
        };
        const { entityType1, entityType2, isReverse } = relationDefinition;
        if (entityType1 === type1 && entityType2 === type2 && !isReverse) {
            record.nodeId1 = Number(entityId);
            record.nodeId2 = Number(entity2.id);
        } else {
            // else if (entityType1 === type2 && entityType2 === type1)
            record.nodeId1 = Number(entity2.id);
            record.nodeId2 = Number(entityId);
        }
        return record;
    }

    componentDidUpdate(prevProps: Object) {
        if (this.props.entityId !== prevProps.entityId) {
            this.fetchEntityData();
        }
    }

    @bind
    fetchEntityData() {
        if (this.props.entityId && this.props.type1) {
            this.props.loadEntityData(this.props.entityId, this.props.type1);
        }
    }

    @bind
    onCompletion(data: Object){
        // we finished our steps and now we need to create relationship and redirect to correct view
        return this.props.createRelationship(AddRelationshipNew.prepareCreateData(this.state, this.props.type1, this.props.entityId));
    };

    @bind
    onClose(){
        const { baseUri } = this.props;
        const { type2 } = this.state;
        if (type2) {
            return history.push(`${baseUri}/${type2}`);
        }
        history.push(baseUri);
    };

    @bind
    onChange(event: Object){
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        const { entityId, type1, userProfile: { isAdmin = false } = {}, isLoading, entityData } = this.props;
        if (isLoading) {
            return <Loader absolute backdrop />;
        }
        if (!entityData || !entityData.id) {
            return <PageNotAllowed title={`${type1} (ID:${entityId})`} />;
        }

        return (
            <Stepper
                steps={[
                    {
                        title: 'Add New Relationship',
                        subTitle: 'Choose "Entity Type" and "Relationship Type"',
                        formId: 'relationshipsAddStep1',
                        content: <RelationshipAddFirstStep type1={type1} isAdmin={isAdmin} onChange={this.onChange} value={this.state} />
                    },
                    {
                        title: 'Select Related Record',
                        subTitle: 'Choose One Related Record',
                        formId: 'relationshipsAddStep2',
                        content: <RelationshipAddSecondStep entityId={entityId} type1={type1} isAdmin={isAdmin} onChange={this.onChange} value={this.state} />
                    },
                    {
                        title: 'Add Attributes',
                        subTitle: 'Add attributes to the relationship',
                        formId: 'classificationForm',
                        content: <RelationshipAddThirdStep onClose={this.onClose} onChange={this.onChange} value={this.state} />
                    }
                ]}
                onClose={this.onClose}
                onDone={this.onCompletion}
            />
        );
    }
}

export default connect(
    state => ({
        userProfile: state.user.profile,
        isLoading: state.entities.entityData.isLoading,
        entityData: state.entities.entityData.data,

    }),
    {
        createRelationship,
        loadEntityData
    }
)(AddRelationshipNew);
