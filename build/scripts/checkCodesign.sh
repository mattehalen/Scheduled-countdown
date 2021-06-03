#!/usr/bin/env bash

codesign -dv -r- electron-output/mac/Scheduled-Countdown.app
codesign --display --verbose=2 electron-output/mac/Scheduled-Countdown.app

exit 0