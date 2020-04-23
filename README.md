# User Stories

Build a serverless framework (serverless.com) deployment that creates a Lambda, an S3 bucket, and a Dynamo DB table and uploads a file to your bucket. Then, write a plugin that invokes the Lambda after the deployment, extracts data from the file in S3 and inserts that data into DynamoDB. Be creative. Show off. Make it interesting.

## Typescript

TypeScript (ts) offers type safety which is helpful when working with the AWS SDK, which comes with ts definitions (d.ts)

## Compiling

You can compile the ts files in this directory by 1st installing typescript via

`npm i -g typescript`

then

`npm i`

You can then run the compiler by running `tsc` in this directory. It will pull the settings from .tsconfig and extra @types
from package.json. The output create.js file is what will be uploaded by serverless.

For brevity, I have just demonstrated this to match with the todos/create.js lambda function


## Work History

I used npm to install and use a cloud template library called 'serverless'.

I cloned one of their repositories which leverages dynamodb and typescript.

I created an IAM user and generated an access key and a secret key so I could use aws services programatically.

I stored the access keys in environment variables, leaving them out of the repository and source code.

I then used the 'serverless deploy' command to take the local code, leverage the aws user to go into cloud formation, and generate the stack.

What did it generate:
    DynamoDb table
    S3 Bucket Policy
    S3 Bucket
    IAM role for lambada execution
    Lambda logging capabilities with cloudwatch
    Lambda function
    Modified lambda function's apigateway permissions
    Apigateway resources:
        rest api
        created a route for /todos
            POST method (insert data in DynamoDB)
            Options method (get metadata on what http methods are available for this route)
        Apigateway deployment

I can now send a POST request to:
https://5a8k75s8t3.execute-api.us-east-1.amazonaws.com/dev/todos
Send in the request body
{
    "text": <This string will be inserted into the dynamoDB table!>
}