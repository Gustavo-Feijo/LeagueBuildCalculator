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
        health, healthRegen, mana, manaRegen, armor, magicResistance,
        attackDamage, movespeed, acquisitionRadius, selectionRadius, pathingRadius,
        gameplayRadius, criticalStrikeDamage, criticalStrikeDamageModifier,
        attackSpeed, attackSpeedRatio, attackCastTime, attackTotalTime,
        attackDelayOffset, attackRange
    } = championStats;
    champion.ad = attackDamage.flat;
    champion.adperlevel = attackDamage.perLevel;
    champion.ah = 0;
    champion.ap = 0;
    champion.armor = armor.flat;
    champion.armorperlevel = armor.perLevel;
    champion.armorpen = 0;
    champion.baseas = attackSpeed.flat;
    champion.attackspeed = attackSpeed.flat;
    champion.attackspeedperlevel = attackSpeed.perLevel;
    champion.attackspeedratio = attackSpeedRatio.flat;
    champion.bonusad = 0;
    champion.critical = 0;
    champion.criticaldamage = 1.75; //Base damage multiplier for critical.
    champion.criticalmodifier = criticalStrikeDamageModifier.flat;
    champion.healpower = 0;
    champion.hp = health.flat;
    champion.hpperlevel = health.perLevel;
    champion.hpregen = healthRegen.flat;
    champion.hpregenperlevel = healthRegen.perLevel;
    champion.hsp = 0;
    champion.lifesteal = 0;
    champion.lethality = 0;
    champion.magicpen = 0;
    champion.mana = mana.flat;
    champion.manaperlevel = mana.perLevel;
    champion.manaregen = manaRegen.flat;
    champion.manaregenperlevel = manaRegen.perLevel;
    champion.mr = magicResistance.flat;
    champion.mrperlevel = magicResistance.perLevel;
    champion.ms = movespeed.flat;
    champion.msperlevel = movespeed.perLevel;
    champion.omnivamp = 0;
    champion.range = attackRange.flat;
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
        document.querySelectorAll('.item')[position].src = `itemsImages/${item}.png`;
        document.querySelectorAll('.selected-item')[position].lastElementChild.innerHTML = itemsListObject[item].description;
        document.querySelectorAll('.selected-item')[position].lastElementChild.style.display = 'block';
        
        if(minIndex!==1)
            handleItemStats(item, addStats);
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

            let skills = championData.abilities;

            document.getElementById('champion-name').innerHTML = championData.name;
            document.getElementById('tooltip-P').innerHTML = skills.P[0].blurb;
            document.getElementById('tooltip-Q').innerHTML = skills.Q[0].blurb;
            document.getElementById('tooltip-W').innerHTML = skills.W[0].blurb;
            document.getElementById('tooltip-E').innerHTML = skills.E[0].blurb;
            document.getElementById('tooltip-R').innerHTML = skills.R[0].blurb;
            document.getElementById('champion-image').src = championData.icon;
            document.getElementById('champion-passive').src = skills.P[0].icon;
            document.getElementById('champion-Q').src = skills.Q[0].icon;
            document.getElementById('champion-W').src = skills.W[0].icon;
            document.getElementById('champion-E').src = skills.E[0].icon;
            document.getElementById('champion-R').src = skills.R[0].icon;


            initializeChampionStats(championData.stats);
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
