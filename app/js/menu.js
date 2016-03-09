var template = [
    {
        label: '编辑',
        submenu: [
            {
                label: '隐藏',
                accelerator: 'Cmd+H',
                role: 'hide'
            },
            {
                label: '隐藏其他',
                accelerator: 'Shift+Cmd+H',
                role: 'hide'
            },
            {
                type: 'separator'
            },
            {
                label: '退出',
                click: function () {
                    app.quit();
                },
                accelerator: (function () {
                    if (process.platform == 'darwin')
                        return 'Command+Q';
                    else
                        return 'ALT+F4';
                })()
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            {
                label: '配置',
                click: showConfig,
                accelerator: (function () {
                    if (process.platform == 'darwin')
                        return 'Command+F';
                    else
                        return 'F11';
                })()
            }
        ]
    },
    {
        label: '视图',
        submenu: [
            {
                label: 'api查看',
                click: showApi,
                accelerator: (function () {
                    if (process.platform == 'darwin')
                        return 'Command+R';
                    else
                        return 'F12';
                })()
            }
        ]
    },
    {
        label: '窗口',
        role: 'window',
        submenu: [
            {
                label: '最小化',
                accelerator: 'Cmd+M',
                role: 'minimize'
            },
            {
                label: '关闭',
                accelerator: 'Cmd+W',
                role: 'close'
            },
            {
                type: 'separator'
            },
            {
                label: 'Bring All to Front',
                role: 'front'
            }
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: 'source',
                click: function () {
                    shell.openExternal('https://github.com/yjtx/yjtx-egret-api')
                }
            },
            {
                label: '关于',
                click: function () {
                    shell.openExternal('http://electron.atom.io')
                }
            },
            {
                label: '注释说明',
                click: showDescription
            },
            {
                label: '格式说明',
                click: showDescription
            },
            {
                label: 'About ',
                role: 'about'
            }
        ]
    }
];

const electron = require('electron');
const shell = electron.shell;

const remote = electron.remote;
var Menu = remote.require('menu');
var app = remote.require('app');


var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);