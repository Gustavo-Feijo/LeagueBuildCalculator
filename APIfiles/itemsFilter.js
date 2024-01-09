const fs = require('fs');
const path = require('path');

let ddragonItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'DDragonItems.json')));
let cdnItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'cdnItems.json')));
const itemsToDelete = [];

for (const item in ddragonItems.data) {
  if (!ddragonItems.data[item].maps['11'] || ddragonItems.data[item].hasOwnProperty('requiredAlly') || ddragonItems.data[item].hasOwnProperty('inStore')) {
    itemsToDelete.push(item);
  }
}

// Delete items outside the loop
itemsToDelete.forEach(item => {
  delete ddragonItems.data[item];
});

for (const item in cdnItems) {
  if (!ddragonItems.data.hasOwnProperty(item)) {
    delete cdnItems[item];
  }
}
const updatedJsonData = JSON.stringify(cdnItems, null, 2);

// Write the updated JSON data back to the file
fs.writeFileSync('/home/gustavo/Desktop/LeagueBuildCalculator/APIfiles/item.json', updatedJsonData);
