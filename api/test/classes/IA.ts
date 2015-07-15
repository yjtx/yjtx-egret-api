/**
 * Created by yjtx on 15-7-2.
 */
module yjtx {
    export interface IA extends IB {
        /**
         * @platform Web
         * aaaaa
         */
        a:number;

        /**
         * fffffff
         * @param index f11111
         * @param canuse f22222
         */
        f(index:number, canuse:boolean):void;
    }

    /**
     * dsflafjlsf
     */
    export interface IB {
        /**
         * bbbbbbb
         */
        b:boolean;
    }


    /**
     * ic
     */
    export interface IC {
        /**
         * cccc1
         */
        c1:boolean;
        /**
         * @readOnly
         * cccc2
         */
        c2:boolean;
        /**
         * @writeOnly
         * cccc3
         */
        c3:boolean;
    }


}