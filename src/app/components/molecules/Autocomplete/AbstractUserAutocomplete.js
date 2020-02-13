/* @flow */

import { debounce } from 'app/utils/utils';
import AbstractLazyAutocomplete from './AbstractLazyAutocomplete';

/**
 * Select one or more users using lazy loading.
 */
class AbstractUserAutocomplete extends AbstractLazyAutocomplete {

    static propTypes = {
        ...AbstractLazyAutocomplete.propTypes,
    }

    itemTemplate = ({ login, name }: Object) => `${name || 'Name not available'} (${login || 'Login not available'})`;

    loadOptions(options: Object) {
        return this.props.loadOptions(options);
    }

    suggest = debounce((event) => {
        const { value, filterBy } = this.props;
        const filters = [{ or: [
            { field: 'name', op: 'contains', value: event.query },
            { field: 'login', op: 'contains', value: event.query },
        ] }];
        if (filterBy && filterBy.length) filters.push(...filterBy);
        if (value) {
            const excludes = Array.isArray(value) ? value : [value];
            filters.push(
                ...excludes
                    .filter(({ id }) => Number.isInteger(id))
                    .map(({ id }) => ({ field: 'id', op: '<>', value: id }))
            );
        }
        this.loadOptions({
            page: 1,
            pageSize: 50,
            filterBy: filters,
            orderBy: [ { field: 'name', direction: 'asc' } ],
        });
    }, 500);
};

export default AbstractUserAutocomplete;
