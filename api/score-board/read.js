/* Import faunaDB sdk */
const process = require('process')

const { Client, query } = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async (event) => {
  const { email } = event
  console.log(`Function 'read' invoked. Read id: ${email}`)

  try {
    const response = await client.query(query.Get(query.Match(query.Index('user_Score_By_Email'), email)))
    console.log('success', response)
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    }
  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
}

module.exports = { handler }
