const fs = require("fs");

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

// extract artifact into single file
const pages = fs.readdirSync("./data_");
for (const page of pages) {
  const data = require("./data_/" + page);
  for (const artifact of data) {
    let fileName = "";
    for (const id of artifact._source.identifier) {
      if (id.unique_object_id != undefined) {
        fileName = id.unique_object_id;
        break;
      }
    }
    if (fileName.length != 0) {
      fs.writeFileSync("./data/" + fileName + ".json", JSON.stringify(artifact));
    }
  }
}

// remove useless information
const artifacts = fs.readdirSync("./data");
for (const fileName of artifacts) {
  const artifact = require("./data/" + fileName);
  delete artifact._index;
  delete artifact._type;
  delete artifact._score;
  delete artifact._source.identifier;
  let newMultiMedia = [];
  let link = "";
  for (const image of artifact._source.multimedia) {
    if (image.processed.max != undefined) {
      link = image.processed.max.location;
    } else if (image.processed.huge != undefined) {
      link = image.processed.huge.location;
    } else if (image.processed.large != undefined) {
      link = image.processed.large.location;
    } else if (image.processed.mid != undefined) {
      link = image.processed.mid.location;
    } else if (image.processed.small != undefined) {
      link = image.processed.small.location;
    }
   
    newMultiMedia.push(link);
  }
  if (newMultiMedia.length != 0) {
    artifact._source.multimedia = newMultiMedia;
  } else {
    console.log(fileName);
  }

  fs.writeFileSync("./data/" + fileName, JSON.stringify(artifact));
}
