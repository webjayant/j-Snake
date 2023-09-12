const createRoute = require('./create.js')
const readAllRoute = require('./read-all.js')
const readRoute = require('./read.js')

const handler = async (event, context) => {
  const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '')
  const segments = path.split('/').filter(Boolean)

  switch (event.httpMethod) {
    case 'GET':
      // e.g. GET /.netlify/functions/fauna-crud
      if (segments.length === 0) {
        return readAllRoute.handler(event, context)
      }
      // e.g. GET /.netlify/functions/fauna-crud/123456
      if (segments.length === 1) {
        const [id] = segments
        event.id = id
        return readRoute.handler(event, context)
      }
      return {
        statusCode: 500,
        body: 'too many segments in GET request, must be either',
      }

    case 'POST':
      // e.g. POST /.netlify/functions/fauna-crud with a body of key value pair objects, NOT strings
      return createRoute.handler(event, context)
    default:
      return {
        statusCode: 500,
        body: 'unrecognized HTTP Method, must be one of GET/POST',
      }
  }
}

module.exports = { handler }
