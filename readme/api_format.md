## 格式支持

#### Module

~~~
module yjtx {

}
~~~

#### Class 

~~~
class Yjtx {
	constructor();
	
	static A:number;
	
	static F():void{};
	
	f():void {};
	
	a:number;
}
~~~

等同于

~~~
interface Yjtx {
	f():void;
	
	a:number;
}

var Yjtx: {
	new():Yjtx;//构造函数声明
	
	A:number;//静态变量声明
	
	F():void;
}

~~~

#### Interface

~~~
interface IYjtx {

        getName():string;
        isFile:boolean;

        new (a:number, b:number);

        (source: string, subString: string): boolean;
}
~~~

#### Enum (会被解析成静态常量)

~~~
enum Yjtx {
	A = 0;
	B = 1;
}
~~~

#### Direction

~~~
skins1: { [component: string]: string };
~~~

#### Array

* a1:Array\<number\>;

* a1:number[];

#### Multi Types

b: boolean | number | string;

#### Funciton

* 全局函数  function f():void;

* 类方法 f():void;

* 类静态方法  static f():void;

* 构造函数  constructor(a:number, b:number);

* f:(b:number) => number;

#### Variable

* 全局变量 var a:number;

* 类属性 a:number;

* 类静态变量 static a:number;

