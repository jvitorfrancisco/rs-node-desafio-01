import { routes } from "../routes.js";
import { extractQueryParams } from "../utils/extract-query-params.js";

export function router(req, res) {
    const { method, url } = req

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if (route) {
        const routeParams = req.url.match(route.path)

        const { query, ...params } = routeParams.groups

        req.query = query ? extractQueryParams(query) : {}
        req.params = params

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
}