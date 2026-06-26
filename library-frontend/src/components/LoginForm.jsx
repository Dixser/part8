import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN, ALL_BOOKS } from '../queries/queries'

const LoginForm = (props) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [login] = useMutation(LOGIN, {
        refetchQueries: [{ query: ALL_BOOKS }]
    })

    if (!props.show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()
        const result = await login({ variables: { username, password } })
        const token = result.data.login.value
        props.setToken(token)
        localStorage.setItem('booklibrary-user-token', token)
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default LoginForm
