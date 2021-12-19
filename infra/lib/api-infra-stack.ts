import * as core from 'aws-cdk-lib';
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as pat from "aws-cdk-lib/aws-ecs-patterns";
import * as iam from "aws-cdk-lib/aws-iam";
import {Construct} from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as logs from "aws-cdk-lib/aws-logs";

export interface NestRestInfraStackProps extends core.StackProps{
  fargateCluster: ecs.Cluster;
  ecrRepo: ecr.Repository;
  dockerImageTag: string;
}

export class ApiInfraStack extends core.Stack {

  constructor(scope: Construct, id: string, props: NestRestInfraStackProps) {

    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'ApiTaskDef', {
      family: 'nest-api',
      cpu: 256,
      memoryLimitMiB: 512
    });

    taskDefinition.addContainer('api-image', {
      containerName: 'api',
      image: ecs.ContainerImage.fromEcrRepository(props.ecrRepo, props.dockerImageTag),
      portMappings: [{containerPort: 3000}],
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'api',
        logRetention: logs.RetentionDays.ONE_WEEK
      })
    });

    const taskExecutionPolicy = iam.ManagedPolicy.fromManagedPolicyArn(this, 'task-exec-policy', 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy')
    taskDefinition.executionRole?.addManagedPolicy(taskExecutionPolicy);

    new pat.ApplicationLoadBalancedFargateService(this, 'ApiService', {
      serviceName: 'nest-api-service',
      cluster: props.fargateCluster,
      taskDefinition,
      desiredCount: 1,
      assignPublicIp: true
    });

  }

}
