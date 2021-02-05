import React from 'react';
import ReactDOM from 'react-dom';
import GameMap from '../core/Map';

const onClick = event => {
    if (event.target.classList.contains('mask')) {
        event.target.classList.remove('mask');
    }
};

const onContextMenu = event => {
    event.preventDefault();

    if (event.target.classList.contains('mask')) {
        event.target.classList.add('flag');
    }
};

const SapperMapView = ({ map }) => {
	return (
        <div className="container">
            {
                map.map((row, rowIndex) => (
                    <div className="row">
                        {
                            row.map((cellValue, cellIndex) => (
                                <div
                                    x={cellIndex}
                                    y={rowIndex}
                                    className={`mask cell ${cellValue === 'mine' ? 'mine' : ''}`}
                                    onClick={onClick}
                                    onContextMenu={onContextMenu}
                                >
                                    {cellValue !== 'mine' ? cellValue : '💣'}
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
};

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
