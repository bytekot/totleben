import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';
import GameMap from '../core/Map';

class GameMapView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            map: props.gameMap.map,
            width: props.gameMap.width,
            height: props.gameMap.height
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

        this.props.gameMap.openCell(
            Number(cellElement.getAttribute('index'))
        );
        this.forceUpdate();
    }

    onContextMenu = event => {
        event.preventDefault();

        const cellElement = event.target.classList.contains('cell')
            ? event.target
            : this.getCellFromChild(event.target);

        this.state.map[Number(cellElement.getAttribute('index'))].flag = 'flag';

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

const gameMap = new GameMap({
    width:16,
    height: 16,
    minesNumber: 40
});

const rootContainer = document.createElement('div');
rootContainer.setAttribute('id', 'root');
document.body.appendChild(rootContainer);

ReactDOM.render(
    <GameMapView gameMap={gameMap} />,
    document.getElementById('root')
);
