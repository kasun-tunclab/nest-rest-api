#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NestRestInfraStack } from '../lib/nest-rest-infra-stack';

const app = new cdk.App();

const dockerImageTag = app.node.tryGetContext('dockerImageTag');

new NestRestInfraStack(app, 'NestRestInfraStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  dockerImageTag
});