#! /bin/bash

pkill node
node ./myapp/bin/www  > stdout.txt 2> stderr.txt < /dev/null &
disown
echo 'restart success'
