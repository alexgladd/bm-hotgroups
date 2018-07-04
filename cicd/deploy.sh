#!/usr/bin/env bash
set -ev

BUILD_DIR=build
BUCKET=gladdbiz-bmactivity

# build scripts must have succeeded
[[ "${TRAVIS_TEST_RESULT}" -eq "0" ]] || ( exit 1 )

# build must exist
[[ -d ${BUILD_DIR} ]] || ( exit 1 )

# sync build with S3 bucket
aws s3 sync ${BUILD_DIR} s3://${BUCKET} --delete
