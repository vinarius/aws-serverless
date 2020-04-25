'use strict'

// Import env variables
import { config } from 'dotenv'
config()

import * as uuid from 'uuid'
import { DynamoDB, S3 } from 'aws-sdk'
import { BatchWriteItemInput, WriteRequest, DocumentClient, BatchWriteItemOutput } from 'aws-sdk/clients/dynamodb'
const myRegion: string = 'us-east-1'
const dynamoDb: DocumentClient = new DynamoDB.DocumentClient({
  region: myRegion,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})
const s3: S3 = new S3({
  region: myRegion,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})
const bucketName: string = process.env.BUCKET_NAME

function prepareDataAndExecuteBatchWrites (dataSet: any[], tableName: string, timestamp: number): Promise<BatchWriteItemOutput[]> {
  const batches: WriteRequest[][] = []
  let dynamoDbWriteBatch: WriteRequest[] = []

  dataSet.forEach((value: any) => {
    const PutRequest: WriteRequest = {
      PutRequest: {
        Item: {
          id: uuid.v1(),
          createdAt: timestamp,
          updatedAt: timestamp,
          ...value
        }
      }
    }

    dynamoDbWriteBatch.push(PutRequest)

    // DynamoDB batch writes only accept up to 25 write requests at a time.
    // Therefore, I divided the data into batches and made however many calls necessary with 25 data write requests per batch.
    if (dynamoDbWriteBatch.length === 25) {
      batches.push(dynamoDbWriteBatch)
      dynamoDbWriteBatch = []
    }

    if (dynamoDbWriteBatch.length > 0) batches.push(dynamoDbWriteBatch)
  })

  const batchWriteParamsArr: Promise<BatchWriteItemOutput>[] = []
  batches.forEach((batch: WriteRequest[]) => {
    const batchWriteParams: BatchWriteItemInput = {
      RequestItems: {}
    }
    batchWriteParams['RequestItems'][tableName] = batch
    batchWriteParamsArr.push(dynamoDb.batchWrite(batchWriteParams).promise())
  })

  return Promise.all(batchWriteParamsArr)
}

export interface LambdaResponse {
  statusCode: number
  body: string
}

export async function create (): Promise<LambdaResponse> {
  const timestamp: number = new Date().getTime()

  const housesDataStringified: string = (await s3.getObject({ Bucket: bucketName, Key: 'houses.json' }).promise()).Body.toString()
  const charactersDataStringified: string = (await s3.getObject({ Bucket: bucketName, Key: 'characters.json' }).promise()).Body.toString()
  const spellsDataStringified: string = (await s3.getObject({ Bucket: bucketName, Key: 'spells.json' }).promise()).Body.toString()

  const housesData: object = JSON.parse(housesDataStringified)
  const charactersData: object = JSON.parse(charactersDataStringified)
  const spellsData: object = JSON.parse(spellsDataStringified)

  try {
    await prepareDataAndExecuteBatchWrites(housesData['data'], 'Houses', timestamp)
    await prepareDataAndExecuteBatchWrites(charactersData['data'], 'Characters', timestamp)
    await prepareDataAndExecuteBatchWrites(spellsData['data'], 'Spells', timestamp)
  } catch (error) {
    console.error('error conjuring magic:', error)
    throw new Error(error)
  }

  return {
    statusCode: 200,
    body: 'Lambda function succeeded. Go check your tables!'
  }
}
