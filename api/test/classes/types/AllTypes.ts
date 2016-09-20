/**
 * Created by yjtx on 16/2/24.
 */

module yjtx {
    export class CA {
        static eventPool:CA[];

        a1:Array<CA>;

        a2:Array<A | number>;

        b: CA | number | string;
        c1:(p1:number, p2:string)=>number;

        c2:(p1:number, p2:string)=>A|boolean;

        c3:(p1:number, p2:string)=>{a:(p1:number, p2:string)=>number|A};

        c3:(p1:(p1:number|A, p2:string)=>number|A, p2:string)=>A|boolean;


        skins1: { [component: string]: string };
        skins2: { component: string };

        //EventClass<T>:{new (type:string | A, bubbles?:boolean|string, cancelable?:boolean): T};



        constructor(type:string | A, bubbles?:boolean|string, cancelable?:boolean) {

        }

        public static createT<T>(EventClass:{new (type:string | A, bubbles?:boolean|string, cancelable?:boolean): T}){

        }

        public static create<T>(EventClass:{new (type:string | A, bubbles?:boolean|string, cancelable?:boolean): T; eventPool?:A[]},
                                              type:string, bubbles?:boolean, cancelable?:boolean):T {

            return new EventClass(type, bubbles, cancelable);
        }
    }


    export interface B {
        name:string;
        isFile:boolean;


        new (a:number, b:number);

        (source: string, subString: string): boolean;

    }

    export class B1 implements B {

        constructor(a:number, b:number) {

        }

        name:string;
        isFile:boolean;
    }

    export interface BB extends B {

        b1:boolean;

        fb:(b:B) => B;
    }

    export interface A {
        [key:string]:B;

        d:{[key:string]:A};

        a:boolean;
    }

    export interface CCC extends A, BB {
        c:string;
    }

    export const enum BitmapKeys {
        bitmapData,
        image,
        bitmapX,
        bitmapY,
        bitmapWidth
    }
    
    /**
    * 摄像机类型
    * @version Egret 3.0
    * @platform Web,Native
    */
    export enum CameraType {

        /**
        * 透视投影
        * @version Egret 3.0
        * @platform Web,Native
        */
        perspective,

        /**
        * 正交投影
        * @version Egret 3.0
        * @platform Web,Native
        */
        orthogonal,

        /**
        * VR投影
        * @version Egret 3.0
        * @platform Web,Native
        */
        VR
    }

    /**
     * CapsStyle 类是可指定在绘制线条中使用的端点样式的常量值枚举。常量可用作 egret.Graphics.lineStyle() 方法的 caps 参数中的值。
     * @version Egret 2.5
     * @platform Web,Native
     */
    export const CapsStyle = {
        /**
         * @language en_US
         * Used to specify no caps in the caps parameter of the egret.Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于在 egret.Graphics.lineStyle() 方法的 caps 参数中指定没有端点。
         * @version Egret 2.5
         * @platform Web,Native
         */
        NONE: "none",
        /**
         * @language en_US
         * Used to specify round caps in the caps parameter of the egret.Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web,Native
         */
        ROUND: "round",
        /**
         * @language zh_CN
         * 用于在 egret.Graphics.lineStyle() 方法的 caps 参数中指定方头端点。
         * @version Egret 2.5
         * @platform Web,Native
         */
        SQUARE: "square"
    }
}


