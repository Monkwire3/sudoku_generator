import Rule from "./rule.js";

class Solver {
    constructor(grid, knownRules) {
        this.knownRules = knownRules;
        this.originalState = grid;
        this.previousState = [];
        this.nextState = [];
    }

    solve() {
        console.log('Beginning solve attempt')
        for (let r of this.knownRules) {
            r.check(this.grid);
        }
        console.log('Ending solve attempt')
    }

}



const myRule = new Rule('myRule', 'easy')
const mySolver = new Solver([0, 0, 0], [myRule])
mySolver.solve()




