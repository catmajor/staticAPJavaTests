function matrixRain(frequency) {
  const dom = document.createElement("div");
  let dropletCount = 0;
  let clearingCount = 0;
  let redOnScreen = false;
  dom.setAttribute("id", "matrix-rain");
  document.body.appendChild(dom);
  const availableChars = /*"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789=*+-<>"*/ "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ012345789Z:・.\"=*+-<>¦çﾘｸ"
  function RainDrop(_startFrame, color = null) {
    if (this===window) throw "RainDrop must be called as a constructor";
    function Droplet(parent) {
      if (this===window) throw "Droplet must be called as a constructor";
      private.dropletArr[private.newestDropletIndex] = this;
      this.index = private.newestDropletIndex++;
      this.dom = document.createElement("div");
      this.text = document.createElement("p");
      this.dom.classList.add("matrix-rain-droplet");
      parent.dom.appendChild(this.dom);
      this.dom.appendChild(this.text);
      this.dom.style.top = `${private.top}px`;
      this.dom.style.left = `${private.left}px`;
      this.text.textContent = parent.text.textContent;
      this.text.style.transform = `scale(${private.transform1}, ${private.transform2})`;
      this.dom.style.fontSize = `${private.size}px`;
      this.text.style.fontSize = `${private.size}px`;
      this.dom.style.animationDuration = `${private.fadeSpeed}s`
      this.potentialSwitchTimeout = null;
      this.switchesTried = 0;
      this.potentialSwitch = () => {
        this.potentialSwitchTimeout = setTimeout(()=>{
          if (Math.floor(Math.random()*4)===0) {
            this.text.textContent = availableChars[Math.floor(Math.random()*availableChars.length)];
          }
          this.switchesTried++;
          if (this.switchesTried = 8) {
            clearTimeout(this.potentialSwitchTimeout);
            return
          };
          this.potentialSwitch();
          return;
        }, 750); 
      }
      this.potentialSwitch();
      setTimeout(() => {
        clearTimeout(this.potentialSwitchTimeout);
        this.destructor();
      }, private.fadeSpeed*1000);
      let destructorCalled = false;
      this.destructor = () => {
        if (destructorCalled) return;
        destructorCalled = true;
        private.dropletArr[this.index] = null;
        parent.dom.removeChild(this.dom);
        this.text = null;
        this.dom = null;
        clearTimeout(this.potentialSwitchTimeout);
      }
    }
    dropletCount++;
    let private = {};
    private.index = rainDropArr.add(this);
    private.size = Math.floor(Math.random()*25+45);
    private.top = -2*private.size;
    private.left = Math.floor(Math.random()*window.innerWidth);
    private.speed = Math.floor(Math.random()*15+20);
    private.fadeSpeed = Math.floor(Math.random()*10+10)
    private.framePrintInterval = Math.floor(private.size/private.speed);
    if (private.framePrintInterval===0) private.framePrintInterval = 1;
    private.switchInterval = Math.floor(Math.random()*4+8);
    private.startFrame = _startFrame;
    this.chars = new Array();
    this.dom = document.createElement("div");
    if (color!=null) this.dom.style.setProperty("--final-color", color);
    else {
      if (!redOnScreen&&Math.floor(Math.random()*20)===0) {
        this.dom.style.setProperty("--final-color", "#ff0000");
        redOnScreen = true;
        this.redColor = true;
      };
    }
    this.dom.style.top = `${private.top}px`;
    this.dom.style.left = `${private.left}px`;
    this.text = document.createElement("p");
    this.dom.appendChild(this.text);
    this.dom.style.fontSize = `${private.size}px`;
    dom.appendChild(this.dom);
    this.dom.classList.add("matrix-rain-rainDrop");
    this.text.textContent = availableChars[Math.floor(Math.random()*availableChars.length)]
    private.maxFall = (Math.floor(Math.random()*1.5)===0?window.innerHeight-Math.floor(Math.random()*window.innerHeight/2):window.innerHeight)-private.size;
    private.maxDropletCount = Math.ceil(private.maxFall / (private.framePrintInterval * private.speed));
    private.dropletArr = new Array(private.maxDropletCount);
    private.newestDropletIndex = 0;
    private.transform1 = -1;
    private.transform2 = -1;
    this.setTop = (px) => {
      this.dom.style.top = `${px}px`;
      private.top = px;
    }
    let destructorCalled = false;
    let clearingIndex = null;
    this.destructor = (frame = 0, safeClear = false) => {
      if (destructorCalled) return;
      dropletCount--;
      clearingCount++;
      destructorCalled = true;
      rainDropArr.array[private.index] = null;
      clearingIndex = clearingArr.add(this);
      if (safeClear&&dropletCount === 0&&(dropletCount+clearingCount<maxAmount)) {
        new RainDrop(frame);
      }
      this.dom.removeChild(this.text);
      if (this.redColor) redOnScreen = false;
      setTimeout(() => {
        clearingCount--;
        dom.removeChild(this.dom);
        this.text = null;
        this.dom = null;
        private = null;
        this.chars = null;
        clearingArr.array[clearingIndex] = null;
      }, private.fadeSpeed*1000)
    }
    this.clearDroplets = () => {
      private.dropletArr?.forEach(ele => ele?.destructor());
    }
    this.callAction = async (frame) => {
      try {
        this.setTop(private.top+private.speed);
        let frameSinceCreation = private.startFrame-frame;
        if (frameSinceCreation%private.framePrintInterval===0) {
          this.text.textContent = availableChars[Math.floor(Math.random()*availableChars.length)];
          private.transform1 = Math.floor(Math.random()*2)===0?-1:1;
          private.transform2 = Math.floor(Math.random()*2)===0?-1:1;
          this.text.style.transform = `scale(${private.transform1}, ${private.transform2})`
          private.dropletArr.push(new Droplet(this));
        }
        if (private.top >= private.maxFall) {
          this.destructor(frame, true);
        }
      } catch (e) {
        throw e;
      }

    }
  }
  function ArrayManager() {
    this.array = new Array(0);
    this.add = (item) => {
      let index = 0;
      for (const ele of this.array) {
        if (ele===null) {
          this.array[index] = item;
          return index;
        }
        index++;
      }
      this.array.push(item);
      return this.array.length - 1;
    }
    this.clear = () => {
      for (let i = 0; i < this.array.length; i++) {
        this.array[i] = null;
      }
    }
  }
  const rainDropArr = new ArrayManager();
  const clearingArr = new ArrayManager();
  let frame = 0;
  let maxRate;
  let slope;
  let maxAmount = null;
  switch (frequency) {
    case "minimal":
      maxRate = 30;
      slope = 1
      maxAmount = 8;
      break;
    case "low":
      maxRate = 15;
      slope = 1;
      maxAmount = 16;
      break;
    case "medium":
      maxRate = 10;
      slope = 1.5;
      maxAmount = 32;
      break;
    case "high":
      maxRate = 3;
      slope = 2;
      break
    default: 
      throw "Specify frequency for rain";
  }
  new RainDrop(frame);
  let calculatedLengthChance = (3+Math.E**4);
  function animate () {
    rainDropArr.array.forEach(async (drop) => {
      if (drop) drop.callAction(frame);
    });
    if (Math.floor(Math.random()*calculatedLengthChance)===0) {
      console.log(dropletCount, maxAmount)
      if (!maxAmount||((dropletCount+clearingCount)<maxAmount)) {
        new RainDrop(frame);
        calculatedLengthChance = (maxRate+Math.E**(-slope*(dropletCount+clearingCount-4)))
      }
    }
    frame++;
  }
  let animation = setInterval(animate, 100);
  window.addEventListener("visibilitychange", () => {
    if (animation) {
      clearInterval(animation);
      animation = null;
      frame = 0;
      rainDropArr.array.forEach(ele => {
        if (ele) {
          ele.clearDroplets();
          ele?.destructor();
        }
      });
      clearingArr.array.forEach(ele => {
        if (ele) {
          ele.clearDroplets();
          ele?.destructor();
        }
      });
      rainDropArr.clear();
      clearingArr.clear();
      dropletCount = 0;
      clearingCount = 0;
    } else {
      animation = setInterval(animate, 100);
      new RainDrop(frame);
    }
  });
}