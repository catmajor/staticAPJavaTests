const timelineWrapper = document.getElementById("timelinewrapper");
const timeline = document.getElementById("timeline");
const pageNodeList = document.querySelectorAll(".content");
const pageHeight = document.getElementById("fake-main");
const bodyMain = document.querySelector("main");
const contentPagesNodeList = document.querySelectorAll("main .content");

let scrollAmt = 0;
let dateList = [];

function parseSubDates(date, node) {
  let string = `${node.getAttribute("sub-dates")}`.trim();
  if (string[string.length-1] == ",") string = string.substring(0, string.length-1);
  let subDates = string.split("],");
  subDates = subDates.map(ele => {
    let temp = ele.trim();
    temp = temp.substring(1, ele.length - 1);
    temp = temp.split(",");
    if (temp[1][0]===" ") temp[1] = temp[1].substring(1, temp[1].length-1)
    return temp;
  });
  let lengthHalf = Math.floor(subDates.length/2);
  for (let i = 0; i < lengthHalf; i++) {
    date.addTopSubDate(subDates[i][0], subDates[i][1]);
  }
  for (let i = lengthHalf; i < subDates.length; i++) {
    date.addBottomSubDate(subDates[i][0], subDates[i][1]);
  }
}
class DateMarker {
  #date = null;
  #description = null;
  constructor(page, index, date = "", description = "") {
    this.domEle = document.createElement("div");
    this.domEle.classList.add("time");
    timeline.appendChild(this.domEle);
    this.index = index;
    this.domParent = timeline;
    this.date = date || page.getAttribute("date");
    this.description = description || page.getAttribute("description");
    this.topSubDates = [];
    this.bottomSubDates = [];
    if (page.getAttribute("sub-dates")) {
      parseSubDates(this, page);
    }
  }
  set date(x) {
    if (!this.#date) this.#date = document.createElement("p");
    this.#date.textContent = x;
    this.#date.classList.add("date");
    this.domEle.appendChild(this.#date);
  }
  set description(x) {
    if (!this.#description) this.#description = document.createElement("p")
    this.#description.textContent = x
    this.#description.classList.add("description")
    this.domEle.appendChild(this.#description)
  }
  get date() {
    return this.#date.textContent;
  }
  get description() {
    return this.#description.textContent;
  }
  setValues(date, description) {
    this.date = date;
    this.description = description;
  }
  subDateOpacity(x) {
    this.topSubDates.forEach((ele) => {
      ele.opacity = x
    })
    this.bottomSubDates.forEach((ele) => {
      ele.opacity = x
    })
  }
  set marginTop(x) {
    this.marginTopVar = x
    this.domEle.style.marginTop = `${x}px`
  }
  get marginTop() {
    return this.marginBottomVar
  }
  addTopSubDate(date, description) {
    this.topSubDates.push(new SubDate(this.domEle, document.createElement("div"), this.topSubDates.length, date, description, top))
  }
  addBottomSubDate(date = "", description = "") {
    this.bottomSubDates.push(new SubDate(this.domEle, document.createElement("div"), this.bottomSubDates.length, date, description, top))
  }
  spaceSubDates() {
    this.topSubDates.forEach(ele => {
      ele.setTop(this.topSubDates.length)
    })
    this.bottomSubDates.forEach(ele => {
      ele.setBottom(this.bottomSubDates.length)

    })
  }
  resizeUpdate() {
    this.spaceSubDates();
  }
  setSubDateValues(top, index, date, description) {
    if (top) {

    } else {

    }
  }
}
class SubDate {
  constructor(dateDom, domEle, index, date = "", description = "", top) {
    this.dateDom = dateDom
    this.domEle = domEle
    this.index = index
    this.dateDom.appendChild(this.domEle)
    this.domEle.classList.add('subdate')
    this.type = top
    this.date = null
    this.setDate(date)
    this.description = null
    this.setDescription(description)
  }
  set opacity(x) {
    this.domEle.style.opacity = x;
  }
  get opacity() {
    return this.domEle.style.opacity
  }
  setTop(totalLength) {
    let topMargin = (window.innerHeight / (totalLength + 1) * (1 + this.index) - window.innerHeight) / 2 + 5
    this.domEle.style.top = !this.domEle.classList.contains("hidden") ? topMargin : 0
  }
  setBottom(totalLength) {
    let topMargin = (window.innerHeight / (totalLength + 1) * (1 + this.index)) / 2 + 5
    this.domEle.style.top = !this.domEle.classList.contains("hidden") ? topMargin : 0
  }
  setValues(date, description) {
    this.setDate(date)
    this.setDescription(description)
  }
  setDate(x) {
    if (!this.date) this.date = document.createElement("p")
    this.date.textContent = x
    this.date.classList.add("date")
    this.domEle.appendChild(this.date)
  }
  setDescription(x) {
    if (!this.description) this.description = document.createElement("p")
    this.description.textContent = x
    this.description.classList.add("description")
    this.domEle.appendChild(this.description)
  }
}
class Page {
  constructor(domEle, index) {
    this.domEle = domEle;
    this.index = index;
    this.topMargin = window.innerHeight * (index + 1);
    this.domEle.style.marginTop = this.topMargin;
    this.domEle.style.height = window.innerHeight;
    this.scrolling = true;
    let topmargin = this.topMargin - document.body.scrollTop;
    let scroll;
    if (topmargin <= 0) {
      scroll = -window.innerHeight / 4
    } else {
      scroll = this.topMargin - scrollAmt - window.innerHeight / 4
    }
    this.domEle.style.marginTop = scroll + window.innerHeight / 4
  }
  scroll(scrollAmt) {
    let topmargin = this.topMargin - scrollAmt;
    this.updateOpacity(topmargin);
    if (this.scrolling) {
      this.domEle.style.marginTop =  this.topMargin - scrollAmt;;
    }
  }
  set opacity(x) {
    dateList.forEach((ele) => {
      ele.subDateOpacity(x)
    })
    this.domEle.style.opacity = x
  }
  get opacity() {
    return this.domEle.style.opacity
  }
  updateOpacity (topmargin) {
    if (topmargin <= 0) {
      if (this.scrolling) {
        this.scrolling = false
        this.domEle.style.marginTop = 0;
        contentPagesNodeList[this.index].classList.add("hidden");
      }
    } else if (topmargin > 0&&this.scrolling === false) {
      this.scrolling = true;
      contentPagesNodeList[this.index].classList.remove("hidden");

    }
  }
  resizeUpdate() {
    this.topMargin = window.innerHeight * (this.index + 1);
     this.domEle.style.height = window.innerHeight;
  }
}


intro = new DateMarker(pageNodeList[0])
intro.date = "Intro";

for (let i = 1; i < pageNodeList.length; i++) {
  let temp = new DateMarker(pageNodeList[i], i - 1)
  dateList.push(temp)
}

let contentPages = []

for (let i = 1; i < contentPagesNodeList.length; i++) {
  let temp = new Page(contentPagesNodeList[i], i - 1)
  contentPages.push(temp)
}

let baseMargin;


function repositionDates(mT, time) {
  dateList.forEach((ele, ind) => {
    ele.domEle.style.transition = `${time}s margin-top, 0.3s background-color`
    ele.marginTop = mT;

  })
}

function repositionPages(scroll) {
  contentPages.forEach((ele, ind) => {
    ele.scroll(scroll)
  })
}

function triggerPageOpacityUpdate() {
  contentPages.forEach((ele, ind) => {
    ele.updateOpacity(document.body.scrollTop)
  })
}

repositionDates(baseMargin, 1);
triggerPageOpacityUpdate();
repositionPages(document.body.scrollTop);



let scrolled = false

function onResize(e = null) {
  baseMargin = (window.innerHeight * 3 / 4) / (pageNodeList.length) - 40;
  timeline.style.height = `${window.innerHeight * dateList.length + window.innerHeight * 3 / 4}px`
  timeline.style.marginTop = `${window.innerHeight / 4}px`
  pageHeight.style.height = `${window.innerHeight * pageNodeList.length}px`;
  if (!scrolled) repositionDates(baseMargin, 0.3);
  else {
    repositionDates(window.innerHeight - 40, 0.5);
    dateList[0].marginTop = window.innerHeight * 5 / 4 - 45;
       }
  contentPages.forEach(ele => {
    ele.resizeUpdate()
  });
  dateList.forEach(ele => {
    ele.resizeUpdate();
  });
  repositionPages(document.body.scrollTop);
  triggerPageOpacityUpdate();
}

onResize();
window.addEventListener("resize", onResize);


window.addEventListener("scroll", e => {

  scrollAmt = document.body.scrollTop
  if (scrollAmt <= window.innerHeight / 4) {
    if (scrolled) {
      scrolled = false
      for (const date of dateList) {
        date.subDateOpacity(0);
      }
      repositionDates(baseMargin, 0.25)


    }

  } else {
    if (!scrolled) {
      scrolled = true
      repositionDates(window.innerHeight-40, 0.5)
      dateList[0].marginTop = window.innerHeight * 5 / 4 - 45
      for (const date of dateList) {
        date.subDateOpacity(1);
        date.spaceSubDates();
      }
    }
  }

  repositionPages(scrollAmt)
})

matrixRain("medium");