#!/usr/bin/env bash

chmod +x '/Users/mathiashalen/Documents/GitHub/Scheduled-countdown/build/scripts/checkCodesign.sh'
chmod +x '/Users/mathiashalen/Documents/GitHub/Scheduled-countdown/build/scripts/codesign.sh'

#sh /Users/mathiashalen/Documents/GitHub/Scheduled-countdown/build/scripts/checkCodesign.sh
echo "----------"
sh /Users/mathiashalen/Documents/GitHub/Scheduled-countdown/build/scripts/codesign.sh
echo "----------"
#sh /Users/mathiashalen/Documents/GitHub/Scheduled-countdown/build/scripts/checkCodesign.sh

exit 0