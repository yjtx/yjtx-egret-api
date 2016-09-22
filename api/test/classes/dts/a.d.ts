declare class A {
}
interface I {
}

module a {
    export function b():void{};
}


declare function f(): void;
declare var aa: string;

declare module b {
    var b2: string;
    function b3(): void;
    class B2 {
    }
    interface I1 {
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 基础对象。
     * @version DragonBones 4.5
     */
    abstract class BaseObject {
        private static returnObject(object);
        /**
         * @language zh_CN
         * 设置每种对象池的最大缓存数量。
         * @param objectConstructor 对象类。
         * @param maxCount 最大缓存数量。 (设置为 0 则不缓存)
         * @version DragonBones 4.5
         */
        static setMaxCount(objectConstructor: typeof BaseObject, maxCount: number): void;
        /**
         * @language zh_CN
         * 对象的唯一标识。
         * @version DragonBones 4.5
         */
        hashCode: number;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected abstract onClear(): void;
        /**
         * @language zh_CN
         * 清除数据并返还对象池。
         * @version DragonBones 4.5
         */
        returnToPool(): void;
    }
}
declare module egret {
    /**
     * OrientationMode 类为舞台初始旋转模式提供值。
     */
    const AAA: {
        AUTO: string;
    };

    var bbb: {
        AUTO: string;
    };
}