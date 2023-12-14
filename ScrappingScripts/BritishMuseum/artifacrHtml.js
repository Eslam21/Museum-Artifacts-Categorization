const fs = require("fs");
const axios = require("axios");
var requestOptions = {
  method: "GET",
  redirect: "follow",
};

const artifactUrl = "https://www.britishmuseum.org/collection/object/";

async function downloadData() {
  // small dos attack XD

  const patchSize = 15;
  for (let artifactIndex = 0; artifactIndex < artifactList.length; ) {
    let index = artifactIndex;
    let requests = [];
    if (artifactIndex + patchSize > artifactList.length) {
      artifactIndex = artifactList.length;
    } else {
      artifactIndex += patchSize;
    }

    for (; index < artifactIndex; index++) {
      const id = artifactList[index];
      console.log(id);
      requests.push(
        fetch(artifactUrl + id, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            fs.writeFileSync("./html/" + id + ".html", result);
          })
          .catch((error) => console.log("---- error: " + error + " - fileName: " + id))
      );
    }
    await Promise.allSettled(requests);
  }
}

if (!fs.existsSync("./html")) {
  fs.mkdirSync("./html");
}

fs.writeFileSync(
  "./downloadedHtml.json",
  JSON.stringify(fs.readdirSync("./html").map((name) => name.split(".")[0]))
);


const all = require("./allHtml.json");
const downloaded = require("./downloadedHtml.json");
const artifactList = all.filter((x) => !downloaded.includes(x));

downloadData();
