/**
 * Created by yjtx on 15-6-4.
 */

var id3 = {
    //"Variable":1,
    "FunctionScopedVariable":1,
    "BlockScopedVariable":1,
    "Property":2,
    "Function":8,
    "Class":16,
    "Interface":32,
    "ValueModule":128,
    "NamespaceModule":256,
    "Method":2048,
    "Constructor":4096,
    "GetAccessor":8192,
    "SetAccessor":16384,

    "Accessor":24576,
    "Module":384,


    "EnumMember":4,
    "Enum":64,
    "TypeLiteral":512,
    "ObjectLiteral":1024
};

var id4 = {
    "FunctionScopedVariable":1,
    "BlockScopedVariable":2,
    "Property":4,
    "Function":16,
    "Class":32,
    "Interface":64,
    "ValueModule":512,
    "NamespaceModule":1024,
    "Method":8192,
    "Constructor":16384,
    "GetAccessor":32768,
    "SetAccessor":65536,

    "Accessor":98304,
    "Module":1536,


    "EnumMember":8,
    "ConstEnum":128,
    "RegularEnum":256,
    "TypeLiteral":2048,
    "ObjectLiteral":4096
};

exports.getEnumFlag = function () {
    return id3;
};

exports.getTscApi = function () {
    return require('../core/typescript/tsc_api_1.3.js');
};