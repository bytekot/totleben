export interface Cell {
    value: number,
    flag: string | undefined;
};
export default class Game {
    private started: boolean = false;

    private readonly mapWidth: number;
    private readonly minesNumber: number;

    public readonly map: Array<Cell>;

    constructor({ mapWidth, mapHeight, minesNumber }: {
        mapWidth: number,
        mapHeight: number,
        minesNumber: number
    }) {
        this.mapWidth = mapWidth;
        this.minesNumber = minesNumber;
        this.map = this.createMapTemplate(mapWidth, mapHeight);
    }

    private createMapTemplate = (
        mapWidth: number,
        mapHeight: number
    ): Array<Cell> => (

        Array.from({ length: mapWidth * mapHeight }, () => (
            { value: 0, flag: 'closed' }
        ))
    )

    private createMap = (startIndex: number): Array<Cell> => {
        const startSquareCoordinates = this.getIndexModifiries(startIndex).map(
            value => startIndex + value
        );
        startSquareCoordinates.push(startIndex);
        startSquareCoordinates.sort();

        let map = this.map;
        let minesNumber = this.minesNumber;

        for (let index = 0; index < map.length; index++) {
            if (minesNumber === 0) {
                break;
            }

            if (!startSquareCoordinates.includes(index)) {
                map[index].value = 9;
                minesNumber--;
            }
        }

        this.markMap(
            this.shuffle(map, startSquareCoordinates)
        );
        this.started = true;

        return map;
    }

    getRandomIndex = (
        currentIndex: number,
        exceptions: number[]
    ): number => {
        let index;

        while (index === undefined || exceptions.includes(index)) {
            index = Math.floor(Math.random() * (currentIndex + 1));
        }

        return index;
    }

    /**
     * @param array 
     * @param exceptions Array of indexes not involved in shuffling
     */
    private shuffle = (
        array: any[],
        exceptions: number[] = []
    ): any[] => {

        for (let index = array.length - 1; index > 0; index--) {
            if (!exceptions.includes(index)) {
                const i = this.getRandomIndex(index, exceptions);

                [array[index], array[i]] = [array[i], array[index]];
            }
        }

        return array;
    }

    private markMap = (map: Array<Cell>): Array<Cell> => {
        for (let index = 0; index < map.length; index++) {
            if (map[index].value === 9) {
                for (const modifier of this.getIndexModifiries(index)) {
                    const cell = map[index + modifier];

                    if (cell && cell.value !== 9) {
                        cell.value++;
                    }
                }
            }
        }

        return map;
    }

    private getIndexModifiries = (index: number): number[] => {
        const mapWidth = this.mapWidth;
        const indexModifiries = [mapWidth, -mapWidth];

        if (index % mapWidth !== 0) {
            indexModifiries.push(-1, mapWidth - 1, -mapWidth - 1);
        }

        if ((index + 1) % mapWidth !== 0) {
            indexModifiries.push(1, mapWidth + 1, -mapWidth + 1);
        }

        return indexModifiries;
    };

    public openCell = (index: number, check: boolean = false): boolean | string => {
        if (!this.started) {
            this.createMap(index);
        }
        const map = this.map;

        map[index].flag = 'opened';

        if (map[index].value === 0) {
            for (const modifier of this.getIndexModifiries(index)) {
                const cell = map[index + modifier];

                if (cell && cell.flag !== 'opened') {
                    cell.flag = 'opened';

                    if (cell.value === 0) {
                        this.openCell(index + modifier);
                    }
                }
            }
        }

        return check ? this.isFinished(index) : false;
    }

    isFinished = (index: number): boolean | string => {
        const map = this.map;

        if (index && map[index].value === 9) {
            return 'loss';
        }

        const finished = map.every(cell => cell.value === 9 ? true : cell.flag === 'opened');

        if (finished) {
            const cell = map.find(cell => cell.value === 9 && cell.flag != 'flag');
            if (cell) {
                cell.flag = 'flag';
            }
            return'win';
        }

        return finished;
    }
}
