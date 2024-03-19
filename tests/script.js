function main() {
  const root = document.querySelector(":root");
  const urlParams = new URLSearchParams(window.location.search);
  const indent = urlParams.get('indent')==="true";
  const scanner = urlParams.get('scanner') ==="true" ;
  const comment = urlParams.get('comment') ==="true";
  const char = urlParams.get('char') ==="true" ;
  const checkboxesNodeList = document.querySelectorAll(".checkbox");
  const checkboxes = new Array(checkboxesNodeList.length);
  function TestList () {
    this.indent = checkboxes[0];
    this.scanner = checkboxes[1];
    this.comment = checkboxes[2];
    this.char = checkboxes[3];
    this.tests = [this.indent, this.scanner, this.comment, this.char];
    this.indent.setState(indent);
    this.scanner.setState(scanner);
    this.comment.setState(comment);
    this.char.setState(char);
  }
  function checkBox (boxDom, ind) {
    this.dom = boxDom;
    this.state = false;
    this.dom.addEventListener("mousedown", () => {
      this.setState(!this.state);
    });
    this.setState = (state) => {
      this.state = state;
      if (state) {
        this.dom.style.backgroundColor = "#00ff00";
      } else {
        this.dom.style.backgroundColor = "#ff0000";
      }
    }
  }
  checkboxesNodeList.forEach((box, ind) => {
    checkboxes[ind] = new checkBox(box, ind);
  });
  const tabsDOM = document.getElementById("tabs");
  const textAreaWrapper = document.getElementById("text-area");
  const textArea = document.getElementById("input");
  const lineNumber = document.getElementById("lines");
  const tabList = [];
  let selectedTab = null;
  const addButton = document.getElementById("add-button");
  function updateTabs () {
    const simpleTabArr = tabList.map(ele => ele.simplify());
    localStorage.setItem("tabs", JSON.stringify(simpleTabArr));
  }
  function createTabs () {
    let tabs = JSON.parse(localStorage.getItem("tabs"));
    if (tabs&&tabs?.length!==0) {
      tabs.forEach((tabEle) => {
        new tab(tabEle[0], tabEle[1]);
      });
    }
    if (tabList.length===0) {
      new tab();
    }
    tabList[0].select();
  }
  createTabs();
  function tab (name = null, textAreaContent = null) {
    const private = {};
    private.dom = document.createElement("div");
    private.dom.classList.add("tab");
    private.wrapper = document.createElement("div");
    private.wrapper.classList.add("tab-content-wrapper");
    private.editInputWrapper = document.createElement("div");
    private.editInputWrapper.classList.add("input-wrapper");
    private.editInput = document.createElement("input");
    private.editInput.classList.add("edit-input");
    private.name = document.createElement("span");
    private.name.classList.add("name");
    private.edit = document.createElement("span");
    private.edit.classList.add("edit");
    private.delete = document.createElement("span");
    private.delete.classList.add("delete");
    private.editInputWrapper.appendChild(private.editInput);
    private.wrapper.appendChild(private.editInputWrapper);
    private.wrapper.appendChild(private.name);
    private.wrapper.appendChild(private.edit);
    private.wrapper.appendChild(private.delete);
    private.dom.appendChild(private.wrapper);
    tabsDOM.insertBefore(private.dom, addButton);
    tabList.push(this);
    private.name.textContent = name ?? "Main" + (tabList.length===1?"":(tabList.length-1)) + ".java";
    private.nameless = true;
    private.edit.innerHTML = '&#9998;';
    private.delete.textContent = "X";
    this.textAreaContent = textAreaContent ?? "//Code Here";
    this.prevContent = null;
    this.edit = (e) => {
      e.stopPropagation()
      private.editInput.value = private.name.textContent;
      private.dom.classList.add("editing");
      private.editInput.focus({focusVisible: true});
    }
    this.onEdit = () => {
      private.name.textContent = private.editInput.value;
    }
    this.finishEdit = () => {
      let javaIndex = private.editInput.value.indexOf(".java")
      private.name.textContent = private.editInput.value.substring(0, javaIndex!==-1?javaIndex:private.editInput.value.length) + ".java";
      private.dom.classList.remove("editing");
      updateTabs();
    }
    this.destructor = (e) => {
      e?.stopPropagation()
      tabsDOM.removeChild(private.dom);
      let index = tabList.indexOf(this);
      tabList.splice(index, 1);
      if (tabList.length === 0) {
        new tab();
      } else {
        console.log(tabList)
        tabList[index-1].select();
      }
      updateTabs();
    }
    this.simplify = () => {
      const values = [private.name.textContent, this.textAreaContent];
      return values;
    }
    this.select = () => {
      selectedTab?.unselect();
      selectedTab = this;
      private.dom.classList.add("selected");
      textArea.value = this.textAreaContent;
      setLines(analyzeText(textArea.value));
    }
    this.unselect = () => {
      private.dom.classList.remove("selected");
    }
    private.dom.addEventListener("click", this.select)
    private.edit.addEventListener("click", this.edit);
    private.editInput.addEventListener("focusout", this.finishEdit);
    private.editInput.addEventListener("change", this.onEdit);
    private.delete.addEventListener("click", this.destructor);
    updateTabs();
  }
  addButton.addEventListener("mousedown", () => {
    new tab();
    tabList[tabList.length-1].select();
  });
  function analyzeText (text) {
    let height = text.split(/\r*\n/g).length || 1;
    textArea.style.height = `${height * 16}px`;
    return height;
  }
  function setLines (number) {
    let string = "";
    for (let i = 1; i<=number; i++) {
      string += i + "<br>";
    }
    lineNumber.innerHTML = string;
  }
  textAreaWrapper.addEventListener("click", () => textArea.focus());
  textArea.addEventListener("focus", ()=> {
    textAreaWrapper.classList.add("focused");
  });
  textArea.addEventListener("focusout", ()=> {
    textAreaWrapper.classList.remove("focused");
  });
  textArea.addEventListener("input", ()=>{
    setLines(analyzeText(textArea.value));
    selectedTab.textAreaContent = textArea.value;
    updateTabs();
  });
  const testOutputButton = document.getElementById("test-output-button");
  const testOutputContainer = document.getElementById("test-output-container");
  const testOutputBody = document.getElementById("test-output");
  document.documentElement.style.setProperty("--window-width", `${window.innerWidth}px`);
  let testOutputOpen = false;
  const testList = new TestList();
  let rootTimeout = null;
  function createTestOutput (json) {
    let overallFail = false;
    let overallPartial = false;
    function File (json) {
      if (this===window) throw "create with new";
      function Test (name, json, lineNumMatters = false) {
        if (this===window) throw "create with new";
        function Fail (json) {
          if (this===window) throw "create with new";
          const fail = {};
          console.log(json)
          fail.dom = document.createElement("div");
          fail.dom.classList.add("fail");
          fail.dom.textContent = (lineNumMatters?("Line " + json.lineNum + ": "):"") + json.text;
          test.dom.appendChild(fail.dom);
        }
        const test = {};
        test.open = false;
        test.dom = document.createElement("div");
        test.dom.classList.add("test-result");
        test.text = document.createElement("div");
        test.text.classList.add("text");
        test.openTest = document.createElement("p");
        test.openTest.innerHTML = "&#9655";
        test.testName = document.createElement("p");
        test.testName.textContent = name;
        test.text.appendChild(test.openTest);
        test.text.appendChild(test.testName);
        test.dom.appendChild(test.text);
        file.dom.appendChild(test.dom);
        if (json[0]===false) test.dom.classList.add("pass");
        else {
          test.text.addEventListener("click", ()=> {
            if (test.open) {
              test.dom.classList.remove("open");
              test.open = false;
              test.openTest.innerHTML = "&#9655";
            } else {
              test.dom.classList.add("open");
              test.open = true;
              test.openTest.innerHTML = "&#9661";
            }
          });
          json.forEach(fail => {
            new Fail(fail);
          });
        }
      }
      let fails = false;
      let partial = false;
      Object.keys(json).forEach((key) => {
        if (key.includes("Test")) {
          if(json[key][0]===false) {
            partial = true;
            overallPartial = true;
          } else {
            fails = true;
            overallFail = true;
          }
        };
      });
      const file = {};
      file.open = false;
      file.dom = document.createElement("div");
      file.dom.classList.add("tab-test-result");
      if (!fails) file.dom.classList.add("pass");
      if (partial&&fails) file.dom.classList.add("partial");
      file.text = document.createElement("div");
      file.text.classList.add("text");
      file.openOutput = document.createElement("p");
      file.openOutput.innerHTML = "&#9655;";
      file.fileName = document.createElement("p");
      file.fileName.textContent = json.name;
      file.text.appendChild(file.openOutput);
      file.text.appendChild(file.fileName);
      file.dom.appendChild(file.text);
      testOutputBody.appendChild(file.dom);
      file.text.addEventListener("click", ()=> {
        if (file.open) {
          file.dom.classList.remove("open");
          file.openOutput.innerHTML = "&#9655";
          file.open = false;
        } else {
          file.dom.classList.add("open");
          file.openOutput.innerHTML = "&#9661";
          file.open = true;
        }
      });
      Object.keys(json).forEach((key) => {
        switch(key) {
          case "indentTest":
            new Test("Indent Test", json[key], true);
            break;
          case "scannerTest":
            new Test("Scanner Test", json[key], false);
            break;
          case "charTest":
            new Test("Char Test", json[key], true);
            break;
          case "commentTest":
            new Test("Comment Test", json[key],false);
            break;
        }
      });
    }
    json.testOutput.forEach((fileContent) => {
      new File(fileContent);
    });
    if (overallFail) {
      console.log("hi");
      root.classList.add("fail-anim");
      if (overallPartial) {
        root.classList.add("partial");
        rootTimeout = setTimeout(() => {
          root.classList.remove("partial");
          rootTimeout = null;
        }, 1500);
      } else {
        root.classList.add("fail");
        rootTimeout = setTimeout(() => {
          root.classList.remove("fail");
          rootTimeout = null;
        }, 1500)
      }
    }
  }
  function closeTestOutput () {
    document.body.classList.remove("open-testoutput");
    testOutputButton.textContent = "Click to Run Tests";
    root.classList.remove("fail-anim");
    root.style.animation = "";
    if (rootTimeout) {
      root.classList.remove("partial");
      root.classList.remove("fail");
      clearTimeout(rootTimeout);
      rootTimeout = null;
    }
  }
  let prevResponse = null;
  function openTestOutput () {
    testOutputBody.innerHTML = "";
    document.body.classList.add("open-testoutput");
    testOutputButton.textContent = "Click to Close Test Output";
    let tabDifferent = false
    tabList.forEach(tab => {
      if (tab.prevContent !== tab.textAreaContent) {
        tabDifferent = true;
        tab.prevContent = tab.textAreaContent;
      }
    });
    if (tabDifferent||
        prevResponse?.testOutput.length!==tabList.length||
        prevResponse?.enabledTests.indentTest!=testList.indent.state||
        prevResponse?.enabledTests.scannerTest!=testList.scanner.state||
        prevResponse?.enabledTests.commentTest!=testList.comment.state||
        prevResponse?.enabledTests.chareTest!=testList.char.state
       ) {
      runTests();
    } else {
      createTestOutput(prevResponse);
    }
  }
  async function runTests() {
    if (!(testList.indent.state||testList.scanner.state||testList.char.state||testList.comment.state)) {
      alert("Please select at least one test");
      return;
    }
    const body = {
      enabledTests: {
        indentTest: testList.indent.state,
        scannerTest: testList.scanner.state,
        commentTest: testList.comment.state,
        charTest: testList.char.state,
      },
      tabs: tabList.map(ele => {
        let simplified = ele.simplify()
        return {name: simplified[0], text: simplified[1]}
      })
    };
    const runner = new TestRunner(body.enabledTests, body.tabs);
    prevResponse = runner.output;
    createTestOutput(runner.output);
  }
  testOutputButton.addEventListener("click", ()=> {
    if (testOutputOpen) {
      closeTestOutput();
    } else {
      openTestOutput();
    }
    testOutputOpen = !testOutputOpen;
  });
  window.addEventListener("resize", () => {
    document.documentElement.style.setProperty("--window-width", `${window.innerWidth}px`)
  })
  setTimeout(() => {matrixRain("minimal")}, 2000);
}
main();
//alert(`${indent}, ${scanner}, ${comment}, ${char}`);

//Indent, scanner, comment, char