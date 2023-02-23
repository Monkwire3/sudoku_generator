export class CanvasBoard {
    constructor(boardSize, gridWidth, gridHeight, sumGroups) {
        this.boardSize = boardSize;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.sumGroups = sumGroups;
        this.sumClues = [];
        this.walls = [];
        this.corners = [];
        this.colors = [];
        this.selectColor = '#d9d3c9';
        this.theme = 'none';
    };

    update(ctx, selectedCell, penMarks, pencilMarks, errors) {
        this.drawBackground(ctx);
        this.drawColors(ctx);
        if (selectedCell != null) {
            this.highlightSelectedCell(ctx, selectedCell);
        }
        this.drawSumsOvelay(ctx);
        this.drawCorners(ctx);
        this.drawSumClues(ctx, selectedCell);
        this.drawGridLines(ctx);
        this.drawPenMarks(ctx, penMarks, errors);
        this.drawPencilMarks(ctx, penMarks, pencilMarks);
    }

    drawBackground(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.gridWidth, this.gridHeight);
    }

    drawGridLines(ctx) {
        ctx.setLineDash([]);

        for (let i = 1; i < this.boardSize; i++) {
            ctx.beginPath();
            ctx.moveTo(0, (this.gridHeight / this.boardSize) * i);
            ctx.lineTo(this.gridWidth, (this.gridHeight / this.boardSize) * i);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            if (i % 3 === 0) { ctx.lineWidth = 4 };
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo((this.gridWidth / this.boardSize) * i, 0);
            ctx.lineTo((this.gridWidth / this.boardSize) * i, this.gridHeight);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            if (i % 3 === 0) { ctx.lineWidth = 4 };
            ctx.stroke();
        };
    };

    drawPenMarks(ctx, penMarkings, errors) {
        let currIndex = 0;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (penMarkings[currIndex] != 0) {
                    // hard-coded font size = 30px
                    ctx.font = `${this.gridWidth / 16}px serif`;
                    ctx.fillStyle = 'black';
                    if (errors[currIndex]) {
                        ctx.fillStyle = 'rgb(189, 17, 17)';
                    }
                    // offsets: 25 and 45
                    ctx.fillText(`${penMarkings[currIndex]}`, (this.gridWidth / 9) * j + this.gridWidth / 25, (this.gridHeight / 9) * i + this.gridWidth / 13);
                };
                currIndex++
            };
        };
    };


    getCellNumber(x, y) {
        let currIndex = 0;
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if ((((this.gridHeight / this.boardSize) * j) < x) && (x < ((this.gridHeight / this.boardSize * j) + (this.gridHeight / this.boardSize)))) {
                    if (((this.gridWidth / this.boardSize * i) < y) && ((y < (this.gridWidth / this.boardSize * i) + (this.gridWidth / this.boardSize)))) {
                        return currIndex;
                    };
                };


                currIndex++;
            };
        };
    };

};
