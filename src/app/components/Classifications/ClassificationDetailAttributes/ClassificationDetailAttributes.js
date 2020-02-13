/* @flow */

import React, { Component, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import AttributeDetailModal from 'app/containers/Classifications/AttributeDetailModal/AttributeDetailModal';
import { safeToJsArray } from 'app/utils/trasformer/transformer';
import Container from 'app/components/atoms/Container/Container';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import Immutable, { set } from 'app/utils/immutable/Immutable';
import { get, map, groupBy, sortBy } from 'app/utils/lo/lo';

import DragDropApp from './dragdrop/DragDropApp';
import './ClassificationDetailAttributes.less';

/**
 * General tab in classifications view.
 * Todo: We probably should extract the form in it's own component, however
 * nearly the only code here is form related.
 */
class ClassificationDetailAttributesComponent extends Component<Object, Object> {


    static propTypes: Object = {
        classification: PropTypes.object,
        updateClassification: PropTypes.func,
        addAttribute: PropTypes.func,
        match: PropTypes.object,
        userProfile: PropTypes.object,
    };

    state: Object;

    /**
     *
     * @param props
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            classificationForm: props.classification || {}
        };
        (this: Object).handleChange = this.handleChange.bind(this);
        (this: Object).removeAttribute = this.removeAttribute.bind(this);
    }

    /**
     * @override
     */
    componentDidUpdate(prevProps: Object) {
        if (prevProps.classification !== this.props.classification){
            this.setClassificationState(this.props);
        }
    }

    setClassificationState = (data) => {
        this.setState({
            classificationForm: data.classification || null
        });
    };

    /**
     * Handle a form change
     * @param event
     */
    handleChange(event: Object) {
        const { name, value } = event.target;
        // Set a nested state based on input name
        this.setState({
            classificationForm: set( this.state.classificationForm, name, value)
        });
    }

    /**
     * Remove Attribute
     * @param uri
     */
    removeAttribute = (uri) => {
        let fields = this.props.classification.formDefinitions.fields;
        fields = fields.filter((field) => { return field.f_uri !== uri; });
        this.setState(
            { classificationForm: set(this.state.classificationForm, 'formDefinitions.fields', fields) },
            () => {
                const { id, formDefinitions } = this.state.classificationForm || {};
                this.props.updateClassification({ id, formDefinitions });
            }
        );
    };

    /**
     * Lifecycle hook.
     * @returns {XML}
     */
    render () {
        const { classification, match } = this.props;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('entity.classification.edit');
        const classificationFormFields = safeToJsArray(get(this.state, 'classificationForm.formDefinitions.fields'));
        const groupedFields = groupBy(classificationFormFields, 'group_name');

        const sortedFields = map(groupedFields, fields => sortBy(fields, field => Number(field.order_no)));

        return <Fragment>
            <ContentArea>
                <Container width="1024">
                    {
                        (sortedFields.length > 0) &&
                        <DragDropApp
                            classId={classification.id}
                            fields={sortedFields}
                            removeListItem={this.removeAttribute}
                            handleChange={this.updateOrder}
                            canEdit={canEdit}
                        />
                    }
                    {
                        canEdit &&
                        <Route
                            path={`${ match.url }/:attributeFieldUri`}
                            exact
                            render={() => (
                                <AttributeDetailModal
                                    classification={this.props.classification}
                                    updateClassification={this.props.updateClassification}
                                />
                            )}
                        />
                    }
                </Container>
            </ContentArea>
            {
                canEdit &&
                <FooterBar>
                    <TextIcon label="Add" icon="plus" color="primary" onClick={this.props.addAttribute} />
                </FooterBar>
            }
        </Fragment>;

    }

    /**
     * Update order of items after each sort event.
     * @param fields
     */
    updateOrder = (fields: Object) => {

        const myArray = [];
        // Changing the order number
        Object.keys(fields).map((key) => {
            myArray.push(fields[key].map((item, i) => Object.assign(Object.assign({}, item), { order_no: i.toString() }))); // handling immutable data
            return null;
        });
        //Converting it to single array
        const allFieldsUpdated = [];
        myArray.forEach((arr) => {
            arr.forEach((item) => {
                allFieldsUpdated.push(item);
            });
        });
        const setForm = set(this.state, 'classificationForm.formDefinitions.fields', Immutable(allFieldsUpdated));
        this.setState(setForm);
        const classificationForm = get(setForm, 'classificationForm');
        const { id, formDefinitions} = classificationForm || {};
        this.props.updateClassification({ id, formDefinitions});
    }
}

export const ClassificationDetailAttributes = withRouter(ClassificationDetailAttributesComponent);
