//Variables used by the fetch function to retrieve a JSON from the API.
const lastPartOfURL = window.location.pathname.split('/').pop();
const API_ENDPOINT = '/api/champions/';
const itemsArray = [0, 1, 2, 3, 4, 5]

//Const used to store the JSON fetched from the item API endpoint.
let itemsListObject = null;

//Object with champion variables.
let champion = {
    level: 1, //Start level.
    base: {
        ad: null,
        armor: null,
        asratio: null,
        attackspeed: null,
        hp: null,
        hpregen: null,
        mana: null,
        manaregen: null,
        mr: null,
    },
    bonus: {
        ad: 0,
        armor: 0,
        attackspeed: 0,
        hp: 0,
        hpregen: 0,
        mana: 0,
        manaregen: 0,
        mr: 0,
        ms: 0,
    },
    perlevel: {
        ad: null,
        armor: null,
        attackspeed: null,
        hp: null,
        hpregen: null,
        mana: null,
        manaregen: null,
        mr: null,

    },
    total: {
        ad: null,
        ah: 0,
        ap: 0,
        armor: null,
        armorpen: 0,
        attackspeed: null,
        critical: 0,
        criticaldamage: 1.75,
        healpower: 0,
        hp: null,
        hpregen: null,
        hsp: 0,
        lethality: 0,
        lifesteal: 0,
        mana: null,
        manaregen: null,
        magicpen: 0,
        magicpenpercent: 0,
        mr: null,
        ms: null,
        omnivamp: 0,
        range: null,
        tenacity: 0,
    },
    penetration: {
        magic: {
            flat: 0,
            percent: 0,
        },
        armor: {
            flat: 0,
            percent: 0,
        }
    }
};

//Initialize the champion stats with the JSON Data.
function initializeChampionStats(championStats) {
    const {
        health, healthRegen, mana, manaRegen, armor, magicResistance,
        attackDamage, movespeed, attackSpeed,
        attackSpeedRatio, attackRange
    } = championStats;
    //Base stats
    champion.base.ad = attackDamage.flat;
    champion.base.armor = armor.flat;
    champion.base.asratio = attackSpeedRatio.flat;
    champion.base.attackspeed = attackSpeed.flat;
    champion.base.hp = health.flat;
    champion.base.hpregen = healthRegen.flat;
    champion.base.mana = mana.flat;
    champion.base.manaregen = manaRegen.flat;
    champion.base.mr = magicResistance.flat;

    //PerLevelStats
    champion.perlevel.ad = attackDamage.perLevel;
    champion.perlevel.armor = armor.perLevel;
    champion.perlevel.attackspeed = attackSpeed.perLevel;
    champion.perlevel.hp = health.perLevel;
    champion.perlevel.hpregen = healthRegen.perLevel;
    champion.perlevel.mana = mana.perLevel;
    champion.perlevel.manaregen = manaRegen.perLevel;
    champion.perlevel.mr = magicResistance.perLevel;

    champion.total.range = attackRange.flat;
    champion.total.ms = movespeed.flat;
    updateStats();
};

//Function to make the spans object declaration more readable.
function getLastSpanByID(identifier) {
    return document.getElementById(identifier).querySelector('span:last-child');
}
// List of champion stats that are going to be shown in the HTML.
const championVisibleStats = [
    'ad', 'ah', 'ap', 'armor', 'armorpen', 'attackspeed', 'critical', 'criticaldamage',
    'healpower', 'hp', 'hpregen', 'hsp', 'lethality', 'lifesteal', 'magicpen', 'magicpenpercent', 'mana',
    'manaregen', 'mr', 'ms', 'omnivamp', 'range', 'tenacity',

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
        spans[key].innerHTML = champion.total[key].toFixed(2);
    }
}

function updateStats() {
    const level = document.getElementById('select-level').value;
    //Change current level on the table.
    getLastSpanByID('level').innerHTML = level;

    //The stats are increased based in the difference between both levels, if the change is negative, then the stats are reduced accordingly, avoiding the need to create base stats for the champion.
    champion.total.ad = calculateStats('ad', level);
    champion.total.armor = calculateStats('armor', level);
    champion.total.hp = calculateStats('hp', level);
    champion.total.hpregen = calculateStats('hpregen', level);
    champion.total.mana = calculateStats('mana', level);
    champion.total.manaregen = calculateStats('manaregen', level);
    champion.total.mr = calculateStats('mr', level);

    //The attackspeed is calculated based on the base attackspeed in order to simplify the code, since the AS growth is more complex than the others.
    champion.total.attackspeed = champion.base.attackspeed + (champion.bonus.attackspeed + ((champion.perlevel.attackspeed / 100) * (level - 1)) * (0.7025 + (0.0175 * (level - 1)))) * champion.base.asratio;

    //Set the current champion level to the selected one and update the stats.
    champion.level = level;
    updateChampionStatsHTML();
}
function calculateStats(stat, level) {
    return champion.base[stat] + (champion.bonus[stat] + ((champion.perlevel[stat]) * (level - 1)) * (0.7025 + (0.0175 * (level - 1))));
}

//Checks for the minimum position in the array, representing the position on the query selector.
//Guarantes that it always add a new item to the selection list in the correct order.
function handleItemSelectionChange(item) {
    const minValue = Math.min(...itemsArray);
    const minIndex = itemsArray.indexOf(minValue);
    try {
        const position = itemsArray.splice(minIndex, 1);
        document.querySelectorAll('.item')[position].src = `itemsImages/${item}.png`;
        document.querySelectorAll('.selected-item')[position].firstElementChild.dataset.item=parseInt(item);
        document.querySelectorAll('.selected-item')[position].lastElementChild.innerHTML = itemsListObject[item].description;
        document.querySelectorAll('.selected-item')[position].lastElementChild.style.display = 'block';
        

        if (minIndex !== 1)
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

//Callback functions for handleItemStats.
const addStats = (a, b) => a + (b || 0);
const subtractStats = (a, b) => a - (b || 0);

function handleItemStats(item, callback) {
    const itemStats = itemsListObject[item].stats;
    champion.bonus.ah = callback(champion.bonus.ah, itemStats.abilityHaste.flat);
    champion.bonus.armor = callback(champion.bonus.armor, itemStats.armor.flat);
    champion.total.armorpen = callback(champion.total.armorpen, itemStats.armorPenetration.percent);
    champion.total.ap = callback(champion.total.ap, itemStats.abilityPower.flat);
    champion.bonus.ad = callback(champion.bonus.ad, itemStats.attackDamage.flat);
    champion.bonus.attackspeed = callback(champion.bonus.attackspeed, itemStats.attackSpeed.flat);
    champion.total.critical = callback(champion.total.critical, itemStats.criticalStrikeChance.percent);
    champion.bonus.hp = callback(champion.bonus.hp, itemStats.health.flat);
    champion.bonus.hpregen = callback(champion.bonus.hpregen, itemStats.healthRegen.percent / 100);
    champion.total.hsp = callback(champion.total.hsp, itemStats.healAndShieldPower.flat);
    champion.total.lethality = callback(champion.total.lethality, itemStats.lethality.flat);
    champion.total.lifesteal = callback(champion.total.lifesteal, itemStats.lifesteal.flat);
    champion.total.magicpen = callback(champion.total.magicpen, itemStats.magicPenetration.flat);
    champion.total.magicpenpercent = callback(champion.total.magicpenpercent, itemStats.magicPenetration.percent);
    champion.bonus.mana = callback(champion.bonus.mana, itemStats.mana.flat);
    champion.bonus.manaregen = callback(champion.bonus.manaregen, itemStats.manaRegen.percent / 100);
    champion.bonus.mr = callback(champion.bonus.mr, itemStats.magicResistance.flat);
    champion.total.ms = callback(champion.total.ms, itemStats.movespeed.flat);
    champion.total.omnivamp = callback(champion.total.omnivamp, itemStats.omnivamp.flat);
    champion.total.tenacity = callback(champion.total.tenacity, itemStats.tenacity.flat);
    updateStats();
}

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
            itemsListObject = itemData;

            for (const item in itemData) {

                //Add each item to the list with it respective image, tooltip and key.
                const itemlist = document.getElementById('item-options');
                const itemContainer = document.createElement('div');

                const itemImage = document.createElement('img');
                itemImage.src = `itemsImages/${item}.png`;
                itemImage.classList.add('item-images');

                const itemKey = document.createElement('item');
                itemKey.innerHTML = item;

                const itemTooltip = document.createElement('span');
                itemTooltip.classList.add('tooltip');
                itemTooltip.innerHTML = itemData[item].description;

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
    createSelectedItemsList();
});

function createSelectedItemsList() {
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
                handleItemStats(itemImage.getAttribute('data-item'), subtractStats)
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
}
