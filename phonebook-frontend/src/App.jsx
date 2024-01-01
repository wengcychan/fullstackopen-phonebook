import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Message from './components/Message'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState(null)


  useEffect(() => {
    phonebookService
      .getAll()
      .then(initalPhoneBook => {
        setPersons(initalPhoneBook)
      })
    }, [])


  const updatePerson = (person) => {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {

        phonebookService
          .update(person.id, {...person, number: newNumber})
          .then(person => {
            setPersons(persons.map(n => n.id !== person.id ? n : person))
            setMessage(`Added ${person.name}`)
            setTimeout(() => {setMessage(null)}, 5000)
          })
          .catch( () => {
              setMessage(`Information of ${person.name} has already been removed from server`)
              setTimeout(() => {setMessage(null)}, 5000)
              setPersons(persons.filter(n => n.id !== person.id))
          })
      }
  }

  const addName = (event) => {
    event.preventDefault();

    const person = persons.find((person) => person.name === newName)
    if (person)
      updatePerson(person)
    else
      phonebookService
        .create({ name: newName, number: newNumber})
        .then(person => {
          setPersons(persons.concat(person))
          setMessage(`Added ${person.name}`)
          setTimeout(() => {setMessage(null)}, 5000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setMessage(`${error.response.data.error}`)
          setTimeout(() => {setMessage(null)}, 5000)
        })

    setNewName('')
    setNewNumber('')
    setFilterName('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterName = (event) => {
    setFilterName(event.target.value)
  }

  const handleDetele = ( name, id ) => {
    if (confirm(`Delete ${name} ? `)) {
      phonebookService
        .remove(id)
        .then()
      setPersons(persons.filter(n => n.id !== id))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message}/>
      <Filter filterName={filterName} handleFilterName={handleFilterName} />
      <h2>Add New</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2> 
      <Persons persons={persons} filterName={filterName} handleDetele={handleDetele}/>
    </div>
  )
}

export default App