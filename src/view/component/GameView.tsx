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

    private readonly onCellClick = (event: MouseEvent): void => {
        if (this.state.finished) {
            return;
        }

        const cellIndex = Number(event.currentTarget.getAttribute('data-index'));
        const cell = this.state.map[cellIndex];
        const isLeftButtonClick = event.type === 'click';
        const isFlagSet = cell.flag === 'flag';

        if (!isLeftButtonClick) {
            event.preventDefault();

            cell.flag = isFlagSet ? 'closed' : 'flag'; // move to the core

        } else if (isFlagSet) {
            event.preventDefault();
            return;
        }

        const finished = isLeftButtonClick
            ? this.props.game.openCell(cellIndex, true)
            : this.props.game.isFinished();

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
                            onClick={this.onCellClick}
                        />
                    ))
                }
            </div>
        );
    }
}
