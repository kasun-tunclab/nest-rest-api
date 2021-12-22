import * as core from 'aws-cdk-lib';
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as pat from "aws-cdk-lib/aws-ecs-patterns";
import * as iam from "aws-cdk-lib/aws-iam";
import {Construct} from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as logs from "aws-cdk-lib/aws-logs";
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as r53Targets from 'aws-cdk-lib/aws-route53-targets';

export interface NestRestInfraStackProps extends core.StackProps{
  fargateCluster: ecs.Cluster;
  ecrRepo: ecr.Repository;
  dockerImageTag: string;
}

export class ApiInfraStack extends core.Stack {

  constructor(scope: Construct, id: string, props: NestRestInfraStackProps) {

    super(scope, id, props);

    const hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: 'kasun.clearsigma.com',
    });

    const apiCert = new acm.Certificate(this, 'Certificate', {
      domainName: 'api.nest.kasun.clearsigma.com',
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'ApiTaskDef', {
      family: 'nest-api',
      cpu: 256,
      memoryLimitMiB: 512
    });

    taskDefinition.addContainer('ApiImage', {
      containerName: 'nest-api-container',
      image: ecs.ContainerImage.fromEcrRepository(props.ecrRepo, props.dockerImageTag),
      portMappings: [{containerPort: 3000}],
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'api',
        logRetention: logs.RetentionDays.ONE_WEEK
      })
    });

    const taskExecutionPolicy = iam.ManagedPolicy.fromManagedPolicyArn(this, 'TaskExecutionPolicy', 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy')
    taskDefinition.executionRole?.addManagedPolicy(taskExecutionPolicy);

    const service = new pat.ApplicationLoadBalancedFargateService(this, 'ApiService', {
      serviceName: 'nest-api-service',
      cluster: props.fargateCluster,
      taskDefinition,
      desiredCount: 1,
      assignPublicIp: true,
      redirectHTTP: true,
      certificate: apiCert,
      circuitBreaker: {
        rollback: true,
      }
    });

    service.targetGroup.configureHealthCheck({
      path: '/v1/ping'
    });

    const albTarget = new r53Targets.LoadBalancerTarget(service.loadBalancer)

    new route53.ARecord(this, 'AlbARecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(albTarget)
    });

  }

}
