import { randomUUID } from 'node:crypto'
import { Database } from "./database/database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database()

export const routes = [
    {
        path: buildRoutePath( '/tasks'),
        method: 'POST',
        handler: (req, res) => {
            const { title, description } = req.body

            const data = {
                id: randomUUID(),
                title, 
                description,
                completed_at: null,
            }
            
            const createdTask = database.insert('tasks', data)

            res.writeHead(201).end(JSON.stringify(createdTask))
        }
    },
    {
        path: buildRoutePath( '/tasks'),
        method: 'GET',
        handler: (req, res) => {
            const { search } = req.query
            const filter = search ? {
                title: search,
                description: search,
            } : null

            const tasks = database.select('tasks', filter)

            res.end(JSON.stringify(tasks))
        }
    },
    {
        path: buildRoutePath( '/tasks/:id'),
        method: 'PUT',
        handler: (req, res) => {
            try {
                const { id } = req.params
                const { title, description } = req.body

                const data = {
                    title, 
                    description,
                }

                database.update('tasks', id, data)
                
                res.writeHead(204).end()
            } catch (error) {
                res.writeHead(error.status).end(JSON.stringify(error))
            }
        }
    },
    {
        path: buildRoutePath( '/tasks/:id'),
        method: 'DELETE',
        handler: (req, res) => {
            try {
                const { id } = req.params

                database.delete('tasks', id)

                res.writeHead(204).end()
            } catch (error) {
                res.writeHead(error.status).end(JSON.stringify(error))
            }
        }
    },
    {
        path: buildRoutePath( '/tasks/:id/complete'),
        method: 'PATCH',
        handler: (req, res) => {
            try {
                const { id } = req.params

                database.update('tasks', id, { completed_at: new Date() })
                
                res.writeHead(204).end()
            } catch (error) {
                res.writeHead(error.status).end(JSON.stringify(error))
            }
        }
    }
]