/**
 * Created by yjtx on 16/2/24.
 */

module yjtx {
    export class A {
        static eventPool:A[];

        a1:Array<A>;

        a2:Array<A | number>;

        b: A | number | string;
        c:(p1:number, p2:string)=>number;


        skins: { [component: string]: string };

        constructor(type:string, bubbles?:boolean, cancelable?:boolean) {

        }

        public static create<T extends A>(EventClass:{new (type:string, bubbles?:boolean, cancelable?:boolean): T; eventPool?:A[]},
                                              type:string, bubbles?:boolean, cancelable?:boolean):T {

            return new EventClass(type, bubbles, cancelable);
        }
    }

}
