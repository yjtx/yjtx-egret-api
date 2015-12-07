var http = require('http');
var path = require('path');
var fs = require('fs');

function postFile(urlKey, urlValue, params, req) {
    var boundaryKey = Math.random().toString(16);
    var enddata = '\r\n----' + boundaryKey + '--';

    var content = "";
    if (params) {
        for (var key in params) {
            content = content
                + "\r\n----" + boundaryKey + "\r\n"
                + "Content-Disposition: form-data; name=\"" + key + "\"\r\n\r\n"
                + "" + params[key] + "";
        }
    }

    content = content
        + "\r\n----" + boundaryKey + "\r\n"
        + "Content-Type: application/octet-stream\r\n"
            + "Content-Disposition: form-data; name=\"" + urlKey + "\"; filename=\"" + path.basename(urlValue) + "\"\r\n"
            + "Content-Transfer-Encoding: binary\r\n\r\n";

    console.log(content);
    var contentBinary = new Buffer(content, 'utf-8');//当编码为ascii时，中文会乱码。

    var contentLength = 0;

    var stat = fs.statSync(urlValue);
    contentLength += contentBinary.length;
    contentLength += stat.size;

    req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
    req.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));

    var querystring = require('querystring');

    req.write(contentBinary);

    console.log("filePath:" + urlValue);
    var fileStream = fs.createReadStream(urlValue, {bufferSize : 4 * 1024});
    fileStream.pipe(req, {end: false});
    fileStream.on('end', function() {
        req.end(enddata);
    });
}

var req;
exports.init = function (options, callback) {
    req = http.request(options, function(res){
        console.log("RES:" + res);
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.on("data", function(chunk){
            console.log("BODY:" + chunk);

            callback(chunk);
        })
    });

    req.on('error', function(e){
        console.log('problem with request:' + e.message);
        console.log(e);
    });
};

exports.upload = function (fileKey, fileValue, params) {
    postFile(fileKey, fileValue, params, req);
};