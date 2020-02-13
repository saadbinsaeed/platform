/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from 'app/components/atoms/Button/Button';
import { Row, Col } from 'react-styled-flexboxgrid';
import Icon from 'app/components/atoms/Icon/Icon';
import { cut } from 'app/utils/string/string-utils';
import { label } from 'app/containers/Classifications/attributeTypes';

const Container = styled.div`
    cursor: grab;
    padding: 8px;
    min-height: 40px;
    margin-bottom: 8px;
    user-select: none;
    transition: background-color 0.1s ease;
    width: ${({ width }) => `${width}px`};
    ${({ isDragging }) => (isDragging ? 'opacity: 0.5; background: green; margin-left: -58px;' : '')};
    p {
        padding: 0;
        margin: 0;
        line-height: 40px;
    }
    a {
        color: ${({ theme }) => theme.base.textColor};
    }
`;

const StyledButton = styled(Button)`
    @media (max-width: ${({ theme }) => theme.media.sm}) {
        .Icon {
            margin-left: -0.5rem;
        }
    }
`;

const StyledIcon = styled(Icon)`
    padding-right: 1rem;
    vertical-align: middle;
    height: 40px;
`;

/**
 *
 */
const ListItem = (props: Object) => {
    const { rowData, isDragging, provided, classId, canEdit, width } = props;
    const { name, type, f_uri } = rowData;
    const attributeName = cut(name, 25, true);
    const fieldEncoded = encodeURIComponent(f_uri);
    return (
        <Container
            isDragging={isDragging}
            innerRef={provided.innerRef}
            width={width}
            key={name}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            <Row>
                <Col xs={6} sm={6} md={6} lg={6}>
                    <p>
                        <StyledIcon name="drag-vertical"/>
                        {!canEdit ? <span title={name}>{attributeName}</span> : <Link
                            title={name}
                            to={`/classifications/${classId}/attributes/${fieldEncoded}`}
                        >{attributeName}</Link>}
                    </p>
                </Col>
                <Col xs={5} sm={5} md={5} lg={5}>
                    <p>{label(type)}</p>
                </Col>
                <Col xs={1} sm={1} md={1} lg={1}>
                    {!canEdit ? null : <StyledButton icon="delete" onClick={() => props.removeListItem(f_uri)}/>}
                </Col>
            </Row>
        </Container>
    );
};

ListItem.propTypes = {
    rowData: PropTypes.object,
    isDragging: PropTypes.bool,
    provided: PropTypes.any,
    autoFocus: PropTypes.bool,
    classId: PropTypes.number,
    removeListItem: PropTypes.func,
    canEdit: PropTypes.bool,
};

export default ListItem;
