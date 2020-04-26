'use strict'

class InvokeConjureLambdaCustomPlugin {

  // No documentation found on serverless types. Custom type definitions may be required.
  // Would need to spend more time researching.
  serverless: any
  hooks: any
  provider: any

  // Can call this.provider.request('Lambda', 'invoke' params) - uses aws-sdk under the hood
  // or just use aws-sdk directly.

  constructor (serverless: any) {
    this.serverless = serverless
    this.provider = this.serverless.getProvider('aws')

    this.hooks = {
      'after:deploy:deploy': () => this.afterDeployLifeCycleCompletes()
    }
  }

  afterDeployLifeCycleCompletes () {
    this.provider.request('Lambda', 'invoke', {
      FunctionName: 'aws-serverless-dev-conjure'
    })

    this.serverless.cli.consoleLog(`My Custom Plugin - invoke-conjure-lambda: Magic conjuration complete!`)
  }
}

module.exports = InvokeConjureLambdaCustomPlugin
// Have to use module.exports, using 'export' keyword changes naming when compiled
// and the serverless framework does not account for this change.
