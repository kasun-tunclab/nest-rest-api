import * as core from 'aws-cdk-lib';
import {RemovalPolicy} from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as pat from "aws-cdk-lib/aws-ecs-patterns"

import {Construct} from "constructs";

export interface NestRestInfraStackProps extends core.StackProps{
  dockerImageTag: string
}

export class NestRestInfraStack extends core.Stack {

  constructor(scope: Construct, id: string, props: NestRestInfraStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'AppVpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {subnetType: ec2.SubnetType.PUBLIC, name: 'DMZ'}
      ]
    });

    const fargateCluster = new ecs.Cluster(this, 'AppCluster', {
      vpc,
      clusterName: 'app-cluster'
    });

    const ecrRepo = new ecr.Repository(this, 'ApiRepository', {
      repositoryName: 'nest-rest-api',
      removalPolicy: RemovalPolicy.DESTROY
    });

    new pat.ApplicationLoadBalancedFargateService(this, 'api-service', {
      cluster: fargateCluster,
      memoryLimitMiB: 512,
      cpu: 256,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(ecrRepo, props.dockerImageTag),
      }
    });
  }
}
