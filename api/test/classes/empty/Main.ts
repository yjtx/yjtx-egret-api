/**
 * Created by yjtx on 16/2/22.
 */
class Main {
    /**
     * a111111
     */
    public a:number = 0;

    /**
     * a222222
     */
    public static a:number = 1;
}

interface InterA {
    a:number;
}

var InterA:{
    new(): InterA;
    a:number;
};

var f:()=>void;
var ff:string;
/**
 * @class egret.MovieClip
 * @classdesc 影片剪辑，可以通过影片剪辑播放序列帧动画。MovieClip 类从以下类继承而来：DisplayObject 和 EventDispatcher。不同于 DisplayObject 对象，MovieClip 对象拥有一个时间轴。
 * @extends egret.DisplayObject
 * @link http://docs.egret-labs.org/post/manual/displaycon/movieclip.html  MovieClip序列帧动画
 * @includeExample F.ts
 */
class F1 {
    /**
     * @language zh_CN
     * yjtxF1f1
     * yjtxF1f1<br/>
     * yjtxF1f1
     * @param v1  F1v1
     * @param v2  F1v2
     * dddd<br/>
     eeeee
     * fffff
     * @param args  F1v3
     * @platform Web
     * @returns {string} F1v4
     * @see http://www.egret.com  yjtxF2f1
     */
    f1(v1:boolean, v2:string, ...args):string {
        return "";
    }

    /**
     * @classdesc
     * yjtxF1f2
     */
    f2(v1:boolean, v2?:string, v3:string = "a", ...args):void {

    }

    /**
     * @deprecated
     */
    f3():void {

    }
}

class F2 {
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
function f3(v1:boolean, v2:string, ...args):string {
    return "";
}