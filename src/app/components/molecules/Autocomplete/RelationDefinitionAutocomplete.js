/* @flow */
import { connect } from 'react-redux';

import { debounce } from 'app/utils/utils';
import { loadRelationDefinitionAutocomplete } from 'store/actions/entities/relationshipsActions';

import AbstractLazyAutocomplete from './AbstractLazyAutocomplete';
import { allTypesProps } from 'app/utils/propTypes/common';
import memoize from 'memoize-one';

/**
 * Select one or more relations' definitions using lazy loading.
 */
class RelationDefinitionAutocomplete extends AbstractLazyAutocomplete {

    static propTypes = {
        ...AbstractLazyAutocomplete.propTypes,
        type1: allTypesProps.isRequired,
        type2: allTypesProps.isRequired,
    };

    itemTemplate = ({ id, name }) => `${name || 'Relation not available'}`;

    normalizeOptions = memoize((options) => {
        const { type1 } = this.props;
        return (options || [])
            .reduce((opts, option) => {
                const { entityType1, entityType2 } = option;
                if (entityType1 === entityType2) {
                    return [...opts, { ...option, name: option.relation }, { ...option, name: option.reverseRelation, isReverse: true }];
                }
                return [...opts, { ...option, name: type1 === entityType1 ? option.relation : option.reverseRelation }];
            }, [])
            .filter((item, idx, arr) => {
                return idx === arr.findIndex(i => i.name === item.name && i.id === item.id);
            });
    });

    suggest = debounce((event) => {
        const { value, loadOptions, type1, type2, filterBy } = this.props;
        const filters = [
            {
                or: [
                    [
                        { field: 'entityType1', op: '=', value: type1 },
                        { field: 'entityType2', op: '=', value: type2 },
                    ],
                    [
                        { field: 'entityType2', op: '=', value: type1 },
                        { field: 'entityType1', op: '=', value: type2 },
                    ],
                ],
            },
        ];
        if (event.query) {
            if (Number.isInteger(Number(event.query))) {
                filters.push({
                    or: [
                        { field: 'id', op: '=', value: Number(event.query) },
                        { field: 'relation', op: 'contains', value: event.query },
                        { field: 'reverseRelation', op: 'contains', value: event.query },
                    ],
                });
            } else {
                filters.push({
                    or: [
                        { field: 'relation', op: 'contains', value: event.query },
                        { field: 'reverseRelation', op: 'contains', value: event.query },
                    ],
                });
            }
        }
        if (filterBy && filterBy.length) {
            filters.push(...filterBy);
        }
        if (value) {
            const excludes = Array.isArray(value) ? value : [value];
            filters.push(
                ...excludes
                    .filter(({ id }) => Number.isInteger(id))
                    .map(({ id }) => ({ field: 'id', op: '<>', value: id })),
            );
        }
        loadOptions({
            page: 1,
            pageSize: 50,
            filterBy: filters,
            orderBy: [{ field: 'relation', direction: 'asc' }, { field: 'reverseRelation', direction: 'asc' }],
        });
    }, 500);
}

export default connect(
    state => ({
        isLoading: state.common.autocomplete.relationDefinition.isLoading,
        options: state.common.autocomplete.relationDefinition.data,
    }),
    { loadOptions: loadRelationDefinitionAutocomplete },
)(RelationDefinitionAutocomplete);
