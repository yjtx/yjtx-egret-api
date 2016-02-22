module yjtx {
    export class MemberA {

        /**
         * a111111
         */
        public a:number = 0;

        /**
         * a222222
         */
        public static a:number = 1;
    }

    export interface InterA {
        a:number;


    }

    export var InterA :{
        new(): InterA;
        a:number;
    }
}