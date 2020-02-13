/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import memoize from 'memoize-one';

import { TextField } from '@mic3/platform-ui';
import FieldSettingsSidebar from 'app/containers/Designer/Form/Tabs/FormDesignerEditor/Sidebar/FieldSettingsSidebar';
import Layout from 'app/components/molecules/Layout/Layout';
import FormDnd from 'app/containers/Designer/Form/Tabs/FormDesignerEditor/FormDnd/FormDnd';
import Forest from 'app/utils/dataStructure/Forest';
import { get } from 'app/utils/lo/lo';
import { debounce, isEmpty } from 'app/utils/utils';
import { getFieldSettings } from 'app/utils/designer/form/fieldSettingsUtils';
import { fillProperties } from 'app/utils/designer/form/fieldUtils';
import statefulInput from 'app/utils/hoc/statefulInput';

const defaultSelectedElment = null;

const SearchField = statefulInput(TextField);

class FormDesignerEditor extends PureComponent<Object, Object> {

    static propTypes = {
        formDesignerState: PropTypes.object.isRequired,
        saveDesignerState: PropTypes.func.isRequired,
        errors: PropTypes.object,
    };

    state = {
        selectedElement: defaultSelectedElment,
    };

    contentAreaRef: Object = React.createRef();

    move = (element: Object, parentUuid: string, index: number) => {
        this.props.saveDesignerState({ fields: this.forest().move(element, parentUuid, index).nodes });
    }

    add = (element: Object, parentUuid: string, index: number) => {
        this.props.saveDesignerState({ fields: this.forest().add(element, parentUuid, index).nodes });
    }

    remove = (element: Object) => {
        const removeElement = () => this.props.saveDesignerState({ fields: this.forest().remove(element).nodes });
        if (element.uuid === get(this.state, 'selectedElement.uuid')) {
            this.setState({ selectedElement: defaultSelectedElment }, removeElement);
        } else {
            removeElement();
        }
    }

    updateSelectedElementSettings = (settingsValues: Object) => {
        if (!this.state.selectedElement) {
            return;
        }
        const selectedElement = { ...this.state.selectedElement, ...settingsValues };
        this.setState(
            { selectedElement },
            debounce(() => this.props.saveDesignerState({ fields: this.forest().update(selectedElement).nodes }), 300)
        );
    }

    _forest = memoize(elements => new Forest(elements));

    forest = () => this._forest(get(this.props.formDesignerState, 'fields'));

    onSelectElement = (selectedElement: ?Object) => this.setState(
        { selectedElement },
        () => {
            if (this.state.selectedElement) {
                this.props.toggleRightNav(true); // opens the props sidebar
            } else {
                this.props.toggleRightNav(); // opens the props sidebar
            }
        }
    );

    buildSettingsValues = memoize((selectedElement) => {
        const { type, children, settings, defaults, uuid, ...variables } = selectedElement || {};
        return isEmpty(variables) ? (defaults || {}) : variables;
    });

    getSettingsValues = memoize((selectedElement) => {
        if (!selectedElement) {
            return null;
        }
        const properties = fillProperties(selectedElement.properties, selectedElement.defaults);
        const settings = selectedElement.settings;
        return { properties, settings };

    })

    render() {
        // const thumbnail = <img src={`https://affectli.dev.mi-c3.com/activiti-app/app/rest/models/${id}/thumbnail?now=${Date.now()}`} alt="preview" />
        const { selectedElement } = this.state;
        const { errors, leftNavOpen, rightNavOpen, toggleLeftNav, toggleRightNav } = this.props;
        return (
            <DragDropContextProvider backend={HTML5Backend}>
                <FormDnd
                    elements={this.forest().nodes}
                    uuid={this.forest().uuid}
                    add={this.add}
                    move={this.move}
                    remove={this.remove}
                    onSelectElement={this.onSelectElement}
                    selectedElement={selectedElement}
                    errors={errors}
                    renderContent={
                        ({ dropArea, draggableElements, searchDraggableElement }) => (
                            <Layout
                                showToggle
                                noPadding
                                leftNavOpen={leftNavOpen}
                                toggleLeftNav={toggleLeftNav}
                                rightNavOpen={rightNavOpen}
                                toggleRightNav={toggleRightNav}
                                leftSidebar={
                                    <>
                                        <SearchField name="search" variant="standard" label="search field" onChange={searchDraggableElement}/>
                                        {draggableElements}
                                    </>
                                }
                                content={dropArea}
                                rightSidebar={(
                                    <FieldSettingsSidebar
                                        settingsDefinition={selectedElement && getFieldSettings(selectedElement.type)}
                                        settingsValues={this.getSettingsValues(selectedElement)}
                                        updateSettings={this.updateSelectedElementSettings}
                                    />
                                )}
                            />
                        )
                    }
                />
            </DragDropContextProvider>
        );
    }
}

export default FormDesignerEditor;
