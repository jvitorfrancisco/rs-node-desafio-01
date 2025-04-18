import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
    #database = {}

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            }).catch(() => this.#persist())
    }

    insert(table, data) {
        const dataToInsert = {
            ...data,
            created_at: new Date(),
            updated_at: null,
        }
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(dataToInsert)
        } else {
            this.#database[table] = [dataToInsert]
        }

        this.#persist()
    }

    select(table, filter) {
        let data = this.#database[table]

        if (filter) {
            data = data.filter(row => {
                return Object.entries(filter).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            const dataOnDB = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = { id, ...dataOnDB, ...data, updated_at: new Date() }
            this.#persist()
        } else throw { message: 'Task not found', status: 404 }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        } else throw { message: 'Task not found', status: 404 }
    }
}