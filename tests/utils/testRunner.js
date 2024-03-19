class TestRunner {
  #tabs;
  #enabledTests;
  #output = null;
  constructor (tests, tabs) {
    this.#enabledTests = {};
    Object.keys(tests).forEach(testName => {if (tests[testName]) this.#enabledTests[testName] = true;});
    this.#tabs = tabs;

  }
  run () {
    this.#output = {enabledTests: this.#enabledTests, testOutput: []}
    this.#tabs.forEach(tab => {
      let tabOutput = {};
      tabOutput.name = tab.name;
      let tabLines = tab.text.split("\n");
      Object.keys(this.#enabledTests).forEach(test => {
        switch (test) {
          case "indentTest":
            tabOutput.indentTest = indentTest(tabOutput.name, tabLines);
            break;
          case "scannerTest":
            tabOutput.scannerTest = scannerTest(tabOutput.name, tabLines);
            break;
          case "commentTest":
            tabOutput.commentTest = commentTest(tabOutput.name, tabLines);
            break;
          case "charTest":
            tabOutput.charTest = charTest(tabOutput.name, tabLines);
            break;
        }
      });
      this.#output.testOutput.push(tabOutput);
    })
  }
  get output () {
    if (!this.#output) this.run();
    return this.#output
  }
}