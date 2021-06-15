#!/usr/bin/env bash
MY_APP_PATH=/Users/mathiashalen/GitHub/Scheduled-countdown/electron-output/mas/Scheduled-Countdown.app

#echo "----------------------------------------------------------------------------------------------------"
#echo "---------->>> codesign -dv -r- "
#codesign -dv -r- $MY_APP_PATH

#echo "----------------------------------------------------------------------------------------------------"
#echo "---------->>> codesign --display --verbose=2"
#codesign --display --verbose=2 $MY_APP_PATH

#echo "----------------------------------------------------------------------------------------------------"
#echo "---------->>> codesign --verify --verbose "
#codesign --verify --verbose $MY_APP_PATH

echo "----------------------------------------------------------------------------------------------------"
echo "---------->>> spctl --assess --verbose "
spctl --assess --verbose $MY_APP_PATH

exit 0