#!/bin/bash

echo "Running all .robot tests"
files=$(ls *.robot)
python -m robot $files