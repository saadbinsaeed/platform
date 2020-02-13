/* @flow */
import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mic3/platform-ui';

import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import Textarea from 'app/containers/Designer/Form/components/Textarea';
import Layout from 'app/components/molecules/Layout/Layout';
import { get } from 'app/utils/lo/lo';

class FormDesignerPreview extends PureComponent<Object, Object> {

    static propTypes = {
        designerState: PropTypes.object.isRequired,
        savePreviewState: PropTypes.func.isRequired,
    };

    contentAreaRef: Object = React.createRef();

    onChange = ({ target: { name, value } }: Object) => {
        const globalJson = get(this.props.designerState, 'preview.globalJson') || {};
        const localJson = get(this.props.designerState, 'preview.localJson') || {};
        this.props.savePreviewState({ globalJson, localJson, [name]: value });
    };

    render() {
        const { designerState, rightNavOpen, toggleRightNav } = this.props;
        const { fields } = designerState || {};
        const globalJson = get(this.props.designerState, 'preview.globalJson') || {};
        const localJson = get(this.props.designerState, 'preview.localJson') || {};
        const variables = { global: globalJson, local: localJson };
        return (
            <Layout
                showToggle
                noPadding
                content={<FormGenerator components={fields} data={variables} useDataContext={true} />}
                rightNavOpen={rightNavOpen}
                toggleRightNav={toggleRightNav}
                rightSidebar={
                    <Fragment>
                        <Typography key={0} variant="subheading">Global Data (JSON format)</Typography>
                        <Textarea key={1} parseAs={'JSON'} name="globalJson" value={globalJson} onChange={this.onChange} />
                        <Typography key={2} variant="subheading">Local Data (JSON format)</Typography>
                        <Textarea key={3} parseAs={'JSON'} name="localJson" value={localJson} onChange={this.onChange} />
                    </Fragment>
                }
            />
        );
    }
}

export default FormDesignerPreview;
