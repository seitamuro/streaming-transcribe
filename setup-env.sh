#/bin/bash

export VITE_USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name CdkStack --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" --output text)
export VITE_USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name CdkStack --query "Stacks[0].Outputs[?OutputKey=='UserPoolClientId'].OutputValue" --output text)
export VITE_IDENTITY_POOL_ID=$(aws cloudformation describe-stacks --stack-name CdkStack --query "Stacks[0].Outputs[?OutputKey=='IdentityPoolId'].OutputValue" --output text)