#!/bin/bash

echo "Running gate 1 tests"
python -m robot 1.registering.robot 2.Login.robot 3.addapi.robot 4.apicat.robot 5.proxy.robot 6.profile.robot
