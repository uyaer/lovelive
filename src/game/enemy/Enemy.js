/**
 * 敌人对象，需要消灭的东西
 */
var Enemy = cc.Sprite.extend({
    /**
     * 唯一标识符
     */
    createId: 0,
    /**
     * 类型
     */
    type: ControlType.NONE,
    /**
     * 是否已经消除
     */
    isDead: false,
    /**
     * 是否已经被锁定
     */
    isLock: false,

    /**
     * 根据类型生成对象 TODO 对象池吧
     * @param type
     */
    ctor: function (type) {
        this._super();

        this.initEnemy(type);
    },

    initEnemy: function (type) {

        this.isDead = false;
        this.isLock = false;

        if (type != this.type) {

            var url = "";
            switch (type) {
                case ControlType.LEFT:
                    url = "enemy_left_png";
                    break;
                case ControlType.RIGHT:
                    url = "enemy_right_png";
                    break;
                case ControlType.UP:
                    url = "enemy_up_png";
                    break;
                case ControlType.DOWN:
                    url = "enemy_down_png";
                    break;
                case ControlType.CIR:
                    url = "enemy_cir_png";
                    break;
                case ControlType.BOX:
                    url = "enemy_box_png";
                    break;
                case ControlType.X:
                    url = "enemy_x_png";
                    break;
            }

            this.setTexture(RES.getRES(url));
            //TODO plist
            //this.setSpriteFrame(RES.getRES(url));

            this.type = type;
        }

        this.color = cc.color.WHITE;

    },

    reuse: function (type) {

        this.visible = true;
        this.alpha = 255;
        this.initEnemy(type);
    },

    recycle: function () {
        this.visible = false;
        cc.pool.putInPool(this);
    },

    /**
     * 开始从起点运行 (随机模式下)
     */
    startRandomRun: function () {
        this.scale = 0.01;
        this.x = Const.WIN_W * Const.ENEMY_INIT_X_PERCENT;
        this.y = Const.WIN_H * Const.ENEMY_INIT_Y_PERCENT;

        var time = range(1, 2);
        var pos = Const.CONTROL_POS_ARR[this.type];
        this.runAction(cc.spawn(
            cc.sequence(
                cc.scaleTo(time * 0.33, 1, 1).easing(cc.easeSineIn()),
                cc.scaleTo(time * 0.67, 2, 2)
            ),
            cc.moveTo(time, pos).easing(cc.easeSineIn())
        ));
    },

    /**
     * 开始从起点运行 (line模式下)
     * @param offset {number}和纵轴线的tile距离
     */
    startLineRun: function (offset) {
        this.scale = 0.01;
        this.x = Const.WIN_W * Const.ENEMY_INIT_X_PERCENT;
        this.y = Const.WIN_H * Const.ENEMY_INIT_Y_PERCENT;

        var time = 0.5;
        var PADDING = 65;
        var pos = cc.p(this.x + offset * PADDING, this.y - 120);
        this.runAction(cc.spawn(
            //cc.sequence(
            //    cc.scaleTo(time * 0.33, 1, 1).easing(cc.easeSineIn()),
            //    cc.scaleTo(time * 0.67, 2, 2)
            //),
            cc.scaleTo(time, 1, 1),
            cc.moveTo(time, pos).easing(cc.easeSineIn())
        ));
    },

    /**
     * 锁定敌人
     */
    setLock: function () {
        this.stopAllActions();
        this.isLock = true;
        this.alpha = 128;
        this.color = cc.color(10, 200, 0);
    },
    /**
     * 输入错误，进行红色处理
     */
    setError: function () {
        this.color = cc.color(255, 10, 0);
    },

    /**
     * 播放死亡动画
     */
    setDead: function () {
        this.isDead = true;
        this.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(0.5, 2).easing(cc.easeBackIn()),
                cc.fadeOut(0.5)
            ),
            cc.callFunc(this.recycle, this)
        ));
    }


});

Enemy.__create_id__ = 0;
/**
 *
 * @param type
 * @returns {Enemy}
 */
Enemy.create = function (type) {
    /**@type Enemy */
    var e = null;
    if (cc.pool.hasObject(Enemy)) {
        e = cc.pool.getFromPool(Enemy, type);
    } else {
        e = new Enemy(type);
    }
    e.createId = ++Enemy.__create_id__;
    return e;
}