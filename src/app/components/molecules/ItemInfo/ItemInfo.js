/* @flow */

import React from 'react';
import styled from 'styled-components';

import Flex from 'app/components/atoms/Flex/Flex';
import Title from 'app/components/atoms/Title/Title';
import Text from 'app/components/atoms/Text/Text';

const Icon = styled.div`
margin-right: 0.6rem;
`;

const Subtitle = styled.div`
font-size: 0.8rem;
`;

/**
 * Renders the image of an avatar.
 */
const ItemInfo = ( props: Object ): Object => {
    const { icon, title, subtitle } = props;
    return (
        <Flex>
            <Icon>{icon}</Icon>
            <Text>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </Text>
        </Flex>
    );
};

export default ItemInfo;
