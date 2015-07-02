/**
 * Created by yjtx on 15-7-2.
 */
module yjtx {
    /**
     * yjtxF1
     */
    export class F1 {
        /**
         * yjtxF1f1
         * @param v1  F1v1
         * @param v2  F1v2
         * @param args  F1v3
         * @returns {string} F1v4
         * @see http://www.egret.com  yjtxF2f1
         */
        f1(v1:boolean, v2:string, ...args):string {
            return "";
        }

        /**
         * yjtxF1f2
         */
        f2():void {

        }

        /**
         * @deprecated
         */
        f3():void {

        }
    }

    export class F2 {
        /**
         * yjtxF2f1
         * @param v1  F2v1
         * @param v2  F2v2
         * @param args  F2v3
         * @returns {string} F2v4
         * @see http://www.egret.com  yjtxF2f1
         */
        f1(v1:boolean, v2:string, ...args):string {
            return "";
        }

        /**
         * @copy #f1()
         */
        f2(v1:boolean, v2:string, ...args):string {
            return "";
        }

        /**
         * @copy yjtx.F1#f1()
         */
        f3(v1:boolean, v2:string, ...args):string {
            return "";
        }

        /**
         * @copy yjtx.f3()
         */
        f4(v1:boolean, v2:string, ...args):string {
            return "";
        }


        /**
         * yjtxF2f5
         * @param v1  F2f5v1
         * @param v2  F2f5v2
         * @param args  F2f5v3
         * @returns {string} F2f5v4
         * @see http://www.egret.com  yjtxF2f5
         */
        static f5(v1:boolean, v2:string, ...args):string {
            return "";
        }
    }

    /**
     * yjtxf3
     * @param v1  yjtxf3v1
     * @param v2  yjtxf3v2
     * @param args  yjtxf3v3
     * @returns {string} yjtxf3v4
     */
    export function f3(v1:boolean, v2:string, ...args):string {
        return "";
    }
}
