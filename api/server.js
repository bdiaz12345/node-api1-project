// BUILD YOUR SERVER HERE
const express = require('express')
const generate = require('shortid').generate
const users = require('./users/model')


const app = express()
app.use(express.json())

app.post('/api/users', (req, res) => {
    const {name, bio} = req.body

    if (!name || !bio) {
        res.status(400).json({message: 'name and bio are required'})
    } else {
        const newUser = {
            id: generate(),
            name,
            bio
        }
        users.insert(newUser)
        res.status(201).json(newUser)  
    }
})

app.get('/api/users', (req, res) => {
    const userList = users.find()
    try {
        res.status(200).json(userList)
    } catch (e) {
        res.status(500).json({message: 'the users information could not be retrieved'})
    }
})

app.get('/api/users/:id', (req, res) => {
    const idVar = req.params.id
    const person = users.findById(idVar)

    if (!person) {
        res.status(404).json({message: '404 not found'})
    } else {
        res.status(200).json(person)
    }
})

app.delete('/api/users/:id', (req, res) => {
    const idVar = req.params.id
    try {
        if (!users.findById(idVar)){
            res.status(404).json({message: '404 not found'})
        } else {
            users.remove(idVar)
            res.status(200).json({message: 'deleted!'})
        }
    } catch (e) {
        res.status(500).json({message: `Server error: ${e}`})
    }
})

app.put('/api/users/:id', (req, res) => {
    const id = req.params.id
    const {name, bio} = req.body
    
    try {
        users.update(id, {name, bio})
        res.status(200).json({id, name, bio})
    } catch (e) {
        res.status(500).json({message: `Server error: ${e}`})
    }
})

module.exports = app; // EXPORT YOUR SERVER instead of {}
