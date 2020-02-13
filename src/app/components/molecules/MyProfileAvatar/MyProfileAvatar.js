/* @flow */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Avatar from 'app/components/molecules/Avatar/Avatar';
import Popover from 'app/components/molecules/Popover/Popover';
import MyProfilePopoverContent from './MyProfilePopoverContent';

/**
 * Renders the logged user avatar.
 */
class MyProfileAvatar extends PureComponent<Object, Object> {

    static propTypes = {
        profile: PropTypes.object,
    };

    /**
     * @override
     */
    render() {
        const { profile } = this.props;
        return (
            <div>
                <Popover placement="top right" width="260px" content={<MyProfilePopoverContent />}>
                    <Avatar src={profile.image} size="lg" name={profile.name} />
                </Popover>
            </div>
        );
    }
}

export default connect(
    state => ({ profile: state.user.profile }),
)(MyProfileAvatar);
