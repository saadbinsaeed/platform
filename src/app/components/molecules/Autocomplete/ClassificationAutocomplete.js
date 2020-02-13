/* @flow */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { debounce } from 'app/utils/utils';
import { loadClassificationAutocomplete } from 'store/actions/classifications/classificationsActions';

import AbstractLazyAutocomplete from './AbstractLazyAutocomplete';

/**
 * Select one or more classifications using lazy loading.
 */
class ClassificationAutocomplete extends AbstractLazyAutocomplete {

    static propTypes = {
        ...AbstractLazyAutocomplete.propTypes,
        applicableOn: PropTypes.oneOf(['group', 'thing', 'person', 'organisation', 'process', 'custom']),
        onlyActive: PropTypes.bool,
    };

    static defaultProps = {
        onlyActive: false,
    };

    itemTemplate = ({ id, name }: { id: number, name: string }) => `${name || 'Name not available'} (${id || 'ID not Available'})`;

    suggest = debounce((event) => {
        const { value, loadOptions, onlyActive, applicableOn, filterBy } = this.props;
        const filters = [];
        if (event.query) {
            if (Number.isInteger(Number(event.query))) {
                filters.push({
                    or: [
                        { field: 'id', op: '=', value: Number(event.query) },
                        { field: 'name', op: 'contains', value: event.query },
                        { field: 'uri', op: 'contains', value: event.query },
                    ],
                });
            } else {
                filters.push({
                    or: [
                        { field: 'name', op: 'contains', value: event.query },
                        { field: 'uri', op: 'contains', value: event.query },
                    ],
                });
            }
        }
        if (onlyActive) {
            filters.push({ field: 'active', op: '=', value: true });
        }
        if (applicableOn) {
            filters.push({ field: 'abstract', op: '=', value: false });
            filters.push({ field: 'applicableOn', op: '=', value: applicableOn });
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
        filters.push({ field: 'abstract', op: '=', value: false });
        loadOptions({
            page: 1,
            pageSize: 50,
            filterBy: filters,
            orderBy: [{ field: 'name', direction: 'asc' }],
        });
    }, 500);
};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.classification.isLoading,
        options: state.common.autocomplete.classification.data,
    }),
    { loadOptions: loadClassificationAutocomplete },
)(ClassificationAutocomplete);
