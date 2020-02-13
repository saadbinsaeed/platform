/* @flow */

// $FlowFixMe
import React, { Fragment, PureComponent, memo } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import styled from 'styled-components';

import { IconButton, ListItemText, List, ListItem, ListItemSecondaryAction, MdiIcon } from '@mic3/platform-ui';
import DraggableElement from 'app/containers/Designer/Form/Tabs/FormDesignerEditor/FormDnd/DraggableElement';
import RowTarget, { EmptyRowTarget } from 'app/containers/Designer/Form/Tabs/FormDesignerEditor/FormDnd/RowTarget';
import { fillProperties, getElementsDefinitions, getFieldByType, addExtraSpace } from 'app/utils/designer/form/fieldUtils';

const OverlayWrapperStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    transition: .2s;
    background: rgba(0,0,0,0.3);
`;
const DropHereStyled = styled.div`
    height: 128px;
    border: 2px dashed white;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const OverlayWrapperLabelStyled = styled.div`
    position: absolute;
    top: 10px;
    right: 0;
    z-index: 1;
    transition: .2s;
    background: ${({ isSelected }) => isSelected ? '#88B342' : '#1a6eaf'};
    padding: 0 10px 0;
    border-radius: 2px 0 0 2px;
`;
const Error = memo(({ children }) => <div style={{ fontSize: '0.6em', color: '#C22525' }}>{children}</div>);

/*
 * Form DnD Context
 */
class FormDnd extends PureComponent<Object, Object> {

    static propTypes = {
        renderContent: PropTypes.func.isRequired,
        elements: PropTypes.arrayOf(PropTypes.object),
        selectedElement: PropTypes.object,
        uuid: PropTypes.string.isRequired,
        add: PropTypes.func.isRequired,
        move: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        onSelectElement: PropTypes.func.isRequired,
    };

    state: Object;

    constructor(props: Object) {
        super(props);
        this.state = {
            elements: (this.props.elements || []).filter(({type}) => type),
            draggableElements: this.renderDraggableElements(),
        };
    }

    searchDraggableElement = (event: Object) => {
        this.setState({
            draggableElements: this.renderDraggableElements(event.target.value),
        });;
    }

    renderDraggableElements = (search: string = '') => getElementsDefinitions()
        .filter(({ type }) => search ? type.includes(search) : true)
        .map((element, i) => {
            const { type, defaults } = element;
            const properties = { ...defaults };
            switch (type) {
                case 'group':
                    properties.style = { height: '40px' };
                    break;
                case 'panel':
                    properties.style = { margin: '20px' };
                    properties.header = 'Panel';
                    break;
                case 'outcome':
                    properties.style = { margin: '20px 0 0 20px' };
                    properties.label = 'Outcome';
                    break;
                case 'label':
                    properties.style = { margin: '20px 0 0 20px' };
                    properties.text = 'Label';
                    break;
                default:

            }
            return (
                <DraggableElement style={{ margin: '.7rem 0', padding: '.5rem' }} key={i} element={element}>
                    {addExtraSpace(type)}
                    {getFieldByType(type, properties)}
                    <OverlayWrapperStyled />
                    <OverlayWrapperLabelStyled>#{element.type}</OverlayWrapperLabelStyled>
                </DraggableElement>
            );
        });

    componentDidUpdate(prevProps: Object) {
        if (prevProps.elements !== this.props.elements) {
            this.setState({ elements: (this.props.elements || []).filter(({type}) => type) });
        }
    }

    /**
     * Called by RowTarget when the drop ends.
     */
    onDrop = (props: Object, monitor: Object, component: any) => {
        const { index } = props;
        const item = { ...monitor.getItem() };
        if (item.uuid) {
            this.props.move(item, this.props.uuid, index);
        } else {
            this.props.add(item, this.props.uuid, index);
        }
    }

    deleteElement = (event: Object) => {
        const index = Number(event.target.dataset.index);
        this.props.remove(this.state.elements[index]);
    }

    onSelectElement = (index: number) => {
        const { elements } = this.state;
        this.props.onSelectElement(elements[index]);
    }

    buildDropArea = memoize((elements, selectedElement, errors, isRoot) => {
        if (elements.length === 0) {
            return (
                <RowTarget key={'empty'} index={elements.length} onDrop={this.onDrop}>
                    <DropHereStyled> Drop here </DropHereStyled>
                </RowTarget>
            );
        }
        const listItems = [...elements.map((element, i) => {
            const { uuid, type, properties, defaults } = element;
            const { name, header } = properties || {};
            let label = name || header;
            label = label ? `${label} (#${type})` : `#${type}`;

            const isSelected = selectedElement && (selectedElement.uuid === uuid);
            const errorMessages = ((errors && errors[element.uuid]) || []);

            const target = (
                <Fragment>
                    {addExtraSpace(type)}
                    {getFieldByType(type, fillProperties({ ...properties, key: i }, defaults))}
                    <OverlayWrapperStyled  />
                    <OverlayWrapperLabelStyled isSelected={isSelected}>{label}</OverlayWrapperLabelStyled>
                    {errorMessages.map((message, i) => <Error key={i}>{message}</Error>)}
                </Fragment>
            );

            let childrenElements = null;
            if (element.type === 'group' || element.type === 'panel') {
                childrenElements = (
                    <FormDnd
                        uuid={element.uuid}
                        add={this.props.add}
                        move={this.props.move}
                        remove={this.props.remove}
                        elements={element.children}
                        selectedElement={selectedElement}
                        renderContent={({ dropArea }) => dropArea}
                        onSelectElement={this.props.onSelectElement}
                        errors={errors}
                        root={false}
                    />
                );
                if (element.children && element.children.length > 0) {
                    childrenElements = (
                        <div style={{ border: '2px dashed white' }}>
                            {childrenElements}
                        </div>
                    );
                }
            }

            return (
                <ListItem key={i} selected={isSelected}>
                    <ListItemText
                        primary={
                            <Fragment>
                                <DraggableElement key={i} index={i} element={element}>
                                    <RowTarget
                                        index={i}
                                        onDrop={this.onDrop}
                                        label={label}
                                        element={element}
                                        onClick={() => this.onSelectElement(i)}
                                    >
                                        {target}
                                    </RowTarget>
                                </DraggableElement>
                                { childrenElements}
                            </Fragment>
                        }
                    />
                    {
                        !element.toRemove &&
                        <ListItemSecondaryAction>
                            <IconButton aria-label="Delete">
                                <MdiIcon data-index={i} name="close-circle" size={24} onClick={this.deleteElement} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    }
                </ListItem>
            );
        }), <EmptyRowTarget key={'-1'} index={elements.length} onDrop={this.onDrop} />];

        return <List>{listItems}</List>;
    });

    render() {
        const { selectedElement, errors, root } = this.props;
        const { elements } = this.state;
        return this.props.renderContent({
            dropArea: this.buildDropArea(elements, selectedElement, errors, root),
            draggableElements: this.state.draggableElements,
            searchDraggableElement: this.searchDraggableElement
        });
    }
};

export default FormDnd;
