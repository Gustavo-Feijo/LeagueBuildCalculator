//Variables used by the fetch function to retrieve a JSON from the API.
const lastPartOfURL = window.location.pathname.split('/').pop();
const API_ENDPOINT = '/api/champions/';

//Object with champion variables.
let champion = {
    level: 1,
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

//Champion variables that are going to be visible, the spans are used to change the values on the HTML.
const spans = {
    ad: getSpanByIdentifier('ad'),
    ah: getSpanByIdentifier('ah'),
    ap: getSpanByIdentifier('ap'),
    armor: getSpanByIdentifier('armor'),
    armorpen: getSpanByIdentifier('armorpen'),
    attackspeed: getSpanByIdentifier('attackspeed'),
    critical: getSpanByIdentifier('critical'),
    criticaldamage: getSpanByIdentifier('criticaldamage'),
    healpower: getSpanByIdentifier('healpower'),
    hp: getSpanByIdentifier('hp'),
    hpregen: getSpanByIdentifier('hpregen'),
    hsp: getSpanByIdentifier('hsp'),
    lifesteal: getSpanByIdentifier('lifesteal'),
    lethality: getSpanByIdentifier('lethality'),
    magicpen: getSpanByIdentifier('magicpen'),
    mana: getSpanByIdentifier('mana'),
    manaregen: getSpanByIdentifier('manaregen'),
    mr: getSpanByIdentifier('mr'),
    ms: getSpanByIdentifier('ms'),
    omnivamp: getSpanByIdentifier('omnivamp'),
    range: getSpanByIdentifier('range'),
    slowresist: getSpanByIdentifier('slowresist'),
    tenacity: getSpanByIdentifier('tenacity'),
};

//Start the base values and images on the content loading.
document.addEventListener('DOMContentLoaded', function () {

    fetch(API_ENDPOINT + lastPartOfURL)
        .then(response => response.json())
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


            updateChampionStats(championData['data'][lastPartOfURL].stats);
        })
        .catch(error => console.error('Error fetching champion data:', error));

    fetch('/api/items')
        .then(response => response.json())
        .then(itemData => {
            for (const item in itemData.data) {
                const itemContainer = document.getElementById('item-options');

                const imageContainer = document.createElement('div');
                const itemimage = document.createElement('img');

                itemimage.src = `itemsImages/${itemData.data[item].image.full}`;
                itemimage.classList.add('item-images');

                const itemTooltip = document.createElement('span');
                itemTooltip.classList.add('item-tooltip');
                itemTooltip.innerHTML=itemData.data[item].description;

                imageContainer.appendChild(itemimage);
                imageContainer.appendChild(itemTooltip);
                imageContainer.classList.add('item-container')
                itemContainer.appendChild(imageContainer);
                
            }
        })
        .catch(error => console.error('Error fetching items:', error));
});

function updateChampionStats(championStats) {
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

function updateChampionStatsHTML() {
    for (const key in spans) {
        spans[key].innerHTML = champion[key].toFixed(2);
    }
}
function getSpanByIdentifier(identifier) {
    return document.getElementById(identifier).querySelector('span:last-child');
}
function adjustlevelstats(level) {
    getSpanByIdentifier('level').innerHTML = level;
    let levelCalc = level - champion.level;
    champion.hp += champion.hpperlevel * levelCalc;
    champion.ad += champion.adperlevel * levelCalc;
    champion.armor += champion.armorperlevel * levelCalc;
    champion.mr += champion.mrperlevel * levelCalc;
    champion.mana += champion.manaperlevel * levelCalc;
    champion.manaregen += champion.manaregenperlevel * levelCalc;
    champion.attackspeed = champion.baseas + (champion.bonusas + ((champion.attackspeedperlevel / 100) * (level - 1)) * (0.7025 + (0.0175 * (level - 1)))) * champion.attackspeedratio;
    champion.hpregen += champion.hpregenperlevel * levelCalc;
    champion.level = level;
    updateChampionStatsHTML();
}