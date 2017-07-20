#!/bin/bash
echo "aws s3 sync . s3://rcom-env-info/ --exclude *.sh --delete"
aws s3 sync . s3://rcom-env-info/ --exclude *.sh --delete
echo -------- done ---------
