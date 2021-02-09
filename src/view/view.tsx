import React from 'react';
import ReactDOM from 'react-dom';
import GameView from './component/GameView';
import Game from '../core/Game';

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
