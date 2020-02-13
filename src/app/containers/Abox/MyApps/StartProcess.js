/* @flow */

import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import memoize from 'memoize-one';

import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import PageTemplate from 'app/components/templates/PageTemplate';
import Loader from 'app/components/atoms/Loader/Loader';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import history from 'store/History';
import { loadProcessDefinition } from 'store/actions/abox/myAppsActions';
import { get } from 'app/utils/lo/lo';
import { getStr, getNum } from 'app/utils/utils';
import { normalizeFields } from 'app/utils/designer/form/formUtils';

const FooterBarStyled = styled(FooterBar)`
    position: fixed;
    bottom: 0;
    z-index: 9;
    left: 0;
    right: 0;
`;
/**
 * Renders the view to display the classification.
 */
class StartProcess extends PureComponent<Object, Object> {

    static propTypes = {
        loadStartedProcessDetails: PropTypes.func,
        loadProcessDefinition: PropTypes.func,
        isLoadingDefinition: PropTypes.bool,
        isLoadingProcess: PropTypes.bool,
        definition: PropTypes.object,
    };
    definitionKey: string;
    appId: ?number;

    constructor(props) {
        super(props);
        this.definitionKey = getStr(props, 'match.params.definitionKey') || '';
        this.appId = getNum(props, 'match.params.appId');
        if (this.appId && this.definitionKey) {
            this.props.loadProcessDefinition(this.appId, this.definitionKey);
        }
    }

    goToMyApps = () => {
        history.push(`/abox/processes-new`);
    }

    normalizeFormDefinitionFields = memoize(fields => normalizeFields(fields));

    /**
     * @override
     */
    render() {
        const { isLoadingDefinition, definition } = this.props;
        const version = get(definition, '_startFormDefinition.definition.version');
        let components;
        if (version) {
            components = this.normalizeFormDefinitionFields(get(definition, '_startFormDefinition.definition.fields'));
        }
        return (
            <PageTemplate
                title={'Start Process'}
                subTitle={get(definition, 'deployedModel.name', 'No Name')}
            >
                {
                    isLoadingDefinition
                        ? <Loader absolute />
                        : (
                            <Fragment>
                                {version && <ContentArea><FormGenerator components={components} /></ContentArea>}
                                <FooterBarStyled>
                                    <TextIcon icon="close" label="Close" onClick={this.goToMyApps} />
                                </FooterBarStyled>
                            </Fragment>
                        )
                }
            </PageTemplate>
        );
    }
}

export default connect(
    state => ({
        isLoadingDefinition: state.abox.processDefinition.isLoading,
        definition: get(state.abox.processDefinition, 'data[0]'),
    }), { loadProcessDefinition }
)(StartProcess);
