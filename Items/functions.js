function formatingJson(jsonString) {
    // Remove square brackets
    jsonString = jsonString.replace(/[\[\]]/g, '');
    // Replace '=' with ':'
    jsonString = jsonString.replace(/=/g, ':');
    // Remove '--'
    jsonString = jsonString.replace(/--/g, '');
    // Remove trailing commas
    jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');

    // Correct arrays for specific keys
    jsonString = arrayCorrect(jsonString, "type");
    jsonString = arrayCorrect(jsonString, "recipe");
    jsonString = arrayCorrect(jsonString, "nickname");
    jsonString = arrayCorrect(jsonString, "tags");
    jsonString = arrayCorrect(jsonString, "champion");

    return dataFilter(jsonString);
}

function arrayCorrect(jsonString, key) {
    const regex = new RegExp(`"${key}"\\s*:\\s*\\{([^}]+)\\}`, 'g');
    jsonString = jsonString.replace(regex, (match, group) => `"${key}": [${group}]`);
    return jsonString;
}

function dataFilter(jsonString) {
    let jsonData = JSON.parse(jsonString);

    // Create a new object with the items you want to keep
    const filteredData = {};
    for (const item in jsonData) {
        const mode = jsonData[item].modes['classic sr 5v5'];
        const type = jsonData[item].type;

        if (mode !== false && isTypeAllowed(type)) {
            filteredData[item] = jsonData[item];
        }
    }

    return filteredData;
}

function isTypeAllowed(type) {
    const allowedTypes = ["Starter", "Basic", "Legendary", 'Epic', 'Mythic', 'Boots'];
    if (type === undefined) return false;
    return allowedTypes.some(elemento => type.includes(elemento)) || type.indexOf(":&gt") === 0;
}

module.exports = {
    formatingJson,
};
