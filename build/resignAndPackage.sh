#!/bin/bash
# Name of your app.
APP="Scheduled-Countdown"
# The path of your app to sign.

APP_PATH="/Users/mathiashalen/Github/Scheduled-countdown/electron-output/mac/$APP.app"
# The path to the location you want to put the signed package.
RESULT_PATH="/Users/mathiashalen/Github/Scheduled-countdown/electron-output/mas/$APP-mac_store.pkg"
# The name of certificates you requested.
APP_KEY="3rd Party Mac Developer Application: Mathias Halen (F8993Q6N82)"
INSTALLER_KEY="3rd Party Mac Developer Installer: Mathias Halen (F8993Q6N82)"
# The path of your plist files.
PARENT_PLIST="build/entitlements.mas.plist"
CHILD_PLIST="build/entitlements.mas.inherit.plist"
LOGINHELPER_PLIST="build/entitlements.mas.loginhelper.plist"
FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Electron Framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Libraries/libffmpeg.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/Contents/MacOS/$APP Helper"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign -s "$APP_KEY" -f --entitlements "$LOGINHELPER_PLIST" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/Contents/MacOS/$APP Login Helper"
codesign -s "$APP_KEY" -f --entitlements "$LOGINHELPER_PLIST" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/MacOS/$APP"
codesign -s "$APP_KEY" -f --entitlements "$PARENT_PLIST" "$APP_PATH"
productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
                