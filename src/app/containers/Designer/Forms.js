/* @flow */

// $FlowFixMe
import React, { PureComponent, Fragment, useCallback, useState, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styledComponents from 'styled-components';
import { Menu, MenuItem, MdiIcon, IconButton } from '@mic3/platform-ui';

import VirtualListItem from 'app/components/molecules/VirtualList/VirtualListItem';
import VirtualListManaged from 'app/components/molecules/VirtualList/VirtualListManaged';
import PageTemplate from 'app/components/templates/PageTemplate';
import Filters from 'app/components/organisms/Filters/Filters';
import ListItem from 'app/components/molecules/List/ListItem';
import Icon from 'app/components/atoms/Icon/Icon';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';
import AddForm from 'app/components/Designer/Modals/AddForm';
import DuplicateForm from 'app/components/Designer/Modals/DuplicateForm';
import ShareForm from 'app/components/Designer/Modals/ShareForm';
import DeleteForm from 'app/components/Designer/Modals/DeleteForm';
import FormLink from 'app/components/atoms/Link/FormLink';
import Layout from 'app/components/molecules/Layout/Layout';
import history from 'store/History';
import { loadDesignerForms, createFormDefinition } from 'store/actions/designer/designerActions';
import { fromNow } from 'app/utils/date/date';
import { useToggle } from 'app/utils/hook/hooks';
import { get } from 'app/utils/lo/lo';

const ListItemStyled = styledComponents(ListItem)`
width: 100%;
max-width: 1000px;
margin: 0 auto;
`;

const useToggleMenu = (showMenu) => {
    const [isOpen, show] = useState(false);
    const toggle = useCallback(() => {
        showMenu(false);
        show(!isOpen);
    }, [isOpen, showMenu, show]);
    return [isOpen, toggle];
};

const FormItem = memo(({ form, onActionComplete }) => {
    const { name, id, modifiedBy, modified, version } = form;
    const anchorEl = useRef(null);
    const [isMenuOpen, toggleMenu, showMenu] = useToggle();
    const [isDuplicateFormOpen, toggleDuplicateForm] = useToggleMenu(showMenu);
    const [isDeleteFormOpen, toggleDeleteForm] = useToggleMenu(showMenu);
    const [isShareFormOpen, toggleShareForm] = useToggleMenu(showMenu);
    return (
        <ListItemStyled
            component={<Icon name="ballot" size="lg" />}
            title={<FormLink id={id}>{name}</FormLink>}
            subTitle={
                <Fragment>
                    <FormLink id={id}>#{id}</FormLink>, v.{version}
                    {
                        modifiedBy &&
                        <div>
                            Updated By <PeopleLink id={modifiedBy.id}>{modifiedBy.name}</PeopleLink>,
                            {' '}{fromNow(modified)}
                        </div>
                    }
                </Fragment>
            }
            actions={
                <Fragment>
                    <IconButton buttonRef={anchorEl} onClick={toggleMenu}><MdiIcon name="dots-vertical" /></IconButton>
                    <Menu open={isMenuOpen} anchorEl={anchorEl.current} onClose={toggleMenu} >
                        <MenuItem onClick={toggleDuplicateForm}>Duplicate form</MenuItem>
                        <MenuItem onClick={toggleDeleteForm}>Delete form</MenuItem>
                        <MenuItem onClick={toggleShareForm}>Share form</MenuItem>
                    </Menu>
                    { isDuplicateFormOpen && <DuplicateForm form={form} close={toggleDuplicateForm} onDuplicate={onActionComplete} /> }
                    { isDeleteFormOpen && <DeleteForm form={form} close={toggleDeleteForm} onDelete={onActionComplete} /> }
                    { isShareFormOpen && <ShareForm form={form} close={toggleShareForm} onShare={onActionComplete} /> }
                </Fragment>
            }
            raised
        />
    );
});

/**
 * View to display assigned task list
 */
class Forms extends PureComponent<Object, Object> {

    virtualListRef = React.createRef();

    /**
     * @const propTypes - describes the properties of the component
     * @const defaultProps - define the defaults values of the properties
     * @const filterDefinitions -definition for columns that we need to display in our grid
     */
    static propTypes = {
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        startIndex: PropTypes.number,
        totalRecords: PropTypes.number,
        loadDesignerForms: PropTypes.func.isRequired,
        createFormDefinition: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isLoading: false
    };

    state = { isAddFormOpen: false };

    filterDefinitions: Array<Object> = [
        { field: 'name', type: 'text', properties: { label: 'Name', name: 'name'  } },
        { field: 'id', type: 'number', properties: { label: 'ID', name: 'name'  }},
        { field: 'createdBy.name', type: 'text', properties: { label: 'Created by', name: 'createdByName' }, condition: 'startsWith' },
        { field: 'modifiedBy.name', type: 'text', properties: { label: 'Updated by', name: 'modifiedByName' }, condition: 'startsWith' },
        { field: 'modified', type: 'dateTimeRange', properties: { label: 'Last update', name: 'modified' }},
        { field: 'created', type: 'dateTime', properties: { label: 'Created', name: 'created' }, filters: false },
    ];
    searchBar = ['name', 'id'];
    defaultOrder = [{ field: 'created', direction: 'desc' }];


    renderComponent = ({ style, index, data, resize }) => {
        return (
            <VirtualListItem style={style} key={index} index={index} resize={resize} padding={15}>
                <FormItem form={data} onActionComplete={get(this.virtualListRef, 'current.resetView')} />
            </VirtualListItem>
        );
    }

    toggleAddForm = () => this.setState({ isAddFormOpen: !this.state.isAddFormOpen });
    onFormAdded = id => history.push(`/designer/form/${id}`);

    render() {
        const { totalRecords, records, isLoading, startIndex, loadDesignerForms, createFormDefinition } = this.props;
        const { isAddFormOpen } = this.state;
        return (
            <PageTemplate title="Forms">
                <Layout>
                    <Filters
                        id="DesignerForms"
                        filterDefinitions={this.filterDefinitions}
                        defaultOrder={this.defaultOrder}
                        searchBar={this.searchBar}
                    >
                        {(filterBy, orderBy) => (
                            <VirtualListManaged
                                ref={this.virtualListRef}
                                renderComponent={this.renderComponent}
                                itemSize={121}
                                itemCount={totalRecords || 0}
                                loadData={loadDesignerForms}
                                isLoading={isLoading}
                                startIndex={startIndex || 0}
                                filterBy={filterBy}
                                orderBy={orderBy}
                                list={records}
                                maxWidth="1024"
                                title={`${totalRecords >= 1000 ? '999+' : totalRecords } Forms`}
                            />
                        )}
                    </Filters>
                </Layout>
                <FooterBar>
                    <TextIcon icon="plus" label="Add form" onClick={this.toggleAddForm} />
                </FooterBar>
                <AddForm open={isAddFormOpen} onClose={this.toggleAddForm} addForm={createFormDefinition} onFormAdded={this.onFormAdded} />
            </PageTemplate>
        );
    }
}

export default connect(state => ({
    isLoading: state.designer.forms.isLoading,
    startIndex: state.designer.forms.startIndex,
    records: state.designer.forms.records,
    totalRecords: state.designer.forms.count,
}), {
    loadDesignerForms, createFormDefinition
})(Forms);
