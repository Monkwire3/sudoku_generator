class Grid {
    constructor(cells) {
        this.cells = cells
        this.groups = []
        this.addBasicGroups()
    }

    addGroup(group) {
        this.groups.push(group)
    }

    addBasicGroups() {
        for (let i = 0; i < 81; i++) {
            this.cells.push(i)
        }
        let rows = [];
        let cols = []
        let sqrs = [];

        for (let i = 0; i < Math.sqrt(this.cells.length); i++) {
            rows.push([])
            cols.push([])
            sqrs.push([])
        }

        for (let i = 0; i < Math.sqrt(this.cells.length); i++) {
            for (let j = 0; j < Math.sqrt(this.cells.length); j++) {
                rows[i].push(this.cells[(i * Math.sqrt(this.cells.length)) + j])
                cols[j].push(this.cells[(i * Math.sqrt(this.cells.length)) + j])
            }

        }
        for (let i = 0; i < this.cells.length; i++) {
            
        }
        for (let s of sqrs) {
            console.log(s)
        }


    }
}

const myGrid = new Grid([]);



export default Grid;