const express = require('express')
const morgan = require('morgan')
require('dotenv').config()

const Person = require('./models/person.js')

const app = express()

morgan.token('req-body', (req) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	}
	return ''
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {

	if (error.name === 'CastError')
		return res.status(400).send({ error: 'malformatted id' })
	else if (error.name === 'ValidationError')
		return res.status(400).json({ error: error.message })

	next(error)
}

app.use(express.static('dist'))

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons =>
		res.json(persons)
	)
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id).then(person => {
		if (person)
			res.json(person)
		else
			res.status(404).end()
	})
		.catch(error => next(error))
})

app.get('/info', (req, res, next) => {
	Person.countDocuments({}).then(count => {
		res.send(`<p>Phonebook has info for ${count} people</p>
		<p>${new Date()}</p>`)
	})
		.catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson => {
		res.json(savedPerson)
	})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const { name, number } = req.body

	Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id).then(() => {
		res.status(204).end()
	})
		.catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})