import Rule from "./rule.js";

class Solver {
    constructor(grid, level, ruleBank) {
        this.previousState = [];
        this.nextState = [];
        this.originalState = grid;
        this.level = level;
        this.ruleBank = ruleBank;
        this.knownRules = [];
    }


    getKnownRules() {
        this.knownRules = this.ruleBank[this.level];
    }

    solve() {
        console.log('attempting to solve: ', this.grid);
    }
}



console.log(Rule)
const myRule = new Rule('myRule', 'easy')
console.log('created myRule', myRule)
myRule.check()
myRule.addPencil()

myRule.check = (grid) => {for (let cell of grid) { console.log('newcheck fun', cell)}}
myRule.check = (arg) => console.log(arg)
myRule.check('arg')
const mySolver = new Solver([0, 0, 0], 'easy', {"easy": myRule})
console.log(mySolver)




