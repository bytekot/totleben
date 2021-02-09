import React, { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb } from '@fortawesome/free-solid-svg-icons/faBomb';
import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag';
import { Cell } from '../../core/Game';

interface CellViewProps {
    cell: Cell;
    cellIndex: number;
    onClick: (event: MouseEvent) => void;
}

const CellView = ({ cell, cellIndex, onClick }: CellViewProps) => {

    const getCallValue = (cell: Cell): JSX.Element | string => {
        if (cell.flag === 'flag') {
            return <FontAwesomeIcon icon={faFlag} />;
        }

        if (cell.value === 9) {
            return <FontAwesomeIcon icon={faBomb} />;
        }

        return cell.value !== 0 ? cell.value.toString() : '';
    };

    return (
        <div
            data-index={cellIndex}
            className={`cell ${cell.flag} ${cell.value === 9 ? 'mine' : ''}`}
            onClick={onClick}
            onContextMenu={onClick}
        >
            {getCallValue(cell)}
        </div>
    );
};

export default CellView;
