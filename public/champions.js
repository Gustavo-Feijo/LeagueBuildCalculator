//Variables used by the fetch function to retrieve a JSON from the API.
const lastPartOfURL = window.location.pathname.split('/').pop();
const API_ENDPOINT = '/api/champions/';
const itemsArray = [0, 1, 2, 3, 4, 5]

//Const used to store the JSON fetched from the item API endpoint.
let itemsListObject = null;

//Object with champion variables.
let champion = {
    level: 1, //Start level.
    ad: null,
    adperlevel: null,
    ah: null,
    ap: null,
    armor: null,
    armorperlevel: null,
    armorpen: null,
    attackspeed: null,
    attackspeedperlevel: null,
    attackspeedratio: null,
    baseas: null,
    bonusas: 0,
    bonusad: null,
    critical: null,
    criticaldamage: null,
    criticalperlevel: null,
    healpower: null,
    hp: null,
    hpperlevel: null,
    hpregen: null,
    hpregenperlevel: null,
    hsp: null,
    lifesteal: null,
    lethality: null,
    magicpen: null,
    mana: null,
    manaperlevel: null,
    manaregen: null,
    manaregenperlevel: null,
    mr: null,
    mrperlevel: null,
    ms: null,
    omnivamp: null,
    range: null,
    slowresist: null,
    tenacity: null,
};

//Function to make the spans object declaration more readable.
function getLastSpanByID(identifier) {
    return document.getElementById(identifier).querySelector('span:last-child');
}
// List of champion stats that are going to be shown in the HTML.
const championVisibleStats = [
    'ad', 'ah', 'ap', 'armor', 'armorpen', 'attackspeed', 'critical', 'criticaldamage',
    'healpower', 'hp', 'hpregen', 'hsp', 'lifesteal', 'lethality', 'magicpen', 'mana',
    'manaregen', 'mr', 'ms', 'omnivamp', 'range', 'slowresist', 'tenacity'
];

//Initialize the spans object dinamically.
const spans = {
};
championVisibleStats.forEach(attribute => {
    spans[attribute] = getLastSpanByID(attribute);
});

//Go through each of the stats spans and update accordingly.
function updateChampionStatsHTML() {
    for (const key in spans) {
        spans[key].innerHTML = champion[key].toFixed(2);
    }
}
function updateStats() {

    const level = document.getElementById('select-level').value;

    //Change current level on the table.
    getLastSpanByID('level').innerHTML = level;

    const levelCalc = level - champion.level;//Calculate the change between the current level and the selected level.
    //The stats are increased based in the difference between both levels, if the change is negative, then the stats are reduced accordingly, avoiding the need to create base stats for the champion.
    champion.hp += champion.hpperlevel * levelCalc;
    champion.ad += champion.adperlevel * levelCalc;
    champion.armor += champion.armorperlevel * levelCalc;
    champion.mr += champion.mrperlevel * levelCalc;
    champion.mana += champion.manaperlevel * levelCalc;
    champion.manaregen += champion.manaregenperlevel * levelCalc;
    champion.hpregen += champion.hpregenperlevel * levelCalc;

    //The attackspeed is calculated based on the base attackspeed in order to simplify the code, since the AS growth is more complex than the others.
    champion.attackspeed = champion.baseas + (champion.bonusas + ((champion.attackspeedperlevel / 100) * (level - 1)) * (0.7025 + (0.0175 * (level - 1)))) * champion.attackspeedratio;

    //Set the current champion level to the selected one and update the stats.
    champion.level = level;
    updateChampionStatsHTML();
}

//Initialize the champion stats with the JSON Data.
function initializeChampionStats(championStats) {
    const {
        attackdamage, attackdamageperlevel, armor, armorperlevel, attackspeed, attackspeedperlevel, attackspeedratio, crit, critperlevel, hp,
        hpperlevel, hpregen, hpregenperlevel, mp, mpperlevel, mpregen, mpregenperlevel, spellblock,
        spellblockperlevel, movespeed, attackrange
    } = championStats;
    champion.ad = attackdamage;
    champion.adperlevel = attackdamageperlevel;
    champion.ah = 0;
    champion.ap = 0;
    champion.armor = armor;
    champion.armorperlevel = armorperlevel;
    champion.armorpen = 0;
    champion.baseas = attackspeed;
    champion.attackspeed = attackspeed;
    champion.attackspeedperlevel = attackspeedperlevel;
    champion.attackspeedratio = attackspeedratio;
    champion.bonusad = 0;
    champion.critical = crit;
    champion.criticaldamage = 1.75; //Base damage multiplier for critical.
    champion.criticalperlevel = critperlevel;
    champion.healpower = 0;
    champion.hp = hp;
    champion.hpperlevel = hpperlevel;
    champion.hpregen = hpregen;
    champion.hpregenperlevel = hpregenperlevel;
    champion.hsp = 0;
    champion.lifesteal = 0;
    champion.lethality = 0;
    champion.magicpen = 0;
    champion.mana = mp;
    champion.manaperlevel = mpperlevel;
    champion.manaregen = mpregen;
    champion.manaregenperlevel = mpregenperlevel;
    champion.mr = spellblock;
    champion.mrperlevel = spellblockperlevel;
    champion.ms = movespeed;
    champion.omnivamp = 0;
    champion.range = attackrange;
    champion.slowresist = 0;
    champion.tenacity = 0;
    updateChampionStatsHTML();
};


//Checks for the minimum position in the array, representing the position on the query selector.
//Guarantes that it always add a new item to the selection list in the correct order.
function handleItemSelectionChange(item) {
    const minValue = Math.min(...itemsArray);
    const minIndex = itemsArray.indexOf(minValue);
    try {
        const position = itemsArray.splice(minIndex, 1);
        handleItemStats(item, addStats);
        document.querySelectorAll('.item')[position].src = `itemsImages/${item}.png`;
        document.querySelectorAll('.selected-item')[position].lastElementChild.innerHTML = itemsListObject[item].description;
        document.querySelectorAll('.selected-item')[position].lastElementChild.style.display = 'block';
    }
    catch (e) {
        if (minIndex === -1) {
            console.log("All the items were already selected");
        }
        else {
            console.log(e);
        }
    }
}

function handleItemStats(item, callback) {
    const itemStats = itemsListObject[item].stats;
    champion.armor = callback(champion.armor, itemStats.FlatArmorMod);
    champion.hp = callback(champion.hp, itemStats.FlatHPPoolMod);
    champion.hpregen = callback(champion.hpregen, itemStats.FlatHPRegenMod);
    champion.ap = callback(champion.ap, itemStats.FlatMagicDamageMod);
    champion.ms = callback(champion.ms, itemStats.FlatMovementSpeedMod);
    champion.mana = callback(champion.mana, itemStats.FlatMPPoolMod);
    champion.bonusad = callback(champion.bonusad, itemStats.FlatPhysicalDamageMod);
    champion.mr = callback(champion.mr, itemStats.FlatSpellBlockMod);
    champion.critical = callback(champion.critical, itemStats.FlatCritChanceMod);
    champion.bonusas = callback(champion.bonusas, itemStats.PercentAttackSpeedMod);
    champion.lifesteal = callback(champion.lifesteal, itemStats.PercentLifeStealMod);
    updateStats();
}
const addStats = (a, b) => a + (b || 0);
const subtractStats = (a, b) => a - (b || 0);

//Start the base values and images on the content loading.
document.addEventListener('DOMContentLoaded', function () {

    //Fetch the champion JSON and initialize the informations of the champion.
    fetch(API_ENDPOINT + lastPartOfURL)
        .then(response => {
            if (response.ok) {
                return response.json(); // Add the return statement here
            }
            throw new Error('Network response was not ok.');
        })
        .then(championData => {

            let skills = championData['data'][lastPartOfURL].spells;
            document.getElementById('champion-name').innerHTML = championData['data'][lastPartOfURL].name;
            document.getElementById('tooltip-P').innerHTML = championData['data'][lastPartOfURL].passive.description;
            document.getElementById('tooltip-Q').innerHTML = skills[0].description;
            document.getElementById('tooltip-W').innerHTML = skills[1].description;
            document.getElementById('tooltip-E').innerHTML = skills[2].description;
            document.getElementById('tooltip-R').innerHTML = skills[3].description;
            document.getElementById('champion-image').src = `championsImages/${championData['data'][lastPartOfURL].image.full}`;
            document.getElementById('champion-passive').src = `passiveImages/${championData['data'][lastPartOfURL].passive.image.full}`;
            document.getElementById('champion-Q').src = `spellImages/${skills[0].image.full}`;
            document.getElementById('champion-W').src = `spellImages/${skills[1].image.full}`;
            document.getElementById('champion-E').src = `spellImages/${skills[2].image.full}`;
            document.getElementById('champion-R').src = `spellImages/${skills[3].image.full}`;


            initializeChampionStats(championData['data'][lastPartOfURL].stats);
        })
        .catch(error => console.error('Error fetching champion data:', error));

    //Fetch the item JSON, loop through each item and add it to the list.
    fetch('/api/items')
        .then(response => response.json())
        .then(itemData => {
            itemsListObject = itemData.data;

            for (const item in itemData.data) {

                //Add each item to the list with it respective image, tooltip and key.
                const itemlist = document.getElementById('item-options');
                const itemContainer = document.createElement('div');

                const itemImage = document.createElement('img');
                itemImage.src = `itemsImages/${itemData.data[item].image.full}`;
                itemImage.classList.add('item-images');

                const itemKey = document.createElement('item');
                itemKey.innerHTML = item;

                const itemTooltip = document.createElement('span');
                itemTooltip.classList.add('tooltip');
                itemTooltip.innerHTML = itemData.data[item].description;

                itemContainer.appendChild(itemImage);
                itemContainer.appendChild(itemTooltip);
                itemContainer.appendChild(itemKey);
                itemContainer.classList.add('item-container')

                itemContainer.addEventListener('click', function () {
                    handleItemSelectionChange(this.lastElementChild.innerHTML)
                });
                itemlist.appendChild(itemContainer);
            }
        })
        .catch(error => console.error('Error fetching items:', error));


    const selectedItemsList = document.getElementById('selected-items');

    function createItemElement(identifier) {

        const itemContainer = document.createElement('div');
        itemContainer.classList.add('selected-item');

        const itemImage = document.createElement('img');
        itemImage.classList.add('item');
        itemImage.dataset.identifier = identifier;

        const itemDescription = document.createElement('span');
        itemDescription.classList.add('tooltip');
        itemDescription.style.top = '100px';
        itemDescription.style.display = 'none';

        itemImage.addEventListener('click', () => {

            //Gets the item key from the src url and removes it stats.
            if (itemImage.src) {
                handleItemStats(itemImage.src.split('.')[0].split('/').pop(), subtractStats)
            };

            itemImage.removeAttribute('src');
            itemDescription.innerHTML = '';
            itemDescription.style.display = 'none';
            const clickedIdentifier = parseInt(itemImage.dataset.identifier);
            if (!itemsArray.includes(clickedIdentifier)) {
                itemsArray.push(clickedIdentifier);
            }
        });

        itemContainer.appendChild(itemImage);
        itemContainer.appendChild(itemDescription);
        return itemContainer;
    }

    for (let i = 0; i < 6; i++) {
        const itemElement = createItemElement(i);
        selectedItemsList.appendChild(itemElement);
    }
});
