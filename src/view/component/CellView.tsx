import React, { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb } from '@fortawesome/free-solid-svg-icons/faBomb';
import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag';
import { Cell, GameFinished } from '../../core/Game';

interface CellViewProps {
    cell: Cell;
    cellIndex: number;
    gameFinished: GameFinished;
    onClick: (event: MouseEvent) => void;
    onContextMenu: (event: MouseEvent) => void;
}

const CellView = ({ cell, cellIndex, gameFinished, onClick, onContextMenu }: CellViewProps) => {

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

export default CellView;
