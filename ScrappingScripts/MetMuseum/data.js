const axios = require("axios");
const fs = require("fs");

// 10 refer to Egyptian art department
const objectIdsUrl =
  "https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=10";
const objectUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

async function downloadData() {
  // const response = await axios.get(objectIdsUrl);
  // const artifactList = response.data.objectIDs;
  const artifactList = require("./left.json");
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
      let artifactID = artifactList[index];

      requests.push(
        axios
          .get(objectUrl + artifactID, {
            headers: {
              Cookie:
                "incap_ses_467_1662004=gKWDJ2O54mgu8RAOuh97Bh71dWUAAAAA23P6bA6gi44045fT38Mkfw==; visid_incap_1662004=lmiJ/QaTSeSwQFkoRv2Rnr9YdGUAAAAAQUIPAAAAAABc9P9WjOHdgu303FTydaLz",
            },
          })

          .then((artifact) => {
            artifact = artifact.data;
            if (artifact.primaryImage.length != 0) {
              console.log(artifactID + "----");
              fs.writeFileSync("./data/" + artifactID + ".json", JSON.stringify(artifact));
            } else {
              console.log("----" + artifactID);
              fs.writeFileSync("./data/" + artifactID + ".json", "");
            }
          })
      );
    }
    await Promise.allSettled(requests);
  }

  // sequential
  // for (const id of artifactList) {
  //   let artifact = await axios.get(objectUrl + id,{headers:{"Cookie": "incap_ses_467_1662004=gKWDJ2O54mgu8RAOuh97Bh71dWUAAAAA23P6bA6gi44045fT38Mkfw==; visid_incap_1662004=lmiJ/QaTSeSwQFkoRv2Rnr9YdGUAAAAAQUIPAAAAAABc9P9WjOHdgu303FTydaLz"}});
  //   artifact = artifact.data;
  //   if (artifact.primaryImage.length != 0) {
  //     console.log(id + "----");
  //     fs.writeFileSync("./data/" + id + ".json", JSON.stringify(artifact));
  //   } else {
  //     console.log("----" + id);
  //     fs.writeFileSync("./data/" + id + ".json", "");
  //   }
  //   await new Promise(r => setTimeout(r, 1000));
  // }
}

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

// compute downloaded files
fs.writeFileSync(
  "./downloaded.json",
  JSON.stringify(fs.readdirSync("./data").map((name) => Number.parseInt(name.split(".")[0])))
);

// compute the left files
const all = require("./artifactList.json");
const downloaded = require("./downloaded.json");
const diff = all.filter((x) => !downloaded.includes(x));
fs.writeFileSync("./left.json", JSON.stringify(diff));

downloadData();
