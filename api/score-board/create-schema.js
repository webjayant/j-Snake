#!/usr/bin/env node
const process = require('process')

/* bootstrap database in your FaunaDB account - use with `netlify dev:exec <path-to-this-file>` */
const { Client, query } = require('faunadb')

const createFaunaDB = async function () {
  if (!process.env.FAUNADB_SERVER_SECRET) {
    console.log('No FAUNADB_SERVER_SECRET in environment, skipping DB setup')
  }
  console.log('Create the database!')
  const client = new Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  })

  /* Based on your requirements, change the schema here */
  try {
    await client.query(query.CreateCollection({ name: 'userScores' }))

    console.log('Created items class')
    await client.query(
      query.CreateIndex({
        name: 'all_userScores',
        source: query.Collection('userScores'),
        values: [
          {
            field: ["data", "score"],
            reverse: true
          },
          {
            field: ["ref"]
          }
        ]
      }),
    )



     await client.query(
      query.CreateIndex({
        name: 'user_Score_By_Email',
        source: query.Collection('userScores'),
        terms: [
          {
            field:  ["data","email"]
          }
        ]
      })
    )

    return await client.query(
      query.CreateIndex({
        name: 'user_Score_By_Email_ref',
        source: query.Collection('userScores'),
        terms: [
          {
            field:  ["data","email"]
          }
        ],
        values: [
          {
            field: ["ref"]
          }
        ]
      })
    )
  } catch (error) {
    if (error.requestResult.statusCode === 400 && error.message === 'instance not unique') {
      console.log('DB already exists')
    }
    throw error
  }
}

createFaunaDB()
