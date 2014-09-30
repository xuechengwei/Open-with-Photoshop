#! /usr/local/bin/node
var exec = require('child_process').exec,
    fs = require('fs'),
    http = require('http'),
    stdin = process.stdin,
    url = require('url'),
    path = require('path');

stdin.setEncoding('utf8');
stdin.on('readable', function() {
    var chunk = stdin.read(),
        str = chunk.substring(4, chunk.length),
        json = JSON.parse(str),
        fileUrl = json['src'],
        DOWNLOAD_DIR = '/var/tmp/',
        urlSearch = url.parse(fileUrl).search,
        fileName = url.parse(fileUrl).pathname.split('/').pop() + (urlSearch == null ? '' : urlSearch),
        filePath = DOWNLOAD_DIR + fileName,
        file = fs.createWriteStream(filePath),
        protocol = fileUrl.substring(0,4) == 'https' ? https : http;

    protocol.get(fileUrl, function(response) {
        response.pipe(file);
        exec('file -b ' + filePath, function(error, stdout, stdin) {
            var ext = stdout.split(' ')[0].toLowerCase(),
                newPath = filePath + '.' + ext;
            fs.rename(filePath, newPath, function () {
                exec("open -b 'com.adobe.photoshop' " + newPath);
            });
        });
    });
});

