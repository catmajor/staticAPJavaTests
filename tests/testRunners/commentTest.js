//Advikar made this one
function commentTest(fileName, fileLines) {
  const fails = new TotalFails(fileName);
  let commentFound = false;
  for (line of fileLines) {
    if (line.includes("//")) commentFound = true;
  }
  if (!commentFound) fails.add(0, "No comment found");
  return fails.fails;
}