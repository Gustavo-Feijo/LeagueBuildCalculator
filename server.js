const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT||5500;

app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'buildcalculator.html'));
});

app.get('/:search', async (req, res) => {

  const search = req.params.search;
  try {
    res.sendFile(path.join(__dirname, 'public', 'champion.html'));
  } catch (error) {
    console.error(`Error reading JSON data for ${search}:`, error);
    res.redirect('/');
  }
});

app.get('/api/champions', async (req, res) => {
  const championsDirectory = path.join(__dirname, 'APIfiles', 'championsData');

  try {
    const files = await fs.readdir(championsDirectory);
    const championsData = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(championsDirectory, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
      })
    );
    res.json(championsData);
  } catch (error) {
    console.error('Error reading champion files:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/api/champions/:search', async (req, res) => {
  const search = req.params.search;
  const championDirectory = path.join(__dirname, 'APIfiles', 'championsData',  search + '.json');

  try {
    const champion = await fs.readFile(championDirectory, 'utf8');
    const data = JSON.parse(champion);
    res.json(data);
  } catch (error) {
    console.error('Error reading champion files:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/items', async (req, res) => {
  const itemDirectory = path.join(__dirname, 'APIfiles/item.json');
  try {
    const item = await fs.readFile(itemDirectory, 'utf8');
    const data = JSON.parse(item);
    res.json(data);
  } catch (error) {
    console.error('Error reading champion files:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
