/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Courtesy from 'app/components/atoms/Courtesy';
import Loader from 'app/components/atoms/Loader/Loader';
import { connect } from 'react-redux';
import { loadClassificationAttributes } from 'store/actions/entities/relationshipsActions';
import EntityClassifications from 'app/components/Entities/Classifications/EntityClassifications';
import { normalizeClass } from 'store/actions/entities/common/entityAttributesActions';
import Button from 'app/components/atoms/Button/Button';
import { createEvent } from 'app/utils/http/event';
import { hideStepperSave } from 'store/actions/app/appActions';

const Content = styled.div`
    height: calc(100vh - 94px);
    overflow-y: auto;
`;

const GoBackWrapper = styled.div`
    text-align: center;
    button {
        color: #529fbb;
    }
`;

const GoBackButton = ({ onClose }) => {
    return (
        <GoBackWrapper>
            <Button type={'button'} onClick={onClose}>
                GO BACK
            </Button>
        </GoBackWrapper>
    );
};

/**
 *  RelationshipAddFirstStep view
 */
export class RelationshipAddThirdStep extends PureComponent<Object, Object> {
    static propTypes = {
        onClose: PropTypes.func,
        loadClassificationAttributes: PropTypes.func.isRequired,
        hideStepperSave: PropTypes.func.isRequired,
        value: PropTypes.object,
        isLoading: PropTypes.bool,
        isEdit: PropTypes.bool,
        classes: PropTypes.object
    };

    static defaultProps = {
        value: {}
    };

    constructor(props: Object) {
        super(props);

        const {
            relationDefinition: { classification }
        } = props.value;
        if (classification) {
            props.loadClassificationAttributes(classification);
        } else {
            this.props.hideStepperSave();
        }
    }

    componentDidUpdate(prevProps: Object) {
        if (prevProps.isLoading && !this.props.isLoading && !this.props.classes) {
            this.props.hideStepperSave();
        }
    }

    render() {
        const { classes, isLoading, onClose, value, isEdit } = this.props;
        const {
            attributes,
            relationDefinition: { classification }
        } = value;
        if (!classification) {
            return (
                <div>
                    <Courtesy message={'There is no classification for this relationship type.'} />
                    {isEdit && <GoBackButton onClose={ onClose }/> }
                </div>
            );
        }
        if (isLoading) {
            return <Loader absolute />;
        }
        if (!classes) {
            return (
                <div>
                    <Courtesy message={'You don\'t have permission to add/update attributes.'} />
                    {isEdit && <GoBackButton onClose={ onClose }/> }
                </div>
            );
        }
        return (
            <Content>
                <EntityClassifications
                    attributes={attributes}
                    canEdit={true}
                    canAdd={false}
                    canViewClasses={true}
                    isSaveAvailable={false}
                    classes={[classes]}
                    updateAttribute={this.updateAttributes}
                />
            </Content>
        );
    }

    updateAttributes = (e: Object) => {
        const { name, value } = e.target;
        const { attributes } = this.props.value;
        const event = createEvent('change', { name: 'attributes', value: { ...attributes, [name]: value } });
        this.props.onChange(event);
    };
}

export default connect(
    state => ({
        isLoading: state.entities.relationshipClassifications.isLoading,
        classes: state.entities.relationshipClassifications.data && normalizeClass(state.entities.relationshipClassifications.data)
    }),
    {
        loadClassificationAttributes,
        hideStepperSave
    }
)(RelationshipAddThirdStep);
