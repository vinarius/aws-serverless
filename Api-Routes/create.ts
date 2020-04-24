'use strict'

import * as uuid from 'uuid'
import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

export default async (event, context, callback): Promise<DynamoDB.DocumentClient.PutItemOutput> => {
  try {
    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)

    if (typeof data.text !== 'string') {
      console.error(`Validation Failed. Request body 'text' property must be of type 'string'.`)
      throw new Error('Error conjuring magic spells.')
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuid.v1(),
        text: data.text,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    }

    return await dynamoDb.put(params).promise()

    // // Write to the database.
    // dynamoDb.put(params, (error, result) => {
    //   // handle potential errors
    //   if (error) {
    //     console.error(error)
    //     throw new Error('Error conjuring magic spells.')
    //   }

    //   console.log('the callback result is:', result)

    //   // create a response
    //   const response = {
    //     statusCode: 200,
    //     body: JSON.stringify(result)
    //   }
    //   callback(null, response)
    // })
  } catch (error) {
    console.error('Failure inserting magic:', error.message)
    return error.message
  }
}
