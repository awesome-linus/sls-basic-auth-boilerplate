import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'sls-basic-auth-boilerplate',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    // 2021/03時点では、LambdaEdgeとしてCloudFrontへ紐づける場合は、
    // node12系、us-east-1でないといけないので注意。
    runtime: 'nodejs12.x',
    region: 'us-east-1',
    deploymentBucket: {
      name: 'sls-basic-auth-boilerplate-deployment'
    },
    stage: "${opt:stage, 'dev'}",
    lambdaHashingVersion: '20201221',
    timeout: 900,
    role: 'roleLambdaEdge'
  },
  functions: { 
    'basic-auth': {
      handler: 'src/functions/index.handler',
      memorySize: 128,
      timeout: 5,
      name: '${self:provider.stage}-basic-auth'
    }
  },
  resources: {
    Resources: {
      roleLambdaEdge: {
        Type: 'AWS::IAM::Role',
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: ['lambda.amazonaws.com', 'edgelambda.amazonaws.com']
                },
                Action: ['sts:AssumeRole']
              }
            ]
          }
        }
      }
    }
  }
}

module.exports = serverlessConfiguration;
