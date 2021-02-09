import React, { MouseEvent } from 'react';
import CellView from './CellView';
import Game, { Cell, GameFinished } from '../../core/Game';

interface GameViewProps {
    game: Game
}
interface GameViewState {
    map: Array<Cell>,
    finished: GameFinished
}

export default class GameView extends React.Component<GameViewProps, GameViewState> {
    constructor(props: GameViewProps) {
        super(props);

        this.state = {
            map: props.game.map,
            finished: false
        };
    }

    private readonly getCellFromChild = (element: any): HTMLElement => {
        let cellElement = element.parentNode;

        while (cellElement && !cellElement.classList.contains('cell')) {
            cellElement = cellElement.parentNode;
        }

        return cellElement;
    }

    private readonly openCell = (event: MouseEvent): void => {
        const cellElement = event.currentTarget.classList.contains('cell')
            ? event.currentTarget
            : this.getCellFromChild(event.currentTarget);
        const cellIndex = Number(cellElement.getAttribute('data-index'));

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

    private readonly toggleFlag = (event: MouseEvent): void => {
        event.preventDefault();

        const cellElement = event.currentTarget.classList.contains('cell')
            ? event.currentTarget
            : this.getCellFromChild(event.currentTarget);
        const cell = this.state.map[Number(cellElement.getAttribute('data-index'))];

        cell.flag = cell.flag !== 'flag' ? 'flag' : 'closed';

        const finished = this.props.game.isFinished();

        if (finished) {
            this.setState({ finished: finished });
            return;
        }
        this.forceUpdate();
    }

    render() {
        const finished = this.state.finished;

        return (
            <div className={`container ${finished ? finished : ''}`}>
                {
                    this.state.map.map((cell, index) => (
                        <CellView
                            cell={cell}
                            cellIndex={index}
                            gameFinished={finished}
                            onClick={this.openCell}
                            onContextMenu={this.toggleFlag}
                        />
                    ))
                }
            </div>
        );
    }
}
