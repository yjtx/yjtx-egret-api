/**
 * @language en_US
 * The following example uses the class BitmapExample to show how to create a Bitmap object
 */
/**
 * @language zh_CN
 * 以下示例使用 BitmapExample 类来说明如何创建一个位图对象
 */
class BitmapExample extends lark.Sprite {
    constructor() {
        super();
        var imageLoader = new lark.ImageLoader();
        imageLoader.load("http://img.lark.egret.com/lark.png");
        imageLoader.once(lark.Event.COMPLETE, this.showBitmap, this);
    }

    /**
     * Initializes a Bitmap object to refer to the specified BitmapData|Texture object.
     * @param value The BitmapData|Texture object being referenced.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 创建一个引用指定 BitmapData|Texture 实例的 Bitmap 对象
     * @param value 被引用的 BitmapData|Texture 实例
     */
    public showBitmap(e: lark.Event) {
        var imageLoader: lark.ImageLoader = e.target;
        var bitmap = new lark.Bitmap(imageLoader.data);
        this.addChild(bitmap);
    }
}
