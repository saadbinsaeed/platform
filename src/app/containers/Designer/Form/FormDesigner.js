/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withTheme } from 'styled-components';
import memoize from 'memoize-one';

import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import FormDesignerEditor from 'app/containers/Designer/Form/Tabs/FormDesignerEditor/FormDesignerEditor';
import FormDesignerPreview from 'app/containers/Designer/Form/Tabs/FormDesignerPreview/FormDesignerPreview';
import Loader from 'app/components/atoms/Loader/Loader';
import PageTemplate from 'app/components/templates/PageTemplate';
import TabRow from 'app/components/molecules/Tabs/TabRow';
import TabItem from 'app/components/molecules/Tabs/TabItem';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import { saveComponentState } from 'store/actions/component/componentActions';
import { loadFormDefinition, updateFormDefinition } from 'store/actions/designer/designerActions';
import { get } from 'app/utils/lo/lo';
// import { domToImage } from 'app/utils/html/htmlUtils.js';
import { getArray, getStr } from 'app/utils/utils';
import { normalizeFields, denormalizeFields } from 'app/utils/designer/form/formUtils';
import FormValidator from 'app/utils/validator/FormValidator';
import { getFieldSettings } from 'app/utils/designer/form/fieldSettingsUtils';

const affectliLogoBase64 = 'data:image/png;base64,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';

class FormDesigner extends PureComponent<Object, Object> {

    static propTypes = {
        match: PropTypes.object.isRequired,
        form: PropTypes.object,
        variables: PropTypes.object,
        formDesignerState: PropTypes.object,
        loadFormDefinition: PropTypes.func.isRequired,
        updateFormDefinition: PropTypes.func.isRequired,
        saveComponentState: PropTypes.func.isRequired,
    };

    contentAreaRef: Object;
    state = {
        isSaving: false,
        editorRightNavOpen: false,
        editorLeftNavOpen: true,
        previewRightNavOpen: true,
    };

    constructor(props) {
        super(props);
        const id = get(props, 'match.params.id');
        id && props.loadFormDefinition(id);
        this.contentAreaRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        const prevId = get(prevProps, 'match.params.id');
        const id = get(this.props, 'match.params.id');
        if (id !== prevId) {
            id && this.props.loadFormDefinition(id);
        }
        const { form } = this.props;
        if (form && form !== prevProps.form) {
            const { id, name, version } = form;
            const fields = normalizeFields(getArray(form, 'definition.fields') || []);
            this.props.saveComponentState('FormDesigner', { id, name, version, fields });
        }
    }

    toggleEditorLeftNav = (open: ?boolean) => this.setState({ editorLeftNavOpen: open || !this.state.editorLeftNavOpen });
    toggleEditorRightNav = (open: ?boolean) => this.setState({ editorRightNavOpen: open || !this.state.editorRightNavOpen });
    togglePreviewRightNav = (open: ?boolean) => this.setState({ previewRightNavOpen: open || !this.state.previewRightNavOpen });

    onSave = () => {
        this.setState({ isSaving: true }, () => {
            const { match, formDesignerState: { fields } } = this.props;
            const id = getStr(match, 'params.id') || '';
            // const backgroundColor = this.props.theme.layout.content.background;
            // domToImage(this.contentAreaRef.current, 'image/png', { backgroundColor, maxWidth: 300 })
            //     .then((formImageBase64) => {
            //         this.props.updateFormDefinition({
            //             id,
            //             fields: denormalizeFields(fields),
            //             formImageBase64,
            //         }, false, false).finally(() => this.setState({ isSaving: false }));
            //     });
            this.props.updateFormDefinition({
                id,
                fields: denormalizeFields(fields),
                //TODO ??? exampleData: { "test": true },
                formImageBase64: affectliLogoBase64,
            }, false, false).finally(() => this.setState({ isSaving: false }));
        });
    };

    saveDesignerState = (stateUpdate: Object) => {
        this.props.saveComponentState('FormDesigner', stateUpdate);
    };

    savePreviewState = (previewState: Object) => {
        this.props.saveComponentState('FormDesigner', { preview: previewState });
    };

    validateField(errorsMap, field) {
        const { uuid, type, properties, children } = field;
        const validator = new FormValidator(getFieldSettings(type));
        const valid = validator.isValid({ properties });
        if (!valid) {
            errorsMap[uuid] = validator.getMessages();
        }
        if (children) {
            children.forEach(child => this.validateField(errorsMap, child));
        }
    }

    validate = memoize((fields: ?Array<Object>) => {
        const errors = {};
        (fields || []).forEach(field => this.validateField(errors, field));
        return Object.keys(errors).length === 0 ? null : errors;
    });

    render() {
        const { form, isLoading, formDesignerState } = this.props;
        const { isSaving, editorLeftNavOpen, editorRightNavOpen, previewRightNavOpen } = this.state;
        const { fields } = formDesignerState || {};
        const { name, version } = form || {};
        const id = getStr(this.props, 'match.params.id') || '';
        const errors = this.validate(fields);
        // const thumbnail =
        // <img src={`/activiti-app/app/rest/models/${id}/thumbnail?now=${Date.now()}`} alt="preview" />
        let content = <Loader absolute backdrop />;
        if (!isLoading) {
            if (!form) {
                content = 'Ooooooooops: form not found :(';
            } else if (fields) {
                content = (
                    <Fragment>
                        {isSaving && <Loader absolute backdrop />}
                        <TabRow>
                            <TabItem label="Editor" to={`/designer/form/${id}/editor`} />
                            <TabItem label="Preview" to={`/designer/form/${id}/preview`} />
                        </TabRow>
                        <Switch>
                            <Route path={`/designer/form/:id`} exact render={() =>
                                <Redirect to={`/designer/form/${id}/editor`}/>}
                            />
                            <Route path={`/designer/form/:id/editor`} render={() =>
                                <FormDesignerEditor
                                    saveDesignerState={this.saveDesignerState}
                                    formDesignerState={formDesignerState}
                                    leftNavOpen={editorLeftNavOpen}
                                    toggleLeftNav={this.toggleEditorLeftNav}
                                    rightNavOpen={editorRightNavOpen}
                                    toggleRightNav={this.toggleEditorRightNav}
                                    errors={errors}
                                />
                            }
                            />
                            <Route path={`/designer/form/:id/preview`} render={() =>
                                <FormDesignerPreview
                                    designerState={formDesignerState}
                                    savePreviewState={this.savePreviewState}
                                    rightNavOpen={previewRightNavOpen}
                                    toggleRightNav={this.togglePreviewRightNav}
                                />
                            }
                            />
                        </Switch>
                    </Fragment>
                );
            }
        }
        return (
            <PageTemplate title={name} subTitle={`#${id}${ version && `, v. ${version}` }`}>
                <ContentArea innerRef={this.contentAreaRef} >
                    {content}
                </ContentArea>
                <FooterBar>
                    <div>
                        <TextIcon disabled={!!errors} icon="content-save" label="Save" color={'primary'} onClick={this.onSave} />
                    </div>
                </FooterBar>
            </PageTemplate>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.designer.form.isLoading,
        form: state.designer.form.data,
        formDesignerState: state.component.state.FormDesigner,
    }),
    {
        loadFormDefinition,
        updateFormDefinition,
        saveComponentState,
    }
)(withTheme(FormDesigner));
