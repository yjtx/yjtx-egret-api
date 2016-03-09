/**
 * Created by yjtx on 15-7-2.
 */
module yjtx {
    /**
     * sdfsdfs
     * 示例：
     * <code>
     *   <root value="abc">
     *          <item value="item0"/>
     *          <item value="item1"/>
     *   </root>
     * </code>
     * 将解析为:
     * <code>
     *     {
     *          "name": "root",
     *          "$value": "abc",
     *          "children": [
     *              {"name": "item", "$value": "item0"},
     *              {"name": "item", "$value": "item1"}
     *          ]
     *      }
     * </code>
     *
     * <code>
     *      <?xml version="1.0" encoding="utf-8"?>
     *      <s:Skin xmlns:s="http://ns.egret.com/swan" xmlns:w="http://ns.egret.com/wing">
     *          <states>
     *              <!-- Specify the states controlled by this skin. -->
     *          </states>
     *          <!-- Define skin. -->
     *      </s:Skin>
     * </code>
     *
     * @example fffffff
     * <code>
     *  A.fl(sdff);
     *  b.fl(dfs);
     * </code>
     * sdffdsf
     *
     * <code>
     *  A.fl(sdff);
     *  b.fl(dfs);
     * </code>
     * sdffdsf
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