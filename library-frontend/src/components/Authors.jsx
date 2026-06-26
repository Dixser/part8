import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS } from '../queries/queries'
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { UPDATE_AUTHOR } from '../queries/queries'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }
  const authors = result.data.allAuthors
  const onSubmit = (event) => {
    event.preventDefault()
    if (!name || !born) {
      return
    }

    updateAuthor({
      variables: {
        name,
        born: parseInt(born),
      },
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="setBirthyear">
        <h3>Set birthyear</h3>
        <label>
          name
          <select
            name="name"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          >
            <option name="" id=""></option>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          born
          <input
            type="number"
            name="born"
            id="born"
            value={born}
            onChange={(event) => setBorn(event.target.value)}
          />
        </label>
        <br />
        <button type="submit" onClick={onSubmit}>
          update author
        </button>
      </div>
    </div>
  )
}

export default Authors
