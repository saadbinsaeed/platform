import React from 'react';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
/*
    this is to fix #7233
    prime react dropdown component doesn't provide proper "required" validation
    because of "ui-helper-hidden-accessible" class on div around "hidden select"
    the way we are fixing it by applying "ui-helper-hidden-accessible" to select instead of div
    and creating an empty option with value = '' to trigger a browser validation to fail when form is submitted
    and then we adjust the position of error msg with styles (div and select)
 */
export default class PrimeDropdown extends Dropdown {

    static propTypes = {
        ...Dropdown.propTypes
    }


    _onNativeSelectChange = (event) => {
        event.preventDefault();
    };

    // this function is a copy of super.renderHiddenSelect with changes
    renderHiddenSelect = () => {
        if (this.props.autoWidth) {
            const options = this.props.options && this.props.options.map((option, i) => {
                return (<option key={this.getOptionLabel(option)} value={option.value}>
                    {this.getOptionLabel(option)}
                </option>);
            });

            return (<div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <select
                    ref={el => (this.nativeSelect = el)}
                    required={this.props.required}
                    tabIndex={-1}
                    aria-hidden={true}
                    value={(this.findOption(this.props.value) || { value: '' }).value}
                    onChange={this._onNativeSelectChange}
                    className="ui-helper-hidden-accessible"
                    style={{ left: '50%' }}
                >
                    <option key={null} value={''} disabled={true}>-- Select --</option>
                    {options}
                </select>
            </div>);
        } else {
            return null;
        }
    }
}
