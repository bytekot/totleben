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
        const game = this.props.game;
        const cellIndex = Number(event.currentTarget.getAttribute('data-index'));
        let finished;

        if (event.type === 'click') {
            if (this.state.map[cellIndex].flag === 'flag') {
                event.preventDefault();
                return;
            }
            game.openCell(cellIndex);
            finished = game.isFinished(cellIndex);

        } else {
            event.preventDefault();

            game.toggleCellFlag(cellIndex);
            finished = game.isFinished();
        }

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
