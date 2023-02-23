class Rule {
    constructor(title, level) {
        this.title = title;
        this.level = level;
    }

    check() {
        console.log('check function not implemented for ', this.title); 
    }

    addPencil() {
        console.log('add pencil function not inmplemented for ', this.title);
    }
}

export default Rule;