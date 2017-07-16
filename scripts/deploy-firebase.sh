#! /bin/bash

ng build -prod

rsync -avh ./dist/ ./firebase/public/ --delete

cd firebase

sudo firebase deploy

