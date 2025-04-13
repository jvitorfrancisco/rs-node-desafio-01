import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('tasks.csv', import.meta.url)

async function handler() {
    const records = fs
        .createReadStream(csvPath)
        .pipe(parse({
            fromLine: 2,
            delimiter: ',',
            skipEmptyLines: true,
        }))

    for await (const record of records) {
        const [title, description] = record

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        })
    }
}

handler()