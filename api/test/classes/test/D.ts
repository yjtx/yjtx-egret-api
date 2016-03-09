/**
 * Created by yjtx on 15-7-2.
 */
module yjtx {
    export interface D1 {
        /**
         * yjtxDd1
         */
        d1:number;

        /**
         * yjtxDf1
         * @param v1 yjtxDf1v1
         */
        f1(v1:number):void;
    }

    /**
     * yjtxD.interface
     */
    export interface D2 extends D1 {
        /**
         * yjtxDd2
         */
        d2:number;

        /**
         * yjtxDf2
         * @param v1 yjtxDf2v1
         */
        f2(v1:number):void;
    }


    /**
     * yjtxD.var
     */
    export var D2:{
        new():D2;
        GM1:number;

        GF1():void;
    };
}