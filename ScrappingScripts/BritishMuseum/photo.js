const axios = require("axios");
const fs = require("fs");

const link = "http://media.britishmuseum.org/media/";
async function downloadPhoto(artifact) {
  data = require("./data/" + artifact + ".json");
  fs.mkdirSync("./photo/" + artifact);

  let requests = [];

  for (const image of data._source.multimedia) {
    requests.push(
      axios
        .get(link + image, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          fs.writeFileSync(
            "./photo/" + artifact + "/" + image.split("/").slice(-1)[0],
            response.data
          );
        })
        .catch((error) => {
          console.log("error: " + error);
          console.log("artifact: " + artifact);
        })
    );
  }
  await Promise.allSettled(requests);
}

async function downloadPhotos() {
  // small dos attack XD

  const patchSize = 5;

  for (let artifactIndex = 0; artifactIndex < artifactList.length; ) {
    let index = artifactIndex;
    let requests = [];
    if (artifactIndex + patchSize > artifactList.length) {
      artifactIndex = artifactList.length;
    } else {
      artifactIndex += patchSize;
    }
    for (; index < artifactIndex; index++) {
      requests.push(downloadPhoto(artifactList[index]));
    }
    await Promise.allSettled(requests);
  }
}

if (!fs.existsSync("./photo")) {
  fs.mkdirSync("./photo");
}

fs.writeFileSync("./downloadedPhoto.json", JSON.stringify(fs.readdirSync("./photo")));

const all = fs.readdirSync("./data").map((name) => name.split(".")[0]);
const downloaded = require("./downloadedPhoto.json");
const artifactList = all.filter((x) => !downloaded.includes(x));
fs.writeFileSync("./leftPhoto.json", JSON.stringify(artifactList));

downloadPhotos();

// // need to be checked
// artifact: W_OA-6051
// artifact: Y_EA50213
// artifact: G_1917-0601-2781
// artifact: W_OA-14105
// artifact: Y_EA27021
// artifact: G_1886-0401-758
// artifact: Y_EA1682
