import express from 'express';
import { writeFile, readFile } from 'fs/promises';

const initializeApp = () => {
    const app = express()

    // middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.route("/")
        .get(async (req, res, next) => {
            try {
                const { line1, city, state, zip } = req.query
                let matchAddresses = await readFile('./data/addresses.json', 'utf8')
                if (line1 || city || state || zip) {
                    matchAddresses = JSON.parse(matchAddresses).filter(address => {
                        return (
                            startsWith(address?.line1 || '', line1) ||
                            startsWith(address?.city || '', city) ||
                            startsWith(address?.state || '', state) ||
                            startsWith(address?.zip || '', zip)
                        )
                    })
                }
                res.status(200).json(matchAddresses)
            } catch (error) {
                next(err)
            }
        })
        .post(async (req, res, next) => {
            try {
                const { line1, city, state, zip } = req.body
                let message = 'JSON file updated successfully'
                let statusCode = 200
                if (areValidParameters(line1, city, state, zip)) {
                    let addresses = await readFile('./data/addresses.json', 'utf8')
                    addresses = JSON.parse(addresses)
                    const id = `${addresses.length + 1}`
                    addresses.push({ id, line1, city, state, zip })
                    await writeOnJsonFile(addresses)
                } else {
                    message = 'Error, one or more parameters missing'
                    statusCode = 400
                }
                res.status(statusCode).json(message)
            } catch (err) {
                next(err)
            }
        })

    app.route("/:id")
        .put(async (req, res, next) => {
            try {
                const { id } = req.params
                const { line1, city, state, zip } = req.body
                let message = 'Update made successfully'
                let statusCode = 200
                if (id && areValidParameters(line1, city, state, zip)) {
                    let addresses = await readFile('./data/addresses.json', 'utf8');
                    const updateJson = JSON.parse(addresses).map(obj => {
                        if (obj.id === id) {
                            return { id, line1, city, state, zip }
                        } else return obj
                    })
                    await writeOnJsonFile(updateJson)
                } else {
                    message = 'Error, missing parameters'
                    statusCode = 400
                }
                res.status(statusCode).json(message)
            } catch (err) {
                next(err)
            }
        })
        .delete(async (req, res, next) => {
            try {
                const { id } = req.params
                let message = 'Deletion made successfully'
                let statusCode = 200
                if (id) {
                    let addresses = await readFile('./data/addresses.json', 'utf8'); //import('./data/addresses.json', { assert: { type: "json" }});
                    const deletedJson = JSON.parse(addresses).filter(obj => {
                        if (obj.id !== id) {
                            return obj
                        }
                    })
                    await writeOnJsonFile(deletedJson)
                } else {
                    message = 'Error, missing parameters'
                    statusCode = 400
                }
                res.status(statusCode).json(message)
            } catch (err) {
                next(err)
            }
        })

    function startsWith(string, target) {
        target = `${target}`
        return string.slice(0, target.length) == target
    }

    const areValidParameters = (line1, city, state, zip) => {
        if (!line1) return false
        if (!city) return false
        if (!state) return false
        if (!zip) return false
        return true
    }

    const writeOnJsonFile = async (jsonObj) => {
        try {
            await writeFile('./data/addresses.json', JSON.stringify(jsonObj))
        } catch (error) {
            console.error('Error while writing the json file')
            throw new Error(error)
        }
    }

    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).send('Something went wrong')
    })
    return app
}
const app = initializeApp()
export default app