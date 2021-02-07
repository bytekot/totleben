export default class GameMap {
    public readonly map: Array<Cell>;
    private readonly width: number;

    constructor({ width, height, minesNumber }:
        { width: number, height: number, minesNumber: number }
    ) {
        this.width = width;
        this.map = this.create(width, height, minesNumber);
    }

    private create = (width: number, height: number, minesNumber: number): Array<Cell> => (
        this.mark(
            this.shuffle(
                Array.from({ length: width * height - minesNumber }, () =>
                    ({ value: 0, flag: 'closed' })
                ).concat(
                    Array.from({ length: minesNumber }, () =>
                        ({ value: 9, flag: 'closed' })
                    )
                )
            )
        )
    )

    private shuffle = (array: any[]): any[] => {
        for (let index = array.length - 1; index > 0; index--) {
            const i = Math.floor(Math.random() * (index + 1));

            [array[index], array[i]] = [array[i], array[index]];
        }

        return array;
    }

    private mark = (map: Array<Cell>): Array<Cell> => {
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
        const mapWidth = this.width;
        const indexModifiries = [ mapWidth, -mapWidth];

        if (index % mapWidth !== 0) {
            indexModifiries.push(-1, mapWidth - 1, -mapWidth -1);
        }

        if ((index + 1) % mapWidth !== 0) {
            indexModifiries.push(1, mapWidth + 1, -mapWidth + 1);
        }

        return indexModifiries;
    };

    public openCell = (index: number): Array<Cell> => {
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

        return map;
    }
}

interface Cell {
    value: number,
    flag: string | undefined;
};
