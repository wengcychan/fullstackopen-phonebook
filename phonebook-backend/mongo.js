const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}
else if (process.argv.length == 4) {
	console.log('give name/number as argument')
	process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4]
	})
	person.save().then(result => {
		console.log(`added ${result.name} number ${result.number} to phonebook`)
		mongoose.connection.close()
	})
}
else {
	Person.find({}).then(result => {
		console.log('phonebook:')
		result.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
	})
}