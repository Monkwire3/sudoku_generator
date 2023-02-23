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

    drawPencilMarks(ctx, penMarkings, pencilMarkings) {
        let currIndex = 0;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (penMarkings[currIndex] === 0) {
                    let pencilIndex = 0;
                    for (let c = 0; c < 3; c++) {
                        for (let r = 0; r < 3; r++) {
                            if (pencilMarkings[currIndex][pencilIndex] != -1) {
                                // 15px
                                ctx.font = `${this.gridWidth / 50}px serif`;
                                ctx.fillStyle = "black";
                                // 15, 15, 15, 25
                                ctx.fillText(`${pencilMarkings[currIndex][pencilIndex] + 1}`, (this.gridWidth / 9) * j + (r * this.gridWidth / 55) + this.gridWidth / 30, (this.gridHeight / 9) * i + (c * this.gridWidth / 40) + this.gridWidth / 25);
                            };
                            pencilIndex++;
                        };
                    };
                };
                currIndex++;
            };
        };
    };

    highlightSelectedCell(ctx, cellNumber) {
        let currIndex = 0;

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (currIndex === cellNumber) {
                    ctx.rect(this.gridHeight / 9 * j, this.gridWidth / 9 * i, this.gridHeight / 9, this.gridWidth / 9);
                    ctx.fillStyle = this.selectColor;
                    ctx.fill();
                } else if (currIndex > cellNumber) {
                    break;
                };

                currIndex++;
            }
        }
    }

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

    getAdjacentCells(index) {
        let north = index - this.boardSize;
        let east = index + 1;
        let south = index + this.boardSize;
        let west = index - 1;
        const adjacent = { n: north, e: east, s: south, w: west };

        return adjacent;

    };

    getWalls() {
        const walls = [];

        for (let i = 0; i < this.boardSize ** 2; i++) {
            walls.push({ n: false, e: false, s: false, w: false });
        }


        for (let i = 0; i < this.sumGroups.length; i++) {
            for (let j = 0; j < this.sumGroups[i].cells.length; j++) {
                const adjacentInclude = (dir) => {
                    return !this.sumGroups[i].cells.includes(dir);
                };
                let adjacentCells = this.getAdjacentCells(this.sumGroups[i].cells[j]);
                if (adjacentInclude(adjacentCells.n)) {
                    walls[this.sumGroups[i].cells[j]].n = true;
                };
                if (adjacentInclude(adjacentCells.e)) {
                    walls[this.sumGroups[i].cells[j]].e = true;
                };
                if (adjacentInclude(adjacentCells.s)) {
                    walls[this.sumGroups[i].cells[j]].s = true;
                };
                if (adjacentInclude(adjacentCells.w)) {
                    walls[this.sumGroups[i].cells[j]].w = true;
                };
            };
        };
        return walls;
    };



    drawSumsOvelay(ctx) {
        if (this.walls.length === 0) {
            this.walls = this.getWalls()
        }

        let currIndex = 0;
        let wallOffset = this.gridWidth / 85;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                ctx.beginPath();
                ctx.setLineDash([5, 5]);
                ctx.strokeStyle = 'grey';
                if (this.walls[currIndex].n) {
                    ctx.moveTo((this.gridWidth / 9 * j) + wallOffset, (this.gridHeight / 9 * i) + wallOffset)
                    ctx.lineTo((((this.gridWidth / 9) * j) + (this.gridWidth / 9) - wallOffset), (((this.gridWidth / 9) * i) + wallOffset))
                }

                if (this.walls[currIndex].e) {
                    ctx.moveTo(((this.gridWidth / 9 * j) + (this.gridWidth / 9)) - wallOffset, ((this.gridHeight / 9) * i) + wallOffset)
                    ctx.lineTo((((this.gridWidth / 9) * j) + (this.gridWidth / 9) - wallOffset), (((this.gridHeight / 9) * i) + ((this.gridHeight / 9)) - wallOffset))
                }

                if (this.walls[currIndex].s) {
                    ctx.moveTo((this.gridWidth / 9 * j) + wallOffset, (this.gridHeight / 9 * i) + ((this.gridHeight / 9) - wallOffset))
                    ctx.lineTo((((this.gridWidth / 9) * j) + (this.gridWidth / 9)) - wallOffset, (((this.gridHeight / 9) * i) + (this.gridHeight / 9) - wallOffset))
                }

                if (this.walls[currIndex].w) {
                    ctx.moveTo(((this.gridWidth / 9 * j) + wallOffset), ((this.gridHeight / 9) * i) + wallOffset)
                    ctx.lineTo((((this.gridWidth / 9) * j) + wallOffset), (((this.gridHeight / 9) * i) + ((this.gridHeight / 9)) - wallOffset))
                }
                ctx.stroke();
                currIndex++;
            };
        };
    };

    drawSumClues(ctx, selectedCell) {
        if (this.sumClues.length === 0) {
            this.sumClues = new Array(81).fill(0)
            for (let i = 0; i < this.sumGroups.length; i++) {
                this.sumClues[this.sumGroups[i].cells[0]] = this.sumGroups[i].sum;
            };
        };


        let currIndex = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.sumClues[currIndex] != 0) {
                    if (selectedCell != null && currIndex === selectedCell) {
                        ctx.fillStyle = this.selectColor;
                    } else {
                        ctx.fillStyle = this.colors[currIndex];
                    };

                    // 23, 20
                    ctx.fillRect((this.gridWidth / 9) * j, ((this.gridHeight / 9) * i), this.gridWidth / 22, this.gridWidth / 22);
                    // 17px
                    ctx.font = `${this.gridWidth / 30}px serif`;
                    ctx.fillStyle = 'rgb(189, 17, 17)';
                    // +5, +17
                    ctx.fillText(`${this.sumClues[currIndex]}`, ((this.gridWidth / 9) * j) + this.gridWidth / 90, ((this.gridHeight / 9) * i) + this.gridWidth / 28);
                };
                currIndex++;
            };
        };
    };

    getColors() {
        let colors = [];

        if (this.theme === 'none') {
            colors = ['white'];
            this.selectColor = '#d9d3c9';
        } else if (this.theme === 'random') {
            for (let i = 0; i < 100; i++) {
                colors.push(`rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`);
            };
            this.selectColor = 'white';
        } else if (this.theme === 'pastel') {
            colors = ['#fbf8cc', '#fde4cf', '#ffcfd2', '#f1c0e8', '#cfbaf0', '#a3c4f3', '#90dbf4', '#8eecf5', '#98f5e1', '#b9fbc0'];
            this.selectColor = 'white';
        } else if (this.theme === 'greyscale') {
            this.selectColor = 'white';
            colors = ['#f8f9fa', '#C2C0C4', '#dee2e6', '#ced4da', '#adb5bd', '#B8B5BA', '#AEABB0', '#E1DFE1', '#e9ecef', '#D7D5D7'];
        }

        let colIndex = 0;
        let cellColors = new Array(81).fill(0);

        for (let i = 0; i < this.sumGroups.length; i++) {
            // let color = colors[Math.floor(Math.random() * colors.length)];
            let color = colors[colIndex];
            for (let j = 0; j < this.sumGroups[i].cells.length; j++) {
                cellColors[this.sumGroups[i].cells[j]] = color;
            };

            if (colIndex + 1 === colors.length) {
                colIndex = 0;
            } else {
                colIndex++;
            }
        };
        this.colors = cellColors;
    };


    drawColors(ctx) {
        if (this.colors.length === 0) {
            this.getColors();
        }

        let currIndex = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                ctx.fillStyle = this.colors[currIndex];
                ctx.fillRect(((this.gridWidth / 9) * j), ((this.gridHeight / 9) * i), this.gridHeight / 9, this.gridWidth / 9);
                currIndex++;
            };
        };
    };

    getCorners() {
        if (this.walls.length === 0) {
            this.getWalls();
        };

        let corners = [];

        for (let i = 0; i < 81; i++) {
            let corner = { ne: false, se: false, sw: false, nw: false };
            let adjacent = this.getAdjacentCells(i);

            if (0 <= adjacent.n && adjacent.n < 81) {
                if (!this.walls[adjacent.n].s) {
                    if (this.walls[adjacent.n].e) {
                        if (0 <= adjacent.e < 81 && !this.walls[adjacent.e].w) {
                            if (this.walls[adjacent.e].n) {
                                corner.ne = true;
                            }
                        }
                    }
                }
            }
            if (0 <= adjacent.s && adjacent.s < 81) {
                if (!this.walls[adjacent.s].n) {
                    if (this.walls[adjacent.s].e) {
                        if (0 <= adjacent.e < 81 && !this.walls[adjacent.e].w) {
                            if (this.walls[adjacent.e].s) {
                                corner.se = true;
                            }
                        }
                    }
                }
            }

            if (0 <= adjacent.n && adjacent.n < 81) {
                if (!this.walls[adjacent.n].s) {
                    if (this.walls[adjacent.n].w) {
                        if (0 <= adjacent.w < 81 && !this.walls[adjacent.w].e) {
                            if (this.walls[adjacent.w].n) {
                                corner.nw = true;
                            }
                        }
                    }
                }
            }
            if (0 <= adjacent.s && adjacent.s < 81) {
                if (!this.walls[adjacent.s].n) {
                    if (0 <= adjacent.w && adjacent.w < 81) {
                        if (this.walls[adjacent.s].w) {
                            if (0 <= adjacent.w < 81 && !this.walls[adjacent.w].e) {
                                if (this.walls[adjacent.w].s) {
                                    corner.sw = true;
                                }
                            }
                        }
                    }
                }
            }

            corners.push(corner);
        };
        this.corners = corners;
    };

    drawCorners(ctx) {
        if (this.corners.length === 0) {
            this.getCorners();
        }

        let wallOffset = this.gridWidth / 85;
        let currIndex = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.corners[currIndex].ne) {
                    ctx.moveTo(((this.gridWidth / 9 * j) + (this.gridWidth / 9)) - wallOffset, ((this.gridHeight / 9) * i));
                    ctx.lineTo((((this.gridWidth / 9) * j) + (this.gridWidth / 9) - wallOffset), (((this.gridHeight / 9) * i) + wallOffset));
                    ctx.lineTo((((this.gridWidth / 9) * j) + (this.gridWidth / 9)), (((this.gridWidth / 9) * i) + wallOffset));
                    ctx.stroke();
                }
                if (this.corners[currIndex].se) {
                    ctx.moveTo((((this.gridWidth / 9) * j) + (this.gridWidth / 9)), (((this.gridHeight / 9) * i) + ((this.gridHeight / 9)) - wallOffset));
                    ctx.lineTo((((this.gridWidth / 9) * j) + (this.gridWidth / 9) - wallOffset), (((this.gridHeight / 9) * i) + ((this.gridHeight / 9)) - wallOffset));
                    ctx.lineTo((((this.gridWidth / 9) * j) + (this.gridWidth / 9) - wallOffset), (((this.gridHeight / 9) * i) + ((this.gridHeight / 9))));
                    ctx.stroke();
                }
                if (this.corners[currIndex].nw) {
                    ctx.moveTo(((this.gridWidth / 9 * j) + wallOffset), ((this.gridHeight / 9) * i))
                    ctx.lineTo(((this.gridWidth / 9 * j) + wallOffset), ((this.gridHeight / 9) * i) + wallOffset)
                    ctx.lineTo((this.gridWidth / 9 * j), (this.gridHeight / 9 * i) + wallOffset)
                    ctx.stroke();
                }
                if (this.corners[currIndex].sw) {
                    ctx.moveTo((((this.gridWidth / 9) * j)), (((this.gridHeight / 9) * i) + ((this.gridHeight / 9)) - wallOffset))
                    ctx.lineTo((((this.gridWidth / 9) * j) + wallOffset), (((this.gridHeight / 9) * i) + ((this.gridHeight / 9)) - wallOffset))
                    ctx.lineTo((((this.gridWidth / 9) * j) + wallOffset), (((this.gridHeight / 9) * i) + ((this.gridHeight / 9))))
                    ctx.stroke();
                }


                currIndex++;
            }
        }
    };
};
