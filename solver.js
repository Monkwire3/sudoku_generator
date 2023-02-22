class Solver {
    constructor(grid, level, ruleBank) {
        this.knownRules = [];
        this.previousState = [];
        this.nextState = [];
        this.originalState = grid;
        this.level = level;
        this.ruleBank = ruleBank;
    }

    set level(newLevel) {
        this.level = newLevel;
        this.getKnownRules()
    }

    getKnownRules() {
        this.knownRules = this.ruleBank[this.level];
    }

    solve() {
        console.log('attempting to solve: ', this.grid)
    }
}

