function charTest(fileName, fileLines) {
  const fails = new TotalFails(fileName);
  for (let lineNumber = 1; lineNumber <= fileLines.length; lineNumber++) {
      let line = fileLines[lineNumber - 1];
      if (line.length > 80) {
          fails.add(lineNumber, "Too many characters (over 80)");
      }
  }
  return fails.fails;
}