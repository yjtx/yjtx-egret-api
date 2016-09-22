module egret.sys {

    var usingChannel:Array<SoundChannel> = [];

    /**
     * @private
     * @param channel
     */
    export function $pushSoundChannel(channel:SoundChannel):void {
        if (usingChannel.indexOf(channel) < 0) {
            usingChannel.push(channel);
        }
    }

    /**
     * @private
     * @param channel
     */
    export function $popSoundChannel(channel:SoundChannel):boolean {
        var index:number = usingChannel.indexOf(channel);
        if (index >= 0) {
            usingChannel.splice(index, 1);
            return true;
        }
        return false;
    }
}
