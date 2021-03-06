/**
 * Created by yjtx on 15-6-4.
 */
var ts = require("typescript");

var id4 = {
    Ambient : 2,
    ModuleDeclaration: 189,
    VariableStatement:164,
    FunctionDeclaration:184,
    InterfaceDeclaration:186,
    ClassDeclaration:185,
    EnumDeclaration:188,
    ImplementsKeyword:100,
    ExtendsKeyword:77,
    EnumMember:200,
    Constructor:126,
    ConstructSignature:130,
    CallSignature:129,
    IndexSignature:131,

    Static:128,
    SetAccessor:128,
    GetAccessor:127,
    Method:125,
    Property:124,
    Public:16,
    Protected:64,
    Private:32,
    Export:1


};

var id8 = {
    Ambient : 4,
    ModuleDeclaration: 221,
    VariableStatement:196,
    FunctionDeclaration:216,
    InterfaceDeclaration:218,
    ClassDeclaration:217,
    EnumDeclaration:220,
    ImplementsKeyword:106,
    ExtendsKeyword:83,
    EnumMember:250,
    Constructor:145,
    ConstructSignature:149,
    CallSignature:148,
    IndexSignature:150,

    SetAccessor:147,
    GetAccessor:146,

    Static:64,
    Method:8192,
    Property:4,
    Public:8,
    Protected:32,
    Private:16,
    Export:2
};

var idOb = {
    // Export : ts.ModifierFlags.Export,
    Ambient : ts.ModifierFlags.Ambient,
    // Public:ts.ModifierFlags.Public,
    // Private:ts.ModifierFlags.Private,
    // Protected:ts.ModifierFlags.Protected,
    // Static:ts.ModifierFlags.Static,
    // Abstract:ts.ModifierFlags.Abstract,
    Const:ts.NodeFlags.Const,

    StringLiteral:ts.SyntaxKind.StringLiteral,
    DotDotDotToken:ts.SyntaxKind.DotDotDotToken,
    CallExpression:ts.SyntaxKind.CallExpression,
    FunctionExpression:ts.SyntaxKind.FunctionExpression,
    BinaryExpression:ts.SyntaxKind.BinaryExpression,

    VoidKeyword:ts.SyntaxKind.VoidKeyword,
    DeclareKeyword:ts.SyntaxKind.DeclareKeyword,
    ProtectedKeyword:ts.SyntaxKind.ProtectedKeyword,
    PrivateKeyword:ts.SyntaxKind.PrivateKeyword,
    PublicKeyword:ts.SyntaxKind.PublicKeyword,
    ConstKeyword:ts.SyntaxKind.ConstKeyword,
    StaticKeyword:ts.SyntaxKind.StaticKeyword,
    ExportKeyword:ts.SyntaxKind.ExportKeyword,
    ExtendsKeyword:ts.SyntaxKind.ExtendsKeyword,
    ImplementsKeyword:ts.SyntaxKind.ImplementsKeyword,
    Constructor:ts.SyntaxKind.Constructor,
    GetAccessor:ts.SyntaxKind.GetAccessor,
    SetAccessor:ts.SyntaxKind.SetAccessor,
    PropertySignature:ts.SyntaxKind.PropertySignature,
    MethodSignature:ts.SyntaxKind.MethodSignature,
    MethodDeclaration:ts.SyntaxKind.MethodDeclaration,
    PropertyDeclaration:ts.SyntaxKind.PropertyDeclaration,
    PropertyAssignment:ts.SyntaxKind.PropertyAssignment,

    CallSignature:ts.SyntaxKind.CallSignature,
    ConstructSignature:ts.SyntaxKind.ConstructSignature,
    IndexSignature:ts.SyntaxKind.IndexSignature,
    ModuleDeclaration: ts.SyntaxKind.ModuleDeclaration,
    VariableStatement:ts.SyntaxKind.VariableStatement,
    FunctionDeclaration:ts.SyntaxKind.FunctionDeclaration,
    InterfaceDeclaration:ts.SyntaxKind.InterfaceDeclaration,
    ClassDeclaration:ts.SyntaxKind.ClassDeclaration,
    EnumDeclaration:ts.SyntaxKind.EnumDeclaration,
    EnumMember:ts.SyntaxKind.EnumMember,


    
    Method:ts.SymbolFlags.Method,
    Property:ts.SymbolFlags.Property
    
    
    
}

exports.getEnumFlag = function () {
    return idOb;
};
