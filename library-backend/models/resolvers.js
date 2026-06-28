require('dotenv').config()

const Book = require('./books')
const Author = require('./authors')
const User = require('./users')
const { GraphQLError } = require('graphql/error')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()



const resolvers = {
    Query: {
        booksCount: async () => await Book.estimatedDocumentCount(),
        authorCount: async () => await Author.estimatedDocumentCount(),
        allBooks: async (root, args) => {

            if (args.genre) {
                return await Book.find({ genres: args.genre }).populate('author')
            }
            if (args.author) {
                return await Book.find({ author: args.author }).populate('author')
            }
            return await Book.find({}).populate('author')
        },
        allAuthors: async () => await Author.find({}),
        me: (root, args, context) => {
            return context.currentUser
        },
    },
    Author: {
        bookCount: async (author) => {
            return await Book.countDocuments({ author: author.id })
        },
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                })
            }

            let author = await Author.findOne({ name: args.author })
            if (!author) {
                author = new Author({ name: args.author, born: null })
                try {
                    await author.save()
                } catch (error) {
                    throw new GraphQLError('There was an error saving the author', {
                        invalidArgs: args,
                    })
                }
            }

            const book = new Book({ ...args, author: author.id })

            try {
                await book.save()
            } catch (error) {
                throw new GraphQLError('There was an error saving the book', {
                    invalidArgs: args,
                })
            }

            pubsub.publish('BOOK_ADDED', { bookAdded: book })

            return book
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                })
            }
            const author = await Author.findOne({ name: args.name })
            if (!author) {
                throw new GraphQLError('Author not found', { invalidArgs: args })
            }
            author.born = args.setBornTo
            try {
                await author.save()
            } catch (error) {
                throw new GraphQLError('There was an error saving the author', {
                    invalidArgs: args,
                })
            }
            return author
        },
        createUser: async (root, args) => {
            const user = new User({ ...args })
            try {
                await user.save()
            } catch (error) {
                throw new GraphQLError('There was an error saving the user', {
                    invalidArgs: args,
                })
            }
            return user
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            if (!user || args.password !== 'secret') {
                throw new GraphQLError('Invalid credentials', {
                    code: 'BAD_USER_INPUT',
                })
            }
            const userForToken = {
                username: user.username,
                id: user._id,
            }
            return {
                value: jwt.sign(userForToken, process.env.JWT_SECRET)
            }
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
        },
    },
}

module.exports = resolvers