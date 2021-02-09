import React, { MouseEvent } from 'react';
import ReactDOM from 'react-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';

import Game, { Cell } from '../core/Game';

interface GameViewState {
    map: Array<Cell>,
    finished: boolean
}

const CellView = ({ cell, cellIndex, gameFinished, onClick, onContextMenu }: {
    cell: Cell,
    cellIndex: number,
    gameFinished: boolean,
    onClick: (event: MouseEvent) => void,
    onContextMenu: (event: MouseEvent) => void
}) => {

    const getCallValue = (cell: Cell) => {
        if (cell.flag === 'flag') {
            return <FontAwesomeIcon icon={faFlag} />;
        }

        if (cell.value === 9) {
            return <FontAwesomeIcon icon={faBomb} />;
        }

        return cell.value !== 0 ? cell.value : '';
    };

    return (
        <div
            data-index={cellIndex}
            className={`cell ${cell.flag} ${cell.value === 9 ? 'mine' : ''}`}
            onClick={!gameFinished ? onClick : () => { }}
            onContextMenu={!gameFinished ? onContextMenu : () => { }}
        >
            {getCallValue(cell)}
        </div>
    );
};

class GameView extends React.Component<any, GameViewState> {
    constructor(props: any) {
        super(props);

        this.state = {
            map: props.game.map,
            finished: false
        };
    }

    getCellFromChild = (element: any) => {
        let cellElement = element.parentNode;

        while (cellElement && !cellElement.classList.contains('cell')) {
            cellElement = cellElement.parentNode;
        }

        return cellElement;
    }

    onClick = (event: MouseEvent) => {
        const cellElement = event.currentTarget.classList.contains('cell')
            ? event.currentTarget
            : this.getCellFromChild(event.currentTarget);
        const cellIndex = Number(cellElement.getAttribute('data-index'));

        if (this.state.map[cellIndex].flag === 'flag') {
            event.preventDefault();
            return;
        }

        const finished = this.props.game.openCell(cellIndex, true);

        if (finished) {
            this.setState({ finished: finished });
            return;
        }
        this.forceUpdate();
    }

    onContextMenu = (event: MouseEvent) => {
        event.preventDefault();

        const cellElement = event.currentTarget.classList.contains('cell')
            ? event.currentTarget
            : this.getCellFromChild(event.currentTarget);
        const cell = this.state.map[Number(cellElement.getAttribute('data-index'))];

        cell.flag = cell.flag !== 'flag' ? 'flag' : 'closed';

        const finished = this.props.game.isFinished();

        if (finished) {
            this.setState({ finished: finished });
            return;
        }
        this.forceUpdate();
    }

    render() {
        const finished = this.state.finished;

        return (
            <div className={`container ${finished ? finished : ''}`}>
                {
                    this.state.map.map((cell, index) => (
                        <CellView
                            cell={cell}
                            cellIndex={index}
                            gameFinished={finished}
                            onClick={this.onClick}
                            onContextMenu={this.onContextMenu}
                        />
                    ))
                }
            </div>
        );
    }
}

const game = new Game({
    mapWidth: 16,
    mapHeight: 16,
    minesNumber: 45
});

const rootContainer = document.createElement('div');
rootContainer.setAttribute('id', 'root');
document.body.appendChild(rootContainer);

ReactDOM.render(
    <GameView game={game} />,
    document.getElementById('root')
);
