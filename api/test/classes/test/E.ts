/**
 * Created by yjtx on 15-7-2.
 */
module yjtx {
    /**
     * E1
     * @event Event.ADD add
     */
    export interface E1 {
    }

    /**
     * E2
     * @event Event.REMOVE remove
     */
    export interface E2 extends E1 {
    }


    /**
     * yjtxD.var
     * @event Event.REMOVE_FROM_STAGE remove
     */
    export class E3 implements E1 {

    }
    /**
     * yjtxD.var
     * @event Event.ADD_TO_STAGE add
     */
    export class E4 extends E3 {

    }
}