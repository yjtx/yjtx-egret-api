// 这是一个简单的Node HTTP服务器,能处理当前目录的文件
// 并能实现两种特殊的URL用于测试
// 用HTTP://localhost:8000或http://127.0.0.1:8000连接这个服务器

// 首先加载所有需要用到的模块
var http = require('http');        // Http服务器API
var fs = require('fs');            // 用于处理本地文件
var server = new http.Server();    // 创建新的HTTP服务器
server.listen(8908);            // 监听端口 8908

// 使用on方法注册时间处理
server.on('request', function(request, response) { // 当有request请求的时候触发处理函数
    console.log('request');
    console.log(request);
    // 解析请求的URL
    var url = require('url').parse(request.url);
    console.log(url);
    // 特殊URL会让服务器在发送响应前先等待
    switch(url.pathname) {
        case ''||'/' : // 模拟欢迎页,nodejs是高效流处理的方案,也可以通过配置文件来配置
            fs.readFile('./index.html', function(err, content){
                if(err) {
                    response.writeHead(404, { 'Content-Type':'text/plain; charset="UTF-8"' });
                    response.write(err.message);
                    response.end();
                } else {
                    response.writeHead(200, { 'Content-Type' : 'text/html; charset=UTF-8' });
                    response.write(content);
                    response.end();
                }
            });
            break;
        case '/test/delay':// 此处用于模拟缓慢的网络连接
            // 使用查询字符串来获取延迟时长,或者2000毫秒
            var delay = parseInt(url.query) || 2000;
            // 设置响应状态和头
            response.writeHead(200, {'Content-type':'text/plain; charset=UTF-8'});
            // 立即开始编写响应主体
            response.write('Sleeping for' + delay + ' milliseconds...');
            // 在之后调用的另一个函数中完成响应
            setTimeout(function(){
                response.write('done.');
                response.end();
            }, delay);
            break;
        case '/test/mirror':// 如果请求是test/mirror,则原文返回它
            //request.readAsArrayBuffer();

            //return;
            // 响应状态和头
            response.writeHead(200, {'Content-type':'text/plain; charset=UTF-8'});
            // 用请求的内容开始编写响应主体
            response.write(request.mothod + ' ' + request.url + ' HTTP/' + request.httpVersion + '\r\n');
            // 所有的请求头
            for (var h in request.headers) {
                response.write(h + ':' + request.headers[h] + '\r\n');
            }
            response.write('\r\n');// 使用额外的空白行来结束头
            // 在这些事件处理程序函数中完成响应
            // 当请求主体的数据块完成时,把其写入响应中
            request.on('data', function(chunk) { response.write(chunk); });
            // 当请求结束时,响应也完成
            request.on('end', function(chunk){ response.end(); });
            break;
        case '/json' : // 模拟JSON数据返回
            // 响应状态和头
            response.writeHead(200, {'Content-type':'application/json; charset=UTF-8'});
            response.write(JSON.stringify({test:'success'}));
            response.end();
            break;
        default:// 处理来自本地目录的文件
            var filename = url.pathname.substring(1);    // 去掉前导'/'
            var type = getType(filename.substring(filename.lastIndexOf('.')+1));
            // 异步读取文件,并将内容作为单独的数据模块传给回调函数
            // 对于确实很大的文件,使用流API fs.createReadStream()更好
            fs.readFile(filename, function(err, content){
                if(err) {
                    response.writeHead(404, { 'Content-Type':'text/plain; charset="UTF-8"' });
                    response.write(err.message);
                    response.end();
                } else {
                    response.writeHead(200, { 'Content-Type' : type });
                    response.write(content);
                    response.end();
                }
            });
            break;
    }

});
function getType(endTag){
    var type=null;
    switch(endTag){
        case 'html' :
        case 'htm' :
            type = 'text/html; charset=UTF-8';
            break;
        case 'js' :
            type = 'application/javascript; charset="UTF-8"';
            break;
        case 'css' :
            type = 'text/css; charset="UTF-8"';
            break;
        case 'txt' :
            type = 'text/plain; charset="UTF-8"';
            break;
        case 'manifest' :
            type = 'text/cache-manifest; charset="UTF-8"';
            break;
        default :
            type = 'application/octet-stream';
            break;
    }
    return type;
}