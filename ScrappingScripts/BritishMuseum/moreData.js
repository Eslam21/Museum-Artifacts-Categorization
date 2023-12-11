const fs = require("fs");

var requestOptions = {
  method: "GET",
  redirect: "follow",
};

let endPage = 570;
const artifactUrl =
  "https://www.britishmuseum.org/api/_search?keyword[]=egypt&image=true&view=grid&sort=object_name__asc&page=";

async function downloadData() {
  // small dos attack XD

  const patchSize = 15;
  for (let artifactIndex = 0; artifactIndex < endPage; ) {
    let index = artifactIndex;
    let requests = [];
    if (artifactIndex + patchSize > endPage) {
      artifactIndex = endPage;
    } else {
      artifactIndex += patchSize;
    }
    for (; index < artifactIndex; index++) {
      let artifactID = index;
      console.log(artifactUrl + artifactID);
      requests.push(
        fetch(
          "https://www.britishmuseum.org/api/_search?keyword[]=egypt&image=true&view=grid&sort=object_name__asc&page=" +
            artifactID,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            fs.writeFileSync("./data/" + artifactID + ".json", JSON.stringify(result.hits.hits));
          })
      );
    }
    await Promise.allSettled(requests);
  }
}

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

downloadData();
