import app from './index.js'

const PORT = 3000

const server = app.listen(PORT, () => {
    console.log(`Server is listening to port:${PORT}`)
})

export default server