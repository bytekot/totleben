export default class GameMap {
    public readonly mapTemplate: number[][];
    public readonly map: number[][] | string[][];

    constructor({ width, height, minesNumber }: { width: number, height: number, minesNumber: number }) {
        this.mapTemplate = this.fillMap(
            this.createEmptyMap(width, height),
            minesNumber
        );

        this.map = this.getMarkedMap(this.mapTemplate);
    }

    createEmptyMap(width, height) {
        return Array.from({ length: width }, () =>
            Array.from({ length: height }, () => 0)
        );
    }

    fillMap(map, minesNumber) {
        while (!this.isMapFilled(map, minesNumber)) {
            const row = map[this.getRandomIndex(map)];

            row[this.getRandomIndex(row)] = 1;
        }

        return map;
    }

    isMapFilled(map, minesNumber) {
        return map.flat().reduce((item1, item2) => item1 + item2) === minesNumber;
    }

    getRandomIndex(array) {
        return Math.floor(Math.random() * array.length);
    }

    getMarkedMap(templateMap) {
        const map = templateMap.map(row => (
            row.map(cell => (
                { value: cell ? 'mine' : cell, flag: 'closed' }
            ))
        ));

        for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
            this.processRow(map, rowIndex);
        }

        return map;
    }

    processRow(map, rowIndex) {
        const row = map[rowIndex];

        for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
            this.processCell(map, rowIndex, cellIndex);
        }
    }

    processCell(map, rowIndex, cellIndex) {
        const row = map[rowIndex];

        if (row[cellIndex].value === 'mine') {
            // Left cell
            this.maybeIncreaseCellValue(row, cellIndex - 1);
            // Right cell
            this.maybeIncreaseCellValue(row, cellIndex + 1);
            // Adjacent cells in the top row
            this.processAdjacentCells(map[rowIndex - 1], cellIndex);
            // Adjacent cells in the bottom row
            this.processAdjacentCells(map[rowIndex + 1], cellIndex);
        }
    }

    processAdjacentCells(row, cellIndex) {
        if (row) {
            this.maybeIncreaseCellValue(row, cellIndex);
            this.maybeIncreaseCellValue(row, cellIndex - 1);
            this.maybeIncreaseCellValue(row, cellIndex + 1);
        }
    }

    maybeIncreaseCellValue(row, cellIndex) {
        if (row[cellIndex] && typeof row[cellIndex].value === 'number') {
            row[cellIndex].value = row[cellIndex].value + 1;
        }
    }


    processCell2(rowIndex, cellIndex) {
        const row = this.map[rowIndex];

        row[cellIndex].flag = 'opened';

        if (row[cellIndex].value === 0) {
            // Left cell
            this.maybeIncreaseCellValue2(row, cellIndex - 1);
            // Right cell
            this.maybeIncreaseCellValue2(row, cellIndex + 1);
            // Adjacent cells in the top row
            this.processAdjacentCells2(this.map[rowIndex - 1], cellIndex);
            // Adjacent cells in the bottom row
            this.processAdjacentCells2(this.map[rowIndex + 1], cellIndex);
        }
    }

    processAdjacentCells2(row, cellIndex) {
        if (row) {
            this.maybeIncreaseCellValue2(row, cellIndex);
            this.maybeIncreaseCellValue2(row, cellIndex - 1);
            this.maybeIncreaseCellValue2(row, cellIndex + 1);
        }
    }

    maybeIncreaseCellValue2(row, cellIndex) {
        if (row[cellIndex] && row[cellIndex].flag !== 'opened') {
            row[cellIndex].flag = 'opened';

            if (row[cellIndex].value === 0) {
                this.processCell2(this.map.indexOf(row), cellIndex);
            }
        }
    }
}
