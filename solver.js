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
        console.log('attempting to solve: ', this.grid);
    }
}

class Rule {
    constructor(title, level) {
        this.title = title;
        this.level = level;
        this.check = () => console.log('check function not implemented for ', this.title);
        this.addPencil = () => console.log('add pencil function not inmplemented for ', this.title);
    }

    set check(func) {
        this.check = func;
    }

    set addPencil(func) {
        this.addPencil = func;
    }

    get check() {
        return this.check;
    }
    
    get addPencil() {
        return this.addPencil;
    }
}





