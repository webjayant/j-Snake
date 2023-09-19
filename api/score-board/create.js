const process = require('process');

const { Client, query } = require('faunadb');

/* configure faunaDB Client with our secret */
const client = new Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
});

/* export our lambda function as named "handler" export */
const handler = async (event) => {
    /* parse the string body into a useable JS object */
    const data = JSON.parse(event.body);
    console.log('Function `create` invoked', data);
    const item = {
        data: data,
    };
    /* construct the fauna query */
    try {
        const response = await client.query(
            query.Get(
                query.Match(query.Index('user_Score_By_Email'), item.data.email)
            )
        );
        if (response.data && response.data.email === item.data.email) {
            try {
                const updateResponse = await client.query(
                    query.Update(response.ref, item)
                );
                return {
                    statusCode: 200,
                    body: JSON.stringify(updateResponse),
                };
            } catch (error) {
              console.log(error, 'error after update')
                return {
                    statusCode: 400,
                    body: JSON.stringify(error),
                };
            }
        }
    } catch (error) {
        console.log(error, 'error after get')
        if (error.errorType === 'NotFound' || error.description === 'Set not found.') {
            try {
                const createResponse = await client.query(
                    query.Create(query.Collection('userScores'), item)
                );
                return {
                    statusCode: 200,
                    body: JSON.stringify(createResponse),
                };
            } catch (error) {
              console.log(error, 'error after create')
                return {
                    statusCode: 400,
                    body: JSON.stringify(error),
                };
            }
        }
    }
    /* Success! return the response with statusCode 200 */
};

module.exports = { handler };
