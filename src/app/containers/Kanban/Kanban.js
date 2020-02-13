import React, { PureComponent } from 'react';
import Board from 'react-trello';

import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import PageTemplate from 'app/components/templates/PageTemplate';

const data = {
    lanes: [
        {
            id: 'lane1',
            title: 'Planned Tasks',
            label: '2/2',
            cards: [
                {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins'},
                {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
            ]
        },
        {
            id: 'lane2',
            title: 'Completed',
            label: '0/0',
            cards: []
        }
    ]
};

/**
 * Sample kanban
 */
class Kanban extends PureComponent {
    render() {
        return(
            <PageTemplate title="Kanban">
                <ContentArea>
                    <Board data={data} />
                </ContentArea>
            </PageTemplate>
        );
    }
}

export default Kanban;
