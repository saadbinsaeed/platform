/* @flow */

import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';
import { Button } from 'primereact/components/button/Button';
import { OverlayPanel } from 'primereact/components/overlaypanel/OverlayPanel';
import { InputText } from 'primereact/components/inputtext/InputText';

import Icon from 'app/components/atoms/Icon/Icon';
import { get } from 'app/utils/lo/lo';


const Option = styled.div`
&:hover {
    background: ${({theme}) => theme.base.hover.background};
}
`;

const OptionIcon = styled(Icon)`
    padding: 0 0.6rem 0 0;
`;


/**
 *
 */
export default class TextFilter extends PureComponent<Object> {

    onClick: Function;
    overlayPanel: ?Object;

    iconMap = {
        startsWith: 'mdi mdi-arrow-right',
        '=': 'mdi mdi-equal',
        contains: 'mdi mdi-tilde',
    }

    options = [
        { label: 'Starts With', icon: this.iconMap['startsWith'], value: 'startsWith'  },
        { label: 'Equals', icon: this.iconMap['='], value: '=' },
        { label: 'Similar', icon: this.iconMap['contains'], value: 'contains' },
    ];

    togglePanel = (event: Object) => {
        this.overlayPanel && this.overlayPanel.toggle(event);
    }

    onSelect = (event: Object, selectedOption: string) => {
        const option = this.props.option || 'startsWith';
        const { value, onChange } = this.props;
        if (option !== selectedOption) {
            onChange && onChange({ option: selectedOption, value });
        }
    }

    onChange = (event: Object) => {
        const option = this.props.option || 'startsWith';
        const { value, onChange } = this.props;
        const newValue = get(event, 'target.value');
        if (value !== newValue) {
            onChange && onChange({ option, value: newValue });
        }
    };

    setPanelRef = (element: ?Object) => {
        this.overlayPanel = element;
    };

    render() {
        const optionValue = this.props.option || 'startsWith';
        const value = this.props.value;
        return (
            <div className="ui-inputgroup">
                {!this.props.filterOptionsDisabled && (<Fragment>
                    <Button onClick={this.togglePanel} icon={this.iconMap[optionValue]} />
                    <OverlayPanel ref={this.setPanelRef} appendTo={this.props.appendTo}>
                        {this.options.map(({ label, icon, value }) => (
                            <Option onClick={event => this.onSelect(event, value)} key={value}><OptionIcon name={icon} size="sm" />{label}</Option>
                        ))}
                    </OverlayPanel>
                </Fragment>)}
                <InputText onChange={this.onChange} value={value} placeholder="Keyword" style={{width: '100%'}} />
            </div>
        );
    }
};
