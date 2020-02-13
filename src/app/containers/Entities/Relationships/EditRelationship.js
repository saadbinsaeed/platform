/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import history from 'store/History';
import { updateRelationship } from 'store/actions/entities/relationshipsActions';
import Stepper from 'app/components/Stepper/Stepper';
import RelationshipAddThirdStep from 'app/containers/Entities/Relationships/RelationshipAddThirdStep';
import Loader from 'app/components/atoms/Loader/Loader';
import { loadRelationship } from 'store/actions/entities/relationshipsActions';
import { showToastr } from 'store/actions/app/appActions';
import { bind } from 'app/utils/decorators/decoratorUtils';
import PageNotAllowed from 'app/containers/ErrorPages/PageNotAllowed';

/**
 *  ThingNewRelationship view
 */
export class EditRelationship extends PureComponent<Object, Object> {
    static propTypes = {
        id: PropTypes.string.isRequired,
        type2: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        updateRelationship: PropTypes.func.isRequired,
        loadRelationship: PropTypes.func.isRequired,

        relationship: PropTypes.object,
        showToastr: PropTypes.func.isRequired
    };

    static defaultProps = {
        isLoading: true
    };

    state: Object = {};

    constructor(props: Object) {
        super(props);
        const { id, loadRelationship } = props;
        loadRelationship(id);
    }

    componentDidUpdate(prevProps: Object){
        if (this.props.id !== prevProps.id) {
            this.props.loadRelationship(this.props.id);
        }
    }

    @bind
    onCompletion(){
        const { attributes } = this.state;
        return this.props.updateRelationship({ id: this.props.id, attributes });
    };

    @bind
    onChange(event: Object){
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    @bind
    onClose(){
        const { baseUri, type2 } = this.props;
        history.push(`${baseUri}/${type2}`);
    };

    render() {
        const { isLoading, relationship } = this.props;
        if (isLoading) {
            return <Loader absolute />;
        }
        if (!relationship) {
            return <PageNotAllowed title={`relationship between ${this.props.id} ${this.props.entityId}`} />;
        }
        return (
            <Stepper
                steps={[
                    {
                        title: 'Edit Attributes',
                        subTitle: 'Edit attributes of the relationship',
                        formId: 'classificationForm',
                        content: <RelationshipAddThirdStep
                            isEdit
                            onClose={this.onClose}
                            onChange={this.onChange}
                            value={{ ...relationship, ...this.state }}
                        />
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
        relationship: state.entities.relationship.data,
        isLoading: state.entities.relationship.isLoading
    }),
    {
        updateRelationship,
        loadRelationship,
        showToastr
    }
)(EditRelationship);
