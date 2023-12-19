const axios = require("axios");
const data = require("./data.json");
const fs = require("fs");

const photoApi = "https://egyptianmuseum.catalogaccess.com/api/images/";

async function downloadPhotos() {
  if (!fs.existsSync("./photo")) {
    fs.mkdirSync("./photo");
  }
  // small dos attack XD
  for (const artifact of data.PageResult.Items) {
    if (!fs.existsSync("./photo/" + artifact.ImageId + ".jpg")) {
      axios
        .get("https://egyptianmuseum.catalogaccess.com/api/images/" + artifact.ImageId, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          fs.writeFile("./photo/" + artifact.ImageId + ".jpg", response.data, (err) => {
            if (err) throw err;
            console.log(artifact.ImageId + " Image downloaded successfully!");
          });
        });
    }
  }
}
downloadPhotos();
