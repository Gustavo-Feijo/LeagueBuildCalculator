const fs = require('fs');
const path = require('path');

const championsDirectory = "/home/gustavo/Desktop/LeagueBuildCalculator/APIfiles/championsData";

async function changeToHTTPS() {
    try {
        const files = fs.readdirSync(championsDirectory);
        const championsData = files.map((file) => {
            const filePath = path.join(championsDirectory, file);

            try {
                const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                // Check if the fileContent has an "icon" property
                if (fileContent.icon) {
                    // Replace "http://" with "https://"
                    fileContent.icon = fileContent.icon.replace('http://', 'https://');
                }

                // Return the modified fileContent
                return fileContent;
            } catch (error) {
                console.error(`Error parsing JSON in file ${filePath}:`, error.message);
                throw error; // Propagate the error to the caller
            }
        });

        // Save the modified data back to the files (optional)
        files.forEach((file, index) => {
            const filePath = path.join(championsDirectory, file);
            fs.writeFileSync(filePath, JSON.stringify(championsData[index], null, 2), 'utf-8');
        });

        return championsData;
    } catch (error) {
        console.error('Error reading or modifying champion files:', error);
        throw error; // Propagate the error to the caller
    }
}

// Example usage:
changeToHTTPS()
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
