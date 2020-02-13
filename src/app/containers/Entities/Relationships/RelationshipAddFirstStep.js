/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from 'app/components/atoms/Container/Container';
import Card from 'app/components/molecules/Card/Card';
import RelationDefinitionAutocomplete from 'app/components/molecules/Autocomplete/RelationDefinitionAutocomplete';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import { createEvent } from 'app/utils/http/event';

/**
 *  RelationshipAddFirstStep view
 */
export class RelationshipAddFirstStep extends Component<Object, Object> {
    static propTypes = {
        isAdmin: PropTypes.bool,
        type1: PropTypes.string,
        value: PropTypes.object
    };

    componentDidUpdate(prevProps: Object, prevState: Object) {
        if (prevProps.value && this.props.value && prevProps.value.type2 !== this.props.value.type2) {
            const event = createEvent('change', { name: 'relationDefinition', value: undefined });
            this.props.onChange(event);
        }
    }

    render() {
        const { isAdmin, type1, value } = this.props;
        const { relationDefinition, type2 } = value;
        return (
            <Container width="1024">
                <Card
                    headerColor="#384147"
                    description={
                        <div>
                            <Dropdown
                                name="type2"
                                label="Entity type"
                                placeholder="Select.."
                                onChange={this.props.onChange}
                                closeOnChange
                                value={type2}
                                clearable={false}
                                required
                                options={[
                                    { value: 'thing', label: 'Things' },
                                    { value: 'person', label: 'People' },
                                    { value: 'organisation', label: 'Organisations' },
                                    { value: 'custom', label: 'Custom Entities' },
                                    { value: 'process', label: 'Processes' },
                                    { value: 'task', label: 'Tasks' }
                                ]}
                            />
                            {type2 && (
                                <RelationDefinitionAutocomplete
                                    name="relationDefinition"
                                    label="Relationship type"
                                    value={relationDefinition}
                                    onChange={this.props.onChange}
                                    type1={type1}
                                    type2={type2}
                                    filterBy={isAdmin ? [] : [{ field: 'customEntity.active', op: '=', value: true }]}
                                    required
                                    key={relationDefinition && relationDefinition.id}
                                    clearable={false}
                                />
                            )}
                        </div>
                    }
                />
            </Container>
        );
    }
}

export default RelationshipAddFirstStep;
