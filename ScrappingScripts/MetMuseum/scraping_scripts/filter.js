const fs = require("fs");
const artifactList = fs.readdirSync("./data");
let path = "";
let data;
for (const artifact of artifactList) {
  path = "./data/" + artifact;
  if (fs.statSync(path).size == 0) {
    fs.rmSync(path);
  } else {
    data = require(path);
    if (data.country != "Egypt") {
      fs.rmSync(path);
    }
  }
}
