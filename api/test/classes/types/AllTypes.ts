/**
 * Created by yjtx on 16/2/24.
 */

module yjtx {
    export class A {
        static eventPool:A[];

        a1:Array<A>;

        a2:Array<A | number>;

        b: A | number | string;
        c1:(p1:number, p2:string)=>number;

        c2:(p1:number, p2:string)=>A|boolean;

        c3:(p1:(p1:number|A, p2:string)=>number|A, p2:string)=>A|boolean;


        skins1: { [component: string]: string };
        skins2: { component: string };

        constructor(type:string | A, bubbles?:boolean|string, cancelable?:boolean) {

        }

        public static create<T>(EventClass:{new (type:string | A, bubbles?:boolean|string, cancelable?:boolean): T; eventPool?:A[]},
                                              type:string, bubbles?:boolean, cancelable?:boolean):T {

            return new EventClass(type, bubbles, cancelable);
        }
    }


    export interface BBB {
        name:string;
        isFile:boolean;

        (source: string, subString: string): boolean;
    }

    export interface AAA {
        [key:string]:BBB;

        d:{[key:string]:AAA};

        a:boolean;
    }



    //var a:AAA;
    //var b = a["test"].isFile;
}


