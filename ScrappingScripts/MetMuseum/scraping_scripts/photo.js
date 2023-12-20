const axios = require("axios");
const fs = require("fs");

async function downloadPhoto(data) {
  let requests = [];
  console.log(data.objectID);
  fs.mkdirSync("./photo/" + data.objectID);
  requests.push(
    axios
      .get(data.primaryImage, {
        responseType: "arraybuffer",
        headers: {
          Cookie:
            "incap_ses_467_1662004=gKWDJ2O54mgu8RAOuh97Bh71dWUAAAAA23P6bA6gi44045fT38Mkfw==; visid_incap_1662004=lmiJ/QaTSeSwQFkoRv2Rnr9YdGUAAAAAQUIPAAAAAABc9P9WjOHdgu303FTydaLz",
        },
      })

      .then((response) => {
        fs.writeFileSync(
          "./photo/" + data.objectID + "/" + data.primaryImage.split("/").slice(-1)[0],
          response.data
        );
      })
  );
  for (const image of data.additionalImages) {
    requests.push(
      axios
        .get(image, {
          responseType: "arraybuffer",
          headers: {
            Cookie:
              "incap_ses_467_1662004=gKWDJ2O54mgu8RAOuh97Bh71dWUAAAAA23P6bA6gi44045fT38Mkfw==; visid_incap_1662004=lmiJ/QaTSeSwQFkoRv2Rnr9YdGUAAAAAQUIPAAAAAABc9P9WjOHdgu303FTydaLz",
          },
        })
        .then((response) => {
          fs.writeFileSync(
            "./photo/" + data.objectID + "/" + image.split("/").slice(-1)[0],
            response.data
          );
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
      data = require("./data/" + artifactList[index] + ".json");
      requests.push(downloadPhoto(data));
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
const diff = all.filter((x) => !downloaded.includes(x));
fs.writeFileSync("./leftPhoto.json", JSON.stringify(diff));

const artifactList = diff;

downloadPhotos();
