const fs = require('fs');
const mysql = require('mysql2');
require('dotenv').config({path:'itens/credentials.env'});
const functions = require('./functions.js');
const sql = 'INSERT INTO lol_items SET ?';

console.log(process.env.DB_HOST);
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

let dataJson = fs.readFileSync('items/wikidata.json', 'utf8');
const formattedData = functions.formatingJson(dataJson);

const keys = ['ah', 'hp', 'ad', 'ap', 'armor', 'mr', 'mana', 'hp5', 'mp5', 'msflat', 'ms', 'hsp', 'attack_speed', 'lethality', 'gp10', 'lifesteal', 'mpen', 'crit', 'omnivamp', 'hp5flat', 'critdamage', 'mpenflat', 'armpen'];

for (const item in formattedData) {
    const itemData = {
        id: formattedData[item].id,
        name: item,
        price: formattedData[item].buy,
    };

    for (const key of keys) {
        itemData[key] = formattedData[item].stats?.[key] ?? 0;
    }

    connection.query(sql, itemData, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Item inserted successfully!');
            console.log(results);
        }
    });
    fs.writeFileSync('items/jsons/'+item+'.json', JSON.stringify(itemData),'utf-8');
}
connection.end();
