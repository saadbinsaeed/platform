// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import Avatar from 'app/components/molecules/Avatar/Avatar';

import { get } from 'app/utils/lo/lo';

const GroupedAvatarStyle = styled.div`
  cursor: pointer;
  display: inline-block;
  border-radius: 500rem;
  position: relative;
  ${({ width }) => `width: ${width}px; max-width: ${width}px`};
  ${({ height }) => `height: ${height}px; max-height: ${height}px`};
  overflow: hidden;
  line-height: 0;
`;

const GroupWrapper = styled.div`
  display: inline-block;
  position: absolute;
  background: white;
  ${({ count, size, index }) => {
        const i = index + 1;
        if (count === 1 && i === 1) {
            return `left: 0; right: 0;`;
        }
        if (count === 2 && i === 1) {
            return `left: -${size}px;`;
        }
        if (count === 2 && i === 2) {
            return `right: -${size}px;`;
        }
        if (count === 3 && i === 1) {
            return `left: 0;`;
        }
        if (count === 3 && i === 2) {
            return `right: 0;`;
        }
        if (count === 3 && i === 3) {
            return `bottom: -${size}px;`;
        }
        if (count === 4 && i === 1) {
            return `top: 0; left: 0;`;
        }
        if (count === 4 && i === 2) {
            return `top: 0; right: 0;`;
        }
        if (count === 4 && i === 3) {
            return `bottom: 0; left: 0;`;
        }
        if (count === 4 && i === 4) {
            return `bottom: 0; right: 0;`;
        }
    }}
    `;

/**
 * Render multiple images in an avatar
 */
class GroupedAvatar extends PureComponent<Object, Object> {

    getAvatarSize(count: number, index: number, size: number) {
        const i = index + 1;
        if (
            count === 1
            || count === 2
            || (count === 3 && i === 3)
        ) {
            return {
                width: `${size * 2}px`,
                height: `${size * 2}px`,
            };
        }
        return {
            width: `${size}px`,
            height: `${size}px`,
        };
    };

    buildImage = memoize((list, count, height, width) => {
        const size = (width + height) / 4;
        return list.map((avatar, index) => {
            return (
                <GroupWrapper key={index} index={index} count={count} height={height} size={size}>
                    <Avatar
                        src={get(avatar, 'user.image') || get(avatar, 'image')}
                        name={get(avatar, 'user.name') || get(avatar, 'name')}
                        rounded={false}
                        {...this.getAvatarSize(count, index, size)}
                    />
                </GroupWrapper>
            );
        });
    });

    render() {
        const { people, width, height, name } = this.props;
        const list = people.slice(0,4);
        const count = list.length;
        return count ? (
            <GroupedAvatarStyle width={width} height={height} count={count}>
                {this.buildImage(list, count, height, width)}
            </GroupedAvatarStyle>
        ) : <Avatar name={name} size="lg" />;
    }
}

export default GroupedAvatar;
