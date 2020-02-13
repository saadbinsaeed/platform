/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loader from 'app/components/atoms/Loader/Loader';


/**
 * Button used to upload a file
 */
class UploadInput extends Component<Object> {

    input: ?Object;

    static propTypes: Object = {
        loading: PropTypes.bool,
        onSelect: PropTypes.func.isRequired,
        value: PropTypes.string,
    };

    static defaultProps: Object = {
        loading: false,
    };

    /**
     * @public
     */
    constructor( props: Object ) {
        super( props );

        (this: Object).onFileSelect = this.onFileSelect.bind(this);
    }

    /**
     * @override
     */
    render() {
        return this.props.loading ?
            <Loader radius="20" />
            :
            <input type="file" onChange={this.onFileSelect} ref={(c) => { this.input = c; }} />;
    }

    /**
     * This function is called every time the user selects a file.
     *
     * @param event SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onFileSelect( event: Event ) {
        event.preventDefault();
        event.stopPropagation();
        if (this.input && this.input.files && this.input.files[0] && !this.props.loading && this.props.onSelect) {
            this.props.onSelect(this.input.files[0]);
            if (this.input) this.input.value = '';
        }
    }

}

export default UploadInput;
