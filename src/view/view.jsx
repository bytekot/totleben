import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';
import Game from '../core/Game';

class GameView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            map: props.game.map
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

        this.props.game.openCell(cellIndex);
        this.forceUpdate();
    }

    onContextMenu = event => {
        event.preventDefault();

        const cellElement = event.target.classList.contains('cell')
            ? event.target
            : this.getCellFromChild(event.target);
        const cell = this.state.map[Number(cellElement.getAttribute('index'))];

        cell.flag = cell.flag !== 'flag' ? 'flag' : 'closed';

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
        return (
            <div className="container">
                {
                    this.state.map.map((cell, index) => (
                        <div
                            index={index}
                            className={`cell ${cell.flag} ${cell.value === 9 ? 'mine' : ''}`}
                            onClick={this.onClick}
                            onContextMenu={this.onContextMenu}
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
    mapWidth:16,
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
