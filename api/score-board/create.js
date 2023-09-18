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
    data: data,
  }
  /* construct the fauna query */
  try {
    const response = await client.query(query.Get(query.Match(query.Index('user_Score_By_Email'), item.data.email)))
    console.log(response, 'get item rsp')
    if(response.data && response.data.email === item.data.email){
      const updateResponse = query.Update(response.ref, item)
      return {
        statusCode: 200,
        body: JSON.stringify(updateResponse),
      }
    }else{
      const createResponse = query.Create(query.Collection('userScores'), item)
      return {
        statusCode: 200,
        body: JSON.stringify(createResponse),
      }
    }
    /* Success! return the response with statusCode 200 */
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
