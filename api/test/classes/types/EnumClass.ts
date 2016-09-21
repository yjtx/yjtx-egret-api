/**
 * Created by yjtx on 16/2/24.
 */

module yjtx {

    export const enum BitmapKeys {
        bitmapData,
        image,
        bitmapX,
        bitmapY = 10,
        bitmapWidth
    }
    
    /**
    * 摄像机类型
    * @version Egret 3.0
    * @platform Web,Native
    */
    export enum CameraType {

        /**
        * 透视投影
        * @version Egret 3.0
        * @platform Web,Native
        */
        perspective,

        /**
        * 正交投影
        * @version Egret 3.0
        * @platform Web,Native
        */
        orthogonal,

        /**
        * VR投影
        * @version Egret 3.0
        * @platform Web,Native
        */
        VR
    }

}


