const Person = ({ person, handleDetele }) => (
  <div>
    {person.name} {person.number}
    <button onClick={handleDetele}>delete</button>
  </div>
)

const Persons = ({ persons, filterName, handleDetele }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().match(RegExp(`.*${filterName.toLowerCase()}.*`)))
  return (
    <div>
      {filteredPersons.map((person) => (
        <Person key={person.id} person={person} handleDetele={() => handleDetele(person.name, person.id)} />
      ))}
    </div>
  )
}

export default Persons