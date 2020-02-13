// @flow
import { Editor as PrimeEditor } from 'primereact/components/editor/Editor';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import memoize from 'memoize-one';

const filterMap = {
    color: /color:(.*?);/g,
    background: /background:(.*?);/g,
    backgroundColor: /background-color:(.*?);/g,
};

/**
 * Our checkbox component
 */
class Editor extends PureComponent<Object, Object> {

    static propTypes = {
        headerTemplate: PropTypes.object,
        style: PropTypes.object,
        value: PropTypes.string,
        filters: PropTypes.array,
    }

    static defaultProps = {
        filters: [],
    }

    onTextChange = (event: Object) => {
        const { onTextChange, filters } = this.props;
        const filteredHtml = filters.reduce((html, filter) => {
            if(filterMap[filter])
                html = html.replace(filterMap[filter], '');
            return html;
        }, event.htmlValue || '');
        onTextChange({
            ...event,
            htmlValue: filteredHtml,
        });
    }

    renderDefaultHeader = memoize(() => (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
            <button className="ql-strike" aria-label="Strike"></button>
            <button className="ql-list" value="ordered" aria-label="Ordered list"></button>
            <button className="ql-list" value="bullet" aria-label="Bullet list"></button>
            <button className="ql-link" aria-label="Insert Link"></button>
        </span>
    ));

    render() {
        const defaultHeader = this.renderDefaultHeader();
        const { headerTemplate, style, value } = this.props;
        return (
            <div>
                <PrimeEditor
                    headerTemplate={headerTemplate || defaultHeader}
                    style={style || { height:'100px', color: 'black' }}
                    value={value}
                    onTextChange={this.onTextChange}
                />
            </div>
        );
    }
}

export default Editor;
