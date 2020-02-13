/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'app/components/atoms/Button/Button';
import Form from 'app/components/atoms/Form/Form';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import history from 'store/History';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
/**
 * Renders the form to a add a Thing
 */
class ThingAdd extends Component<Object, Object> {

    static propTypes = {
        addThingFn: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        userProfile: PropTypes.object,
    };

    formRef: Object = React.createRef();

    @bind
    @memoize()
    fieldDefinitions(isAdmin) {
        return [
            {
                field: 'thingId',
                type: 'text',
                properties: {
                    label: 'Unique External Reference',
                    name: 'thingId',
                },
                constraints: {
                    maxLength: 60,
                },
            },
            {
                field: 'name',
                type: 'text',
                properties: {
                    label: 'Name',
                    name: 'name',
                },
                constraints: {
                    required: true,
                    minLength: 3,
                    maxLength: 60,
                },
            },
            {
                field: 'description',
                type: 'text',
                properties: {
                    label: 'Description',
                    name: 'description',
                },
            },
            {
                field: 'classes',
                type: 'classificationTypeahead',
                properties: {
                    label: 'Classification',
                    name: 'classes',
                    filterBy: isAdmin ? null : [{ field: 'active', op: '=', value: true }],
                    multiple: true,
                    applicableOn: 'thing',
                },
            },
        ];
    };

    /**
     * Handle the form submit event.
     * @param e the form submit SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    @bind
    onFormSubmit(e: Event) {
        e.preventDefault();
        this.formRef.current.isValidForm().then(({ data, errors }) => {
            if (!errors) {
                this.props.addThingFn(data).then((result) => {
                    const { id } = result || {};
                    if (id) {
                        history.push(`/things/${id}/`);
                    }
                });
            }
        });
    };

    /**
     * @override
     */
    render(): Object {
        const { isLoading, userProfile: { isAdmin } } = this.props;
        return (
            <Form loading={isLoading} >
                <FormGenerator
                    components={this.fieldDefinitions(isAdmin)}
                    ref={this.formRef}
                    ListItemProps={{
                        disableGutters: true
                    }}
                />
                <ModalFooter>
                    <Button type="button" onClick={history.pushBack}>Cancel</Button>
                    <Button onClick={this.onFormSubmit} type="submit" color="primary">Submit</Button>
                </ModalFooter>
            </Form>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.entities.things.save.isLoading,
        thing: state.entities.things.save.data,
        userProfile: state.user.profile,
    }))(ThingAdd);
