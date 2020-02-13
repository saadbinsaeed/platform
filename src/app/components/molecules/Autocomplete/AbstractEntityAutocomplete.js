/* @flow */

import { debounce } from 'app/utils/utils';
import AbstractLazyAutocomplete from './AbstractLazyAutocomplete';

/**
 * Select one or more entities using lazy loading.
 */
class AbstractEntityAutocomplete extends AbstractLazyAutocomplete {

    static propTypes = {
        ...AbstractLazyAutocomplete.propTypes,
    }

    itemTemplate = ({ id, name }: { id: number, name: string }) => `${name || 'Name not available'} (${id || 'ID not Available'})`;

    suggest = debounce((event) => {
        const { value, loadOptions, filterBy, orderBy = [{ field: 'name', direction: 'asc' }] } = this.props;
        const filters = [];
        if (event.query) {
            if (Number.isInteger(Number(event.query))) {
                filters.push({ or: [
                    { field: 'id', op: '=', value: Number(event.query) },
                    { field: 'name', op: 'contains', value: event.query },
                ] });
            } else {
                filters.push({ field: 'name', op: 'contains', value: event.query });
            }
        }
        if (filterBy && filterBy.length) filters.push(...filterBy);
        if (value) {
            const excludes = Array.isArray(value) ? value : [value];
            filters.push(
                ...excludes
                    .filter(({ id }) => Number.isInteger(id))
                    .map(({ id }) => ({ field: 'id', op: '<>', value: id }))
            );
        }
        loadOptions({
            page: 1,
            pageSize: 50,
            filterBy: filters,
            orderBy: orderBy,
        });
    }, 500);
};

export default AbstractEntityAutocomplete;
