import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';
import Game from '../core/Game';

class GameView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            map: props.game.map,
            finished: false
        };
    }

    getCellFromChild = element => {
        let cellElement = element.parentNode;

        while (cellElement && !cellElement.classList.contains('cell')) {
            cellElement = cellElement.parentNode;
        }

        return cellElement;
    }

    onClick = event => {
        const cellElement = event.target.classList.contains('cell')
            ? event.target
            : this.getCellFromChild(event.target);
        const cellIndex = Number(cellElement.getAttribute('index'));

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

    onContextMenu = event => {
        event.preventDefault();

        const cellElement = event.target.classList.contains('cell')
            ? event.target
            : this.getCellFromChild(event.target);
        const cell = this.state.map[Number(cellElement.getAttribute('index'))];

        cell.flag = cell.flag !== 'flag' ? 'flag' : 'closed';
        
        const finished = this.props.game.isFinished();

        if (finished) {
            this.setState({ finished: finished });
            return;
        }
        this.forceUpdate();
    }

    getCallValue = cell => {
        if (cell.flag === 'flag') {
            return <FontAwesomeIcon icon={faFlag} />;
        }

        if (cell.value === 9) {
            return <FontAwesomeIcon icon={faBomb} />;
        }

        return cell.value !== 0 ? cell.value : '';
    };

    render() {
        const finished = this.state.finished;

        return (
            <div className={`container ${finished ? finished : ''}`}>
                {
                    this.state.map.map((cell, index) => (
                        <div
                            index={index}
                            className={`cell ${cell.flag} ${cell.value === 9 ? 'mine' : ''}`}
                            onClick={!finished ? this.onClick : () => {}}
                            onContextMenu={!finished ? this.onContextMenu : () => {}}
                        >
                            {this.getCallValue(cell)}
                        </div>
                    ))
                }
            </div>
        );
    }
}

const game = new Game({
    mapWidth: 9,
    mapHeight: 9,
    minesNumber: 10
});

const rootContainer = document.createElement('div');
rootContainer.setAttribute('id', 'root');
document.body.appendChild(rootContainer);

ReactDOM.render(
    <GameView game={game} />,
    document.getElementById('root')
);
