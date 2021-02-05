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
                cell ? 'mine' : cell
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

        if (row[cellIndex] === 'mine') {
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
        if (typeof row[cellIndex] === 'number') {
            row[cellIndex] = row[cellIndex] + 1;
        }
    }
}
