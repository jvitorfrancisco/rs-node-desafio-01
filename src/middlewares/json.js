export async function json(req, res) {
    try {
        const buffers = []

        for await (const chunk of req) {
            buffers.push(chunk)
        }

        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

    res.setHeader('Content-type', 'application/json')
}