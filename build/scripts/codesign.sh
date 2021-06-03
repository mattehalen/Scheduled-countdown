#!/usr/bin/env bash
MY_APP_PATH=/Users/mathiashalen/Documents/GitHub/Scheduled-countdown/electron-output/mac/Scheduled-Countdown.app
MY_SIGN_APPLICATION="3rd Party Mac Developer Installer: Mathias Halen (F8993Q6N82)"
#MY_SIGN_APPLICATION="3rd Party Mac Developer Application: Mathias Halen (F8993Q6N82)"
MY_OUTPUT_PKG=/Users/mathiashalen/Documents/GitHub/Scheduled-countdown/electron-output
ENTITLEMENTS=build/entitlements.mac.plist 

# #INFO BEFORE SIGNING
echo "---------->>> INFO BEFORE SIGNING"
codesign --display --verbose=2 $MY_APP_PATH #electron-output/mac/Scheduled-Countdown.app

echo "---------->>> SIGNING"
# #codesign --sign $MY_SIGN_APPLICATION $MY_APP_PATH --timestamp -o runtime #electron-output/mac/Scheduled-Countdown.app --timestamp -o runtime
 codesign --deep --options runtime --sign "$MY_SIGN_APPLICATION" --entitlements $ENTITLEMENTS $MY_APP_PATH —-timestamp 

# echo "---------->>> INFO AFTER SIGNING"
# codesign --display --verbose=2 $MY_APP_PATH #electron-output/mac/Scheduled-Countdown.app



#echo "------------------------------------------------------------------------------------------"
#sudo pkgbuild --component electron-output/mac/Scheduled-Countdown.app --install-location /Applications --sign "Developer ID Installer: Mathias Halen (F8993Q6N82)" ~/desktop/Scheduled-Countdown.pkg

#productsign --sign "Developer ID Installer: Mathias Halen (F8993Q6N82)" ~/Desktop/Scheduled-Countdown.pkg ~/Desktop/signed-Scheduled-Countdown.pkg

exit 0