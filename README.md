# Delete Lambda Layers Action

This action takes given aws credentials and deletes lambda layers from oldest to newest until the provided amount remains

## Usage
This example would remove dependencies from oldest to newest until there were 6 versions remaining.
```yaml
name: Trim AWS Lambda Layers

on:
  release:
    types: [created]
  push:
    branches:
      - master

jobs:
  update_lambda_layers:
  	name: Trim layer versions
    runs-on: ubuntu-latest
    steps:
      - name: Trim versions
        uses: callummackenzie/trim-lambda-layers-action@v0.1
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: ${{ secrets.AWS_REGION }
          layer_name: SomeAWSLambdaLayer
          version_keep_count: 6
```
## Parameters
- aws_access_key_id
  - Required
  - The aws access key id for an IAM user
- aws_secret_access_key
  - Required
  - The secret access key for the same IAM user used in aws_access_key_id
- aws_region
  - Required
  - The aws region in which the desired lambda function is located such as us-east-1
- layer_name
  - Required
  - The layer function name to be updated (not the ARN)
- version_keep_count:
  - Required
  - The number of latest versions to keep
  - Default is 4

## AWS Permissions Policy
The AWS IAM user this action uses must have permissions to:
- **lambda:ListLayerVersions** for the desired layer
- **lambda:DeleteLayerVersion** for the desired layer