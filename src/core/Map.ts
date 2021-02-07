export default class GameMap {
    public readonly map: Array<Cell>;
    private readonly width: number;
    public readonly template: Array<Cell>;
    minesNumber: number;

    constructor({ width, height, minesNumber }:
        { width: number, height: number, minesNumber: number }
    ) {
        this.width = width;
        this.height = height;
        this.minesNumber = minesNumber;
        //this.map = this.create(width, height, minesNumber);
        this.template = this.createTemplate(width, height);
    }

    private createTemplate = (width: number, height: number) => (
        Array.from({ length: width * height }, () => ({ value: 0, flag: 'closed' }))
    )

    public openCell = (index: number): Array<Cell> => {
        if (this.map === undefined) {
            this.map = this.create(index);
            //return;
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

        return map;
    }

    private create = (startIndex): Array<Cell> => {
        const indexModifiries = this.getIndexModifiries(startIndex);
        let map = this.template.map(a => ({ ...a }));

        const fixed = indexModifiries.map(value => startIndex + value);
        fixed.push(startIndex);
        fixed.sort();

        let minesNumber = this.minesNumber;
        for (let index = 0; index < map.length; index++) {
            if (minesNumber === 0) {
                break;
            }

            if (!fixed.includes(index)) {
                map[index].value = 9;
                minesNumber--;
            }
        }

        /*
        map.splice(0, this.minesNumber + indexModifiries.length + 1); // number of reserved cells

        map = map.concat(
            Array.from({ length: this.minesNumber }, () => ({ value: 9, flag: 'closed' }))
        );
        */

        /*
        map.splice(startIndex, 0, { value: 0, flag: 'closed' });
        for (const modifier of this.getIndexModifiries(startIndex)) {
            map.splice(startIndex + modifier, 0, { value: 0, flag: 'closed' });
        }
        */

        

        return this.mark(
            this.shuffle(map, fixed)
        );
    }




    private create2 = (width: number, height: number, minesNumber: number): Array<Cell> => (
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

    getRandomIndex = (currentIndex: number, exceptions: number[]): number  => {
        let index = Math.floor(Math.random() * (currentIndex + 1));

        while (exceptions.includes(index)) {
            index = Math.floor(Math.random() * (currentIndex + 1));
        }

        return index;
    }

    private shuffle = (array: any[], indexesToExcept: number[]): any[] => {
        for (let index = array.length - 1; index > 0; index--) {
            //const i = Math.floor(Math.random() * (index + 1));
            if (!indexesToExcept.includes(index)) {
                const i = this.getRandomIndex(index, indexesToExcept);
                //console.log(index, i);

                [array[index], array[i]] = [array[i], array[index]];
            }
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
}

interface Cell {
    value: number,
    flag: string | undefined;
};
