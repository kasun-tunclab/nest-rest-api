#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiInfraStack } from '../lib/api-infra-stack';
import {NetworkInfraStack} from "../lib/network-infra-stack";

const app = new cdk.App();

const dockerImageTag = app.node.tryGetContext('dockerImageTag');

const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const networkStack = new NetworkInfraStack(app, 'NetworkInfraStack', {
  env
});

new ApiInfraStack(app, 'ApiInfraStack', {
  env,
  dockerImageTag,
  ecrRepo: networkStack.ecrRepo,
  fargateCluster: networkStack.fargateCluster
});