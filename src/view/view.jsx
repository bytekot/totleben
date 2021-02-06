import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import GameMap from '../core/Map';

class GameMapView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            map: props.gameMap.map
        };
    }

    onClick = event => {
        const cellElement = event.target;
        const rowIndex = Number(cellElement.getAttribute('row'));
        const cellIndex = Number(cellElement.getAttribute('cell'));
        const cell = this.state.map[rowIndex][cellIndex];

        this.props.gameMap.processCell2(
            Number(cellElement.getAttribute('row')),
            Number(cellElement.getAttribute('cell'))
        );

        this.setState({
            map: this.props.gameMap.map
        });
    }

    onContextMenu = event => {
        event.preventDefault();

        const cellElement = event.target;
        const rowIndex = Number(cellElement.getAttribute('row'));
        const cellIndex = Number(cellElement.getAttribute('cell'));
        const cell = this.state.map[rowIndex][cellIndex];

        cell.flag = cell.flag + ' flag';

        this.setState({
            map: this.props.gameMap.map
        });
    }

    render() {
        return (
            <div className="container">
                {
                    this.state.map.map((row, rowIndex) => (
                        <div className="row">
                            {
                                row.map((cell, cellIndex) => (
                                    <div
                                        cell={cellIndex}
                                        row={rowIndex}
                                        className={`cell ${cell.flag} ${cell.value === 'mine' ? 'mine' : ''}`}
                                        onClick={this.onClick}
                                        onContextMenu={this.onContextMenu}
                                    >
                                        {cell.value !== 'mine' ? cell.value : '💣'}
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        );
    }
}

const gameMap = new GameMap({
    width: 10,
    height: 10,
    minesNumber: 20
});

const rootContainer = document.createElement('div');
rootContainer.setAttribute('id', 'root');
document.body.appendChild(rootContainer);

ReactDOM.render(
    <GameMapView gameMap={gameMap} />,
    document.getElementById('root')
);
