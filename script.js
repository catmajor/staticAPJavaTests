function main () {
  function playFancyText() {
    const availableChars = "!\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    function cycleString() {
      cycleTextArr.forEach((ele) => ele.textContent = availableChars[Math.floor(Math.random()*availableChars.length)])
    }
    const finalText = ['A', 'P', 'J', 'a', 'v', 'a', 
                       '&nbsp;', 
                       'T', 'e', 's', 't', 's', 
                       '&nbsp;', 
                       'b', 'y', 
                       '&nbsp;', 
                       '\'', '2', '3', '-', '\'', '2', '4', 
                       '&nbsp;', 
                       'T', 'A', 's'
                      ];
    const fancyText = document.getElementById("fancy-text");
    let tempTextArr = new Array(finalText.length).fill('-');
    fancyText.innerHTML = tempTextArr.reduce((acc, ele, ind) => {
      return acc += `<span id="fancy-text-${ind}">-</span>`;
    }, "");
    tempTextArr = document.querySelectorAll("#fancy-text>span");
    let cycleTextArr = new Array(finalText.length);
    tempTextArr.forEach((ele, ind) => cycleTextArr[ind] = ele);
    let startInd = 0;
    let cycleCount = 0;
    const cycleInterval = setInterval(() => {
      cycleCount++;
      cycleString();
      if (cycleCount%5===0) {
        cycleTextArr[0].innerHTML = finalText[startInd];
        startInd++;
        cycleTextArr.shift();
        if (startInd > finalText.length - 1) clearInterval(cycleInterval);
      }
    }, 20);
  }
  playFancyText();
  setTimeout(() => {matrixRain("high")} ,2000);
}

main()