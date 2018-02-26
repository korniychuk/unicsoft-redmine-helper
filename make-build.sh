#!/usr/bin/env bash
chromium-browser --pack-extension=`pwd`/src
mv src.crx ./dist/unicsoft-redmine-helper.crx
rm src.pem

echo Done!
