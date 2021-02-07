import React, { useState } from 'react';
import ReactDOM from 'react-dom';
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

    onClick = event => {
        this.setState({
            map: this.props.gameMap.openCell(
                Number(event.target.getAttribute('index'))
            )
        });
    }

    onContextMenu = event => {
        event.preventDefault();

        this.state.map[Number(event.target.getAttribute('index'))].flag = 'flag';

        this.forceUpdate();
    }

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
                            {cell.value}
                        </div>
                    ))
                }
            </div>
        );
    }
}

const gameMap = new GameMap({
    width:9,
    height: 9,
    minesNumber: 10
});

const rootContainer = document.createElement('div');
rootContainer.setAttribute('id', 'root');
document.body.appendChild(rootContainer);

ReactDOM.render(
    <GameMapView gameMap={gameMap} />,
    document.getElementById('root')
);
