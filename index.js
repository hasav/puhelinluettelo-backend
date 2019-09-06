require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())


app.get('/api/persons', (req, res, next) => {
    Person.find({})
    .then(persons => {
        res.json((persons.map(person => person.toJSON())))
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    Person.find({})
    .then(persons => {
        const num = persons.length
        const datetime = new Date()
        res.send(`<p>Phonebook has info for ${num} people</p>
        <p>${datetime}</p>`)
    })
    .catch(error => next(error))
    
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) {
            res.json(person.toJSON())
        } else {
            res.status(404).end()
        }
      })
      .catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
   
})

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (req, res, next) => {
    const body = req.body


    const person = new Person({
        name: body.name,
        number: body.number
    })
        
    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })

    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body 

    const person = {
        name: body.name,
        number: body.number 
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log("error handler called")
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json( { error: error.message })
    }
  
    next(error)
  }
  
  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server is running on port ${PORT}`)