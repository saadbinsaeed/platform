/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import { loadDirectories } from 'store/actions/common/DirectoriesActions';
import Select from 'app/components/molecules/Autocomplete/Select';
import Loader from 'app/components/atoms/Loader/Loader';
import { deepEquals } from 'app/utils/utils';
import { sortBy } from 'app/utils/lo/lo';

/**
 * Dropdown for a list of directories.
 */
class DirectoriesDropdown extends Component<Object, Object> {

    static _directoriesCache: Map<string,any>;

    static get directoriesCache() {
        if (!this._directoriesCache) {
            this._directoriesCache = new Map();
        }
        return this._directoriesCache;
    };

    static clearFilters() { this.directoriesCache.clear(); };

    static timeout = null;

    static setTimeout() {
        this.timeout = setTimeout(() => {
            this.clearFilters();
            this.timeout = null;
        }, 1000 * 60 * 10);
    }

    static propTypes = {
        onChange: PropTypes.func,
        loadDirectories: PropTypes.func,
        value: PropTypes.any,
        valueField: PropTypes.any,
        directoryType: PropTypes.string.isRequired,
        name: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        directories: PropTypes.object,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        valueField: 'label',
    };

    /**
     *
     * @param props
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            data: this.constructor.directoriesCache.get(this.props.directoryType),
        };
    }

    /**
     *
     */
    componentDidMount() {
        if (!this.constructor.timeout) {
            this.constructor.setTimeout();
        }
        if (!this.constructor.directoriesCache.has(`loading(${this.props.directoryType})`)) {
            this.constructor.directoriesCache.set(`loading(${this.props.directoryType})`, true);
            this.props.loadDirectories(this.props.directoryType);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.directoryType !== this.props.directoryType) {
            this.props.loadDirectories(this.props.directoryType);
        }
        if (!deepEquals(prevProps.directories, this.props.directories)) {
            const data = this.props.directories[this.props.directoryType];
            if (data) {
                this.constructor.directoriesCache.set(this.props.directoryType, data);
                this.constructor.directoriesCache.delete(`loading(${this.props.directoryType})`);
                this.setState({ data });
            }
        }
    }

    normalizeOptions = memoize((data: Array<Object> = []) => sortBy(data.map(item => ({
        value: item[this.props.valueField],
        label: item.label,
    })), 'label'));

    /**
     * @override
     * @returns {XML}
     */
    render(): Object {
        const { valueField, value, placeholder, directoryType, directories: unused, onChange, loadDirectories, ...restProps } = this.props; // eslint-disable-line no-unused-vars
        const { data } = this.state;
        const options = this.normalizeOptions(data);
        if (options.length === 0 && this.constructor.directoriesCache.has(`loading(${this.props.directoryType})`)) {
            return (<Loader radius="20" />);
        }
        return (
            <Select
                {...restProps}
                value={value}
                onChange={onChange}
                placeholder={placeholder || 'Select a country'}
                options={options}
                valueField={valueField}
            />
        );
    }
}

export default connect(
    state => ({
        directories: state.entities.directories,
    }), {
        loadDirectories,
    })(DirectoriesDropdown);
