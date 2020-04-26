# User Stories

Build a [serverless framework](https://serverless.com) deployment that creates a Lambda, an S3 bucket, and a Dynamo DB table and uploads a file to your bucket. Then, write a plugin that invokes the Lambda after the deployment, extracts data from the file in S3 and inserts that data into DynamoDB. Be creative. Show off. Make it interesting.

## Getting Started

You must have an active account registered with [AWS](https://amazon.com/aws/Account/Sign-Up) as well as [Serverless](https://serverless.com) for the application to function.

The following environment variables are required:
- ACCESS_KEY_ID - Your aws account key id.
- SECRET_ACCESS_KEY - Your aws account secret access key.
- BUCKET_NAME - Desired s3 bucket to load data into and extract out of. Must be a globally unique name conforming to [s3 standards](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html).
- MY_AWS_REGION - Desired region to generate stack resources in.

Run the following commands to get started:
`npm i`
`npm run tsc`

The output conjure.js file is what will be uploaded by serverless.

The Serverless library must be globally installed. You can visit the [getting started](https://serverless.com/framework/docs/getting-started#install-via-npm) docs for more info.

Once your AWS and Serverless accounts are registered and environment variables are set, run the following command to setup the application and cloud stack in your AWS account:
`serverless deploy`

## Work History

This repository uses a library called 'serverless'.
I created an IAM user and generated an access key and a secret key so I could use aws services programatically.
I stored the access keys in environment variables, leaving them out of the repository and source code.
I then used the 'serverless deploy' command to take the local code, leverage the aws user to go into cloud formation, and generate the stack.

What did it generate:
- DynamoDb Spells Table
- DynamoDb Houses Table
- DynamoDb Characters Table
- S3 Bucket
- S3 Bucket Policy
- IAM role for lambda execution
- Lambda logging capabilities with cloudwatch
- Lambda function
