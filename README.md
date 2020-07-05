# CoinHippo API

## Endpoints
- [https://api.coinhippo.io](https://api.coinhippo.io)

## Stacks
- AWS Lambda
- AWS API Gateway
- AWS EventBridge

## Deployment
### Prerequisites
1. [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-prereqs.html)
2. [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
3. [Install terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)

### Install dependencies
```bash
cd ./functions/api
cp config.yml.example config.yml
yarn
```

### Deploy services
```bash
cd ./terraform/api
terraform ini