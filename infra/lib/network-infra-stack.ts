import * as core from 'aws-cdk-lib/core';
import {Construct} from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";

export class NetworkInfraStack extends core.Stack {

    public readonly vpc: ec2.Vpc;
    public readonly ecrRepo: ecr.Repository;
    public readonly fargateCluster: ecs.Cluster;

    constructor(scope: Construct, id: string, props: core.StackProps) {

        super(scope, id, props);

        this.vpc = new ec2.Vpc(this, 'AppVpc', {
            maxAzs: 2,
            subnetConfiguration: [
                {subnetType: ec2.SubnetType.PUBLIC, name: 'DMZ'}
            ]
        });

        this.fargateCluster = new ecs.Cluster(this, 'AppCluster', {
            vpc: this.vpc,
            clusterName: 'app-cluster'
        });

        this.ecrRepo = new ecr.Repository(this, 'ApiRepository', {
            repositoryName: 'nest-rest-api',
            removalPolicy: core.RemovalPolicy.DESTROY
        });
    }
}