/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { sendTaskMessage } from 'store/actions/abox/taskActions';
import { get } from 'app/utils/lo/lo';
import Icon from 'app/components/atoms/Icon/Icon';
import Text from 'app/components/atoms/Text/Text';
import Flex from 'app/components/atoms/Flex/Flex';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import PageTemplate from 'app/components/templates/PageTemplate';
import Loader from 'app/components/atoms/Loader/Loader';

const StyledFlex = styled(Flex)`
    flex-direction: column;
    justify-content: center;
    text-align: center;
    height: 100%;
    color: #777777;
`;

const StyledIcon = styled(Icon)`
    &.Icon:before {
        font-size: 6rem !important;
        color: #777777;
    }
`;

const StyledText = styled(Text)`
    font-size: 1.2rem;
`;

/**
 *
 */
class ActivityActions extends PureComponent<Object, Object> {
    static propTypes = {
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string, type: PropTypes.string }),
        sendTaskMessage: PropTypes.func.isRequired
    };

    /**
     * constructor - description
     *
     * @return {type}  description
     */
    constructor(props: Object) {
        super(props);
        const id = String(get(props, 'match.params.id'));
        const type = String(get(props, 'match.params.type'));
        this.state = {
            isLoading: true
        };
        if (id && type && props.sendTaskMessage) {
            props.sendTaskMessage(`activiti-app/app/rest/message/${type}/task/${id}`).then((response: Object) => {
                this.setState({ isLoading: !this.state.isLoading });
            });
        }
    }

    /**
     * render - description
     *
     * @return {type}  description
     */
    render() {
        const { errorOptions = {} } = this.props;
        const id = String(get(this.props, 'match.params.id'));

        if (this.state.isLoading) return <Loader absolute backdrop />;
        return (
            <PageTemplate title="Task" subTitle={id} overflowHidden>
                <ContentArea>
                    <StyledFlex grow>
                        <StyledIcon name={errorOptions.isError ? 'alert-circle-outline' : 'check'} />
                        <StyledText>
                            {errorOptions.isError ? 'Error, couldn\'t perform' : 'Successfully performed'} action on task{' '}
                            <Link to={`/abox/task/${id}`}>{id}</Link>
                        </StyledText>
                        {errorOptions.detail ? <StyledText>{errorOptions.detail}</StyledText> : null}
                    </StyledFlex>
                </ContentArea>
            </PageTemplate>
        );
    }
}

export default connect(
    state => ({ errorOptions: state.app.errorOptions }),
    {
        sendTaskMessage
    }
)(ActivityActions);
