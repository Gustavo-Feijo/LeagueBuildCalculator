const fs = require('fs');

let championData = JSON.parse(fs.readFileSync('/home/gustavo/Desktop/LeagueBuildCalculator/APIfiles/item.json'));

const itemsToDelete = [];

for (const item in championData.data) {
  if (!championData.data[item].maps['11'] || championData.data[item].hasOwnProperty('requiredAlly') || championData.data[item].hasOwnProperty('inStore')) {
    itemsToDelete.push(item);
  }
}

// Delete items outside the loop
itemsToDelete.forEach(item => {
  console.log(item);
  delete championData.data[item];
});

const updatedJsonData = JSON.stringify(championData, null, 2);

// Write the updated JSON data back to the file
fs.writeFileSync('/home/gustavo/Desktop/LeagueBuildCalculator/APIfiles/item.json', updatedJsonData);
