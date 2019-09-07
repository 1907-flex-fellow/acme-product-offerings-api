const express = require('express');
const path = require('path');
const inflection = require('inflection')

const db = require('./db');
const { pluralize } = inflection;

const { syncAndSeed, models } = db;
const app = express();
const port = process.env.port || 3000

app.get('/', (req, res, next)=>{
    res.sendFile(path.join(__dirname, './index.html'))
})

Object.entries(models).forEach(([name, model]) => {
    app.get(`/api/${pluralize(name)}`, (req, res, next)=>{
        model.findAll()
            .then(results => res.send(results))
            .catch(next)
    })
});

syncAndSeed()
    .then( () => app.listen(port, ()=>console.log(`listening on port ${port}`)))
    .catch(ex => console.log(ex))
