#/bin/bash

export VITE_AWS_REGION="us-east-1"
export VITE_USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name CdkStack --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" --output text)
export VITE_USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name CdkStack --query "Stacks[0].Outputs[?OutputKey=='UserPoolClientId'].OutputValue" --output text)
export VITE_IDENTITY_POOL_ID=$(aws cloudformation describe-stacks --stack-name CdkStack --query "Stacks[0].Outputs[?OutputKey=='IdentityPoolId'].OutputValue" --output text)
export VITE_TRANSCRIBE_SAMPLING_RATE=48000
export VITE_TRANSCRIBE_AUDIO_SOURCE="ScreenCapture" # ScreenCapture or MicroPhone