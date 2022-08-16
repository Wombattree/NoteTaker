const router = require("express").Router();
const uuid = require('../helpers/uuid');
const fs = require('fs');
const { writeToFile, readFromFile, readAndAppend } = require('../helpers/fsUtils');

router.get('/', (req, res) => 
{
    console.info(`${req.method} request received for notes`);
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

router.delete('/:id', (req, res) => 
{
    console.info(`${req.method} request received for notes. ID: ${req.params.id}`);

    let data = JSON.parse(fs.readFileSync("./db/db.json"));
    let parsedData = data.filter(element => element.id !== req.params.id);
    writeToFile("./db/db.json", parsedData);
    res.json(`Note deleted`);
});

router.post('/', (req, res) => 
{
    console.info(`${req.method} request received to add a tip`);

    const { title, text } = req.body;

    if (req.body && title && text) 
    {
        const newNote = 
        {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully 🚀`);
    } 
    else
    {
        res.error('Error in adding tip');
    }
});

module.exports = router;