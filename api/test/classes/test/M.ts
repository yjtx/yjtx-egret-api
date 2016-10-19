/**
 * Created by yjtx on 15-7-2.
 */
module yjtx {
    /**
     * yjtxB1
     * @event egret.Event.CHANGE 有变化时抛出
     */
    export class M1 {
        /**
         * yjtxM1m1
         * @default yjtxM1m1
         * @see http://www.egret.com  yjtxM1m1
         */
        public get m1():string {
            return "";
        }

        /**
         * @copy #m1
         * @version 1.0
         */
        public set m2(value:string) {

        }

        /**
         * yjtxM1m3
         * @deprecated
         */
        m3:string = "yjtxM1m3";

        /**
         * @deprecated asdfasdf
         */
        m4:string;

        /**
         * yjtxM153
         */
        static m5:string = "";

        /**
         * yjtxM1m6
         * @default yjtxM1m6
         * @see http://www.egret.com  yjtxM1m6
         */
        public get m6():string {
            return "";
        }

        public set m6(value:string) {
        }

    }

    /**
     * yjtxM2
     */
    export class M2 {

        /**
         * yjtxM2m1
         * @default yjtxM2m1
         * @see http://www.egret.com  yjtxM2m1
         */
        m1:string;

        /**
         * @copy #m1
         * @default yjtxM2m2
         */
        m2:string;

        /**
         * @copy yjtx.m3
         */
        m3:string;

        /**
         * @copy yjtx.M1#m1
         */
        m4:string;
    }

    /**
     * yjtxm3
     */
    export var m3:string;
}