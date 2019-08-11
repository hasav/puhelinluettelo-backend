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


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json((persons.map(person => person.toJSON())))
    })
})

app.get('/info', (req, res) => {
    const num = persons.length
    const datetime = new Date()
    res.send(`<p>Phonebook has info for ${num} people</p>
    <p>${datetime}</p>`)
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

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name === '') {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    Person.find({name : body.name})
    .then(persons => {
        if (persons.length > 0) {
            return res.status(400).json({
                error: 'name must be unique'
            })
        }
        else {

            const person = new Person({
                name: body.name,
                number: body.number
            })
        
            person.save().then(savedPerson => {
                res.json(savedPerson.toJSON())
            })

        }
    })
    

})

const errorHandler = (error, request, response, next) => {
    console.log("error handler called")
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server is running on port ${PORT}`)