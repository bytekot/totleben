import React from 'react';
import ReactDOM from 'react-dom';
import GameMap from '../core/Map';

const SapperMapView = ({ map }) => (
	<div className="container">
        {
            map.map(row => (
                <div className="row">
                    {
                        row.map(cellValue => (
                            <div className={`cell ${cellValue === 'mine' ? 'mine' : ''}`}>
                                <span>{cellValue !== 'mine' ? cellValue : '💣'}</span>
                            </div>
                        ))
                    }
                </div>
            ))
    	}
    </div>
);

const gameMap = new GameMap({
	width: 10,
    height: 10,
    minesNumber: 20
});

const rootContainer = document.createElement('div');
rootContainer.setAttribute('id', 'root');
document.body.appendChild(rootContainer);

ReactDOM.render(
	<SapperMapView map={gameMap.map} />,
    document.getElementById('root')
);
