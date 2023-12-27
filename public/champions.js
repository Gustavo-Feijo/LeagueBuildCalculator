const lastPartOfURL = window.location.pathname.split('/').pop();

let champion = {
    ad: null,
    ah: null,
    ap: null,
    armor: null,
    armorpen: null,
    attackspeed: null,
    attackspeedperlevel: null,
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

function getSpanByIdentifier(identifier) {
    return document.getElementById(identifier).querySelector('span:last-child');
}

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

document.addEventListener('DOMContentLoaded', function () {

    fetch('/api/champions/' + lastPartOfURL)
        .then(response => response.json())
        .then(championData => {
            console.log('spellImages/'+championData['data'][lastPartOfURL].spells[3].id+'.png');
            document.getElementById('champion-name').innerHTML =championData['data'][lastPartOfURL].name;
            document.getElementById('tooltip-P').innerHTML = championData['data'][lastPartOfURL].passive.description;
            document.getElementById('tooltip-Q').innerHTML = championData['data'][lastPartOfURL].spells[0].description;
            document.getElementById('tooltip-W').innerHTML = championData['data'][lastPartOfURL].spells[1].description;
            document.getElementById('tooltip-E').innerHTML = championData['data'][lastPartOfURL].spells[2].description;
            document.getElementById('tooltip-R').innerHTML = championData['data'][lastPartOfURL].spells[3].description;
            document.getElementById('champion-image').src='championsImages/'+championData['data'][lastPartOfURL].image.full;
            document.getElementById('champion-passive').src='passiveImages/'+championData['data'][lastPartOfURL].passive.image.full;
            document.getElementById('champion-Q').src='spellImages/'+championData['data'][lastPartOfURL].spells[0].image.full;
            console.log(document.getElementById('champion-Q').src)
            document.getElementById('champion-W').src='spellImages/'+championData['data'][lastPartOfURL].spells[1].id+'.png';
            document.getElementById('champion-E').src='spellImages/'+championData['data'][lastPartOfURL].spells[2].id+'.png';
            document.getElementById('champion-R').src='spellImages/'+championData['data'][lastPartOfURL].spells[3].id+'.png';
            const championStats = championData['data'][lastPartOfURL].stats;

            champion.ad = championStats.attackdamage;
            champion.ah = 0;
            champion.ap = 0;
            champion.armor = championStats.armor;
            champion.armorpen = 0;
            champion.attackspeed = championStats.attackspeed;
            champion.attackspeedperlevel = championStats.attackspeedperlevel;
            champion.bonusad = 0;
            champion.critical = championStats.crit;
            champion.criticaldamage = 1.75;
            champion.criticalperlevel = championStats.critperlevel;
            champion.healpower = 0;
            champion.hp = championStats.hp;
            champion.hpperlevel = championStats.hpperlevel;
            champion.hpregen = championStats.hpregen;
            champion.hpregenperlevel = championStats.hpregenperlevel;
            champion.hsp = 0;
            champion.lifesteal = 0;
            champion.lethality = 0;
            champion.magicpen = 0;
            champion.mana = championStats.mp;
            champion.manaperlevel=championStats.mpregenperlevel;
            champion.manaregen = championStats.mpregen;
            champion.mr=championStats.spellblock;
            champion.mrperlevel=championStats.spellblockperlevel;
            champion.ms = championStats.movespeed;
            champion.omnivamp = 0;
            champion.range = championStats.attackrange;
            champion.slowresist = 0;
            champion.tenacity = 0;
            
            updateChampionStats();
        })
        .catch(error => console.error('Error fetching champion data:', error));

});

function updateChampionStats() {
    for (const key in spans) {
        if (spans.hasOwnProperty(key)) {
            spans[key].innerHTML = champion[key];
        }
    }
}