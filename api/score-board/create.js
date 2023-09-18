const process = require('process')

const { Client, query } = require('faunadb')

/* configure faunaDB Client with our secret */
const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

/* export our lambda function as named "handler" export */
const handler = async (event) => {
  /* parse the string body into a useable JS object */
  const data = JSON.parse(event.body)
  console.log('Function `create` invoked', data)
  const item = {
    data: data.body,
  }
  /* construct the fauna query */
  try {
    const response = await client.query(query.Let({match: query.Match(query.Index('user_Score_By_Email', item.email)), data:item},query.If(query.Exists(query.Var('match')),query.Update(query.Select('ref', query.Get(query.Var('match'))), query.Var('data')),query.Create(query.Collection('userScores'), query.Var('data')))))
    console.log('success', response)
    /* Success! return the response with statusCode 200 */
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    console.log('error', error)
    /* Error! return the error with statusCode 400 */
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
}

module.exports = { handler }
