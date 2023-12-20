const data = require("./data.json");
const fs = require("fs");
let temp = {};
let error403 = [];
const artifactUrl = "https://egyptianmuseum.catalogaccess.com/api/items/";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "museum-egyptianmuseum-id=995");
var raw = JSON.stringify({
  Select:
    "ItemId,ItemName/ObjectName,CustomFields/StringValue,CustomFields/Metadata/Id,CustomFields/Metadata/Name,CustomFields/Metadata/FieldType,CustomFields/Metadata/ObjectType,CreationDate,CatalogItemArt/Culture/Title,CatalogItemHistory/CatalogItemHistoryOrigins/DictionaryItem/Title,CatalogItemTags/DictionaryItem/Title,CatalogItemTags/DictionaryItem/Id,CatalogItemTags/DictionaryItem/Title,CatalogItemDimension/Details,CatalogItemHistory/CatalogItemHistoryMaterials/DictionaryItem/Title,Title",
  Expand:
    "ItemName,CustomFields,CustomFields/Metadata,CatalogItemArt/Culture,CatalogItemHistory/CatalogItemHistoryOrigins/DictionaryItem,CatalogItemTags/DictionaryItem,CatalogItemTags/DictionaryItem,CatalogItemDimension,CatalogItemHistory/CatalogItemHistoryMaterials/DictionaryItem",
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

async function downloadPhotos() {
  // small dos attack XD

  for (const artifact of data.PageResult.Items) {
    if (!fs.existsSync("./data/" + artifact.Id + ".json")) {
        
        //     let response = await fetch(artifactUrl + artifact.Id, requestOptions);
        //     fs.writeFileSync("./data/" + artifact.Id + ".json", await response.text())
        //   }
        fetch(artifactUrl + artifact.Id, requestOptions)
        .then((response) => response.text())
        .then((result) => fs.writeFileSync("./data/" + artifact.Id + ".json", result))
        .catch((error) => {
            error403.push(artifact.Id);
            console.log(error403);
        });
    }
  }
}

downloadPhotos();
