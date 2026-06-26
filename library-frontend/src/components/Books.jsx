import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries/queries'
import { useState } from 'react'

const Books = (props) => {
  const [filter, setFilter] = useState('')


  const genreList = useQuery(ALL_BOOKS)
  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre: filter
    }
  })

  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks


  const genres = [...new Set(genreList.data.allBooks.flatMap((book) => book.genres))]

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="filterList">
        <h2>filters</h2>
        <div>
          {genres.map((genre) => (
            <button onClick={(event) => setFilter(event.target.value)} value={genre} key={genre}>
              {genre}
            </button>
          ))}
          <button onClick={() => setFilter('')}>
            all genres
          </button>
        </div>
      </div>
    </div>
  )
}

export default Books
