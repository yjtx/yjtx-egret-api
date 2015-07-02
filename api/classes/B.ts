/**
 * Created by yjtx on 15-7-2.
 */
module yjtx {
    /**
     * yjtxB1
     * @event egret.Event.CHANGE 有变化时抛出
     */
    export class B1 extends A {
        /**
         * yjtxB1b1
         */
        public get b1():boolean {
            return true;
        }

        /**
         * @copy #b1
         * @version 1.0
         */
        public set b2(value:number) {

        }

        /**
         * yjtxB1b3
         * @default bbb3
         */
        b3:string;
    }

    /**
     * yjtxB2
     */
    export class B2 {
        /**
         * @copy yjtx.B1#b1
         */
        b2:string;

        /**
         * @copy yjtx.B3
         */
        b2:string;
    }

    /**
     * yjtxB3
     */
    export var B3:string;
}