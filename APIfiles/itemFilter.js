const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Import node-fetch for making HTTP requests

// Function to fetch data from the Riot API
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Fetch data from the Riot API
fetchData('https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/item.json')
  .then(ddragonData => {
    // Use consistent variable name
    let ddragonItems = ddragonData;

    const cdnItemsPath = path.join(__dirname, 'cdnItems.json');
    let cdnItems = JSON.parse(fs.readFileSync(cdnItemsPath));
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
      else {
        cdnItems[item].description = ddragonItems.data[item].description;
      }
    }

    const updatedJsonData = JSON.stringify(cdnItems, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFileSync('/home/gustavo/Desktop/LeagueBuildCalculator/APIfiles/items.json', updatedJsonData);
  })
  .catch(error => {
    // Handle errors here
    console.error('Error fetching item data:', error);
  });
