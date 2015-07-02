/**
 * Created by yjtx on 15-7-2.
 */
module yjtx {
    /**
     * sdfsdfs
     *
     * @event egret.Event.COMPLETE 加载完成时抛出
     */
    export class A implements IA {

        private _a:number;

        /**
         * @inheritDoc
         */
        public set a(value:number) {

        }

        /**
         * @inheritDoc
         * @version 1.0
         */
        public get a():number {
            return this._a;
        }

        /**
         * @inheritDoc
         */
        b:boolean;

        /**
         * @inheritDoc
         */
        f(index:number, canuse:boolean):void {

        }
    }
}