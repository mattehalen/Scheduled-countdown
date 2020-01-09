#!/bin/sh
#open /node-v12.14.0.pkg

FILE=//usr/local/bin/node
if [ -f "$FILE" ]; then
    echo "$FILE exist"
else
    echo "$FILE does not exist"
    open /node-v12.14.0.pkg
fi
