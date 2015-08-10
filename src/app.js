var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var bullet = new Bullet(cc.p(400, 250), 1, this);
        this.addChild(bullet);
        bullet.runAction(cc.moveTo(0.25, bullet._toPos));

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

