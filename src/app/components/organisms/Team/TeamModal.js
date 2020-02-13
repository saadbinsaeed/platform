import React, { PureComponent } from 'react';
import { MemoryRouter } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Team from './Team';
import Modal from '../../molecules/Modal/Modal';


/**
 * If we want to show our team member list in a modal
 */
class TeamModal extends PureComponent<Object> {
    /**
     * Render our modal with the team-list using props.team
     */
    render() {
        return (
            <Modal title="Team" open>
                <MemoryRouter>
                    <Team />
                </MemoryRouter>
            </Modal>
        );
    }
}

export default TeamModal;
