//Tomas made this one
function scannerTest(fileName, fileLines) {
  const fails = new TotalFails(fileName);
  let lines = [...fileLines];
  let a = "";
  let closed = false;
  let scannerLine = -1;
  for(let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    lines[lineNumber] = lines[lineNumber].replace(/[\s\t ]/g, "");
    if((lines[lineNumber].length > 7 && lines[lineNumber].substring(0, 7)==="Scanner") || (lines[lineNumber].length >12 && lines[lineNumber].substring(0,13)==="final Scanner")){
      let eqind = lines[lineNumber].indexOf("=");
      if(eqind == -1){
        eqind = lines[lineNumber].indexOf(";");
      }
      a = lines[lineNumber].substring(lines[lineNumber].indexOf("Scanner")+7, eqind);
      scannerLine = lineNumber;
      break;
    }
  }
  if(scannerLine == -1){
    fails.add(0, "Scanner not initialized");
  } else {
    for(let q = scannerLine; q<lines.length; q++){
      if(lines[q].trim().startsWith(a+".close()")){
        closed = true
      }
    } 
    if (!closed) fails.add(scannerLine, "Scanner not closed");
  }
  return fails.fails;
}
