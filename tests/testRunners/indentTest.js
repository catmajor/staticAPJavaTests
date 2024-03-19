let conventionUsedEnum =  {
  NONE: 0,
  WITH_INDENT: 1,
  WITH_PARENTH: 2,
}

function indentTest(fileName, fileLines) {
  const fails = new TotalFails(fileName);
  let inMultilineComment = false;
  let braketInd = 0;
  let braceCount = 0;
  let parenthOpen = false;
  let lineNum = 0;
  let conventionUsed = conventionUsedEnum.NONE;
  let prevEndsWithSemicolon = true;
  for (line of fileLines) {
    lineNum++;
    if (line.trim().length == 0) continue;
    line = line.replace("\t", "    ");
    let trimLine = line.trim();
    let actualSpaces = 0;
    for (; actualSpaces < line.length; actualSpaces++) {
      if (line.charAt(actualSpaces)!=' ') break;
    }
    if (trimLine.includes("/*")) inMultilineComment = true;
    if (inMultilineComment) {
      if (actualSpaces!=braceCount*4
          &&
          !parenthOpen
         ) {
        fails.add(lineNum, "Indent for multiline comment incorrect");
      }
      else if (parenthOpen) {
          switch(conventionUsed) {
            case conventionUsedEnum.NONE:
              if (actualSpaces == braceCount*4+4) {
                conventionUsed = ConventionEnum.WITH_INDENT;
                break;
              } else if (actualSpaces == braketInd + 1) {
                conventionUsed = ConventionEnum.WITH_PARENTH;
                break;
              }
            case conventionUsedEnum.WITH_INDENT:
              if (actualSpaces == braceCount*4+4) {
              break;
              } else if (actualSpaces == braketInd + 1) {
                fails.add(lineNum, "Check indent for multiline comment, MAY not follow previous convention found in file", {warning: true});
                break;
              }
            case conventionUsedEnum.WITH_PARENTH:
              if (actualSpaces == braketInd + 1) {
                conventionUsed = ConventionEnum.WITH_PARENTH;
                break;
              } else if (actualSpaces == braceCount*4+4) {
                fails.add(lineNum, "Check indent for multiline comment, MAY not follow previous convention found in file", {warning: true});
                break;
              }
              fails.add(lineNum, "Indent for multiline comment incorrect");
              break;
          }
        }
      if (trimLine.includes("*/")) inMultilineComment = false;
      continue;
    }
    if (line.includes("{")&&line.includes("}")&&(line.indexOf("{")<line.indexOf("}"))) {
      //fail for too many brackets on one line
      fails.add(lineNum, "Should not contain an opener and closer bracket");
    }
    if (line.includes("}")) braceCount--;
    let expectedSpaces = braceCount*4;
    if (actualSpaces != expectedSpaces + (prevEndsWithSemicolon?0:4)) {
      //all of this can probably be combined into one big logic statement
      //but like why.
      if (parenthOpen&&(conventionUsed==conventionUsedEnum.NONE||conventionUsed==conventionUsedEnum.WITH_PARENTH||trimLine.charAt(0)!=')')) {
        switch(conventionUsed) {
          case conventionUsedEnum.NONE:
            if (actualSpaces == braceCount*4+4) {
              conventionUsed = conventionUsedEnum.WITH_INDENT;
              break;
            } else if (actualSpaces == braketInd + 1) {
              conventionUsed = conventionUsedEnum.WITH_PARENTH;
              break;
            }
          case conventionUsedEnum.WITH_INDENT:
            if (actualSpaces == braceCount*4+4) {
            break;
            } else if (
              actualSpaces == braketInd + 1
              ||
              (trimLine.charAt(0)==')'&&actualSpaces==braketInd)
            ) {
              fails.add(lineNum, "Check indent inside paranthesis MAY not follow convention found previously in file", {warning: true});
              break;
            }
          case conventionUsedEnum.WITH_PARENTH:
            if (
                (actualSpaces == braketInd + 1)
                ||
                (trimLine.charAt(0)==')'&&actualSpaces==braketInd)
               ) {
              conventionUsed = conventionUsedEnum.WITH_PARENTH;
              break;
            } else if (actualSpaces == braceCount*4+4) {
              fails.add(lineNum, "Check indent inside paranthesis MAY not follow convention found previously in file", {warning: true});
              break;
            }
            fails.add(lineNum, "Indent inside paranthesis incorrect");
        } 	
      } else if (trimLine.charAt(0)==')'&&actualSpaces==braketInd) {
        //pass case for closing paranthesis
      } else {
        fails.add(lineNum, "Incorrect indent");
        //fail case for incorrect indent
      }
    }

    if (line.includes("{")) braceCount++;
    if (line.indexOf('(')!=-1||line.indexOf(')')!=-1) {
      let slashCount = 0;
      let parenthCounter = 0;
      let inQuotation = false;
      for (let charNum = 0; charNum<line.length; charNum++) {
        let charAtInd = line.charAt(charNum);
        if (charAtInd == '"') inQuotation=!inQuotation;
        if (inQuotation) continue;
        if (charAtInd == '/') slashCount++;
        else slashCount = 0;
        if (slashCount == 2) break;
        if (charAtInd == '(') {
          braketInd = charNum;
          parenthCounter++;
        }
        if (charAtInd == ')') {
          parenthCounter--;
          if (parenthCounter == 0) {
            braketInd = 0;
          }
        }
      }
      if (parenthCounter>1) {
        parenthOpen = true;
        fails.add(lineNum, "Should not leave more than 1 parenthese left open");
        //fail case, too many open parenthesis	
      }
      if (parenthCounter==1) {
        if (parenthOpen) {
          fails.add(lineNum, "Should not contain nested parenthesis");
          //fail case -- should not have multiple nested multi-line
          //parenthesis blocks
      } else parenthOpen = true;
    }
    if (parenthCounter<=0) parenthOpen = false;
    }
    let trimLineCommentStripped = trimLine;
    if (trimLineCommentStripped.includes("//")&&!trimLineCommentStripped.startsWith("//")) {
      let slashCounter = 0;
      let quoteOpen = false;
      for (let charInd = 0; charInd < trimLineCommentStripped.length; charInd++) {
        if (trimLineCommentStripped.charAt(charInd)=='"') quoteOpen = !quoteOpen;
        if (quoteOpen) continue;
        if (trimLineCommentStripped.charAt(charInd)=='/') slashCounter++;
        else slashCounter = 0;
        if (slashCounter == 2) {
          trimLineCommentStripped = trimLineCommentStripped.substring(0, charInd-1).trim();
        }
      }
    }
    if (
      trimLine.charAt(trimLineCommentStripped.length-1)!=';'
      &&
      trimLine.charAt(trimLine.length-1)!='{'
      &&
      trimLine.charAt(trimLine.length-1)!='}'
      &&
      !parenthOpen
      &&
      !inMultilineComment
      &&
      !trimLine.startsWith("//")
      &&
      !fileLines[lineNum]?.trim().startsWith("{")
    ) {
      prevEndsWithSemicolon = false;
    } else {
      prevEndsWithSemicolon = true;
    }
  }
  return fails.fails;
}

