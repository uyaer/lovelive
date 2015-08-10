var GameBackgroundLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        var bg = new cc.LayerGradient(hex2Color(0x3dadf5), hex2Color(0x3dadf5), cc.p(0, -1),
            [{p: 0, color: hex2Color(0x3dadf5)},
                {p: .5, color: hex2Color(0x0589dc)},
                {p: 1, color: hex2Color(0x3dadf5)}
            ]);

        this.addChild(bg);

        this.runAction(cc.sequence(
            cc.tintBy(3, 25, 25, 25),
            cc.tintBy(3, -25, -25, -25)
        ).repeatForever());

        //this.makeLine();
    },

    makeLine: function () {
        for (var i = 0; i < 5; i++) {
            this.createOneLine();
        }
    },

    createOneLine: function () {
        var line = new cc.Sprite(RES.getRES("line_light_png"));
        line.anchorX = range(0.25, 0.75);
        line.anchorY = range(-5, 5);
        line.scale = range(0.25, 5);
        line.rotation = randomInt(0, 180);
        line.x = randomInt(100, Const.WIN_W - 100);
        line.y = randomInt(100, Const.WIN_H - 100);
        line.opacity = randomInt(50,200);
        this.addChild(line, 1);

        var alpha = line.opacity;
        line.runAction(cc.sequence(
           cc.fadeTo(range(1,2),0),
           cc.fadeTo(range(1,2),alpha)
        ).repeatForever());

        line.runAction(cc.sequence(
            cc.rotateBy(range(3, 8), randomInt(90, 720)),
            cc.removeSelf(),
            cc.callFunc(this.createOneLine, this)
        ));
    }
});