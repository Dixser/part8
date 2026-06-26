import { useQuery } from '@apollo/client/react'
import { GET_ME, ALL_BOOKS } from '../queries/queries'


const Recommended = (props) => {

  const result = useQuery(GET_ME)

  const favoriteGenre = result.data?.me?.favoriteGenre

  const bookList = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  })

  if (!props.show) {
    return null
  }


  if (result.loading) {
    return <div>loading...</div>
  }

  if (bookList.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommended for you ({favoriteGenre})</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookList.data.allBooks.length > 0 ? (
            bookList.data.allBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))
          ) : (
            <strong>No books matches your favourite genre</strong>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
