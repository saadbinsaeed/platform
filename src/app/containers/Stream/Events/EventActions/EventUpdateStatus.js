/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateEventStatus } from 'store/actions/stream/eventsActions';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Button from 'app/components/atoms/Button/Button';
import Modal from 'app/components/molecules/Modal/Modal';

/**
 * Renders the icon to show the actions.
 */
class EventUpdateStatus extends PureComponent<Object, Object> {

    static propTypes = {
        updateEventStatus: PropTypes.func.isRequired,
        postAction: PropTypes.func,
        status: PropTypes.string,
        eventId: PropTypes.number,
        color: PropTypes.string,
    };

    /**
     * @param props the Component's properties
     */
    constructor( props: Object ) {
        super( props );
        this.state = { visible: false, };

        (this: Object).showDialog = this.showDialog.bind( this );
        (this: Object).closeDialog = this.closeDialog.bind( this );
        (this: Object).action = this.action.bind( this );
    }

    /**
     * Shows the dialog
     */
    showDialog(event: ?Object) {
        if (event) {
            event.preventDefault();
        }
        this.setState({ visible: true });
    }

    /**
     * Close the dialog
     */
    closeDialog() {
        this.setState({ visible: false });
    }

    /**
     * Updates the status of the event
     */
    action(event: ?Object) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        const { status, eventId, postAction } = this.props;
        this.props.updateEventStatus({ status, eventId }).then(() => postAction && postAction());
    }

    /**
     * @override
     * @return {XML}
     */
    render(): Object {
        const { visible } = this.state;
        const { status, color } = this.props;
        return (
            <span>
                <ButtonIcon
                    icon={status === 'ACK' ? 'check' : 'close'}
                    onClick={this.showDialog}
                    size="lg"
                    title={status === 'ACK' ? 'Acknowledged' : 'Discard'}
                    alt={status === 'ACK' ? 'Acknowledged' : 'Discard'}
                    iconColor={color}
                />
                {
                    visible ?
                        <Modal open title={status === 'ACK' ? 'Acknowledge Event' : 'Discard Event'} onToggle={this.closeDialog}>
                            <div>
                                <Button color="primary" onClick={this.action} >Proceed</Button>
                                <Button onClick={this.closeDialog}>Cancel</Button>
                            </div>
                        </Modal>
                        : null
                }
            </span>
        );
    }
}

export default connect ( null, { updateEventStatus })( EventUpdateStatus );
