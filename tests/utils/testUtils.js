class TotalFails {
  #fails = [];
  #fileName;
  constructor(fileName) {
    this.#fails = [];
    this.#fileName = fileName
  }
  add (lineNum, text, params = {}) {
    this.#fails.push(new Fail(lineNum, text, params.warning));
  }
  get fails () {
    return this.#fails!=0?this.#fails:[false];
  }
}

class Fail {
  #warn = false;
  constructor (lineNum = 0, text = "", warn = false) {
    this.text = text;
    this.lineNum = lineNum;
    this.#warn = (!!warn);
    if (this.#warn) this.warn = true;
  }
  get () {return this.text;}
  checkWarn () {return this.#warn}
}