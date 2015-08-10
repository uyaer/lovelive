/**
 * 子弹拖尾管理
 */
var BulletBlur = cc.Node.extend({
    /**
     * 绘制拖尾
     * @type cc.DrawNode
     */
    blur: null,
    /**
     * 控制器子弹集合
     * @type Array
     */
    bulletArr: null,

    ctor: function () {
        this._super();

        this.bulletArr = [];

        this.blur = new cc.DrawNode();
        this.addChild(this.blur);
    },

    onEnter: function () {
        this._super();

        cc.eventManager.addCustomListener(GameEvent.EVENT_START_NEW_CONTROL_BULLET_ANIM, this.addNewBullet.bind(this));
        cc.eventManager.addCustomListener(GameEvent.EVENT_END_NEW_CONTROL_BULLET_ANIM, this.onEndBulletBlurLength.bind(this));
        cc.eventManager.addCustomListener(GameEvent.EVENT_SHOOT_CONTROL_2_ENEMY, this.onLightingShoot.bind(this));

        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();

        cc.eventManager.removeCustomListeners(GameEvent.EVENT_START_NEW_CONTROL_BULLET_ANIM);
        cc.eventManager.removeCustomListeners(GameEvent.EVENT_END_NEW_CONTROL_BULLET_ANIM);
        cc.eventManager.removeCustomListeners(GameEvent.EVENT_SHOOT_CONTROL_2_ENEMY);

        this.unscheduleUpdate();
    },

    update: function () {
        this.blur.clear();
        for (var i = this.bulletArr.length - 1; i >= 0; i--) {
            /**
             * @type Bullet
             */
            var b = this.bulletArr[i];
            if (b.moveType == BulletMoveType.move2Cir) {
                if (b.blurVects) {
                    this.blur.drawPoly(b.blurVects, cc.color(200, 200, 200, 98), 0, cc.color.GRAY);
                }
            } else if (b.moveType == BulletMoveType.moveInPerson) {
                this.bulletArr.splice(i, 1);
            }
        }
    },

    /**
     * TODO  use object pool
     * @param e{cc.EventCustom}
     */
    addNewBullet: function (e) {
        /**  @type ControlVo */
        var vo = e.getUserData();
        var b = new Bullet(vo.pid, vo.controlPos, vo.type, vo);
        this.addChild(b);
        this.bulletArr.push(b);
    },
    /**
     * 子弹在飞行到人物过程中
     * @param e
     */
    onEndBulletBlurLength: function (e) {
        /**  @type ControlVo */
        var vo = e.getUserData();
        for (var i = 0; i < this.bulletArr.length; i++) {
            /**
             * @type Bullet
             */
            var b = this.bulletArr[i];
            if (b.pid == vo.pid && b.moveType == BulletMoveType.move2Cir) {
                b.isCreateLongEnd = true;
                b.isLong = vo.isLong;
            }
        }
    },

    /**
     * 光圈从人物中射出
     */
    onLightingShoot: function (e) {
        /**  @type ControlVo */
        var vo = e.getUserData();
        /**@type Bullet*/
        var b = Bullet.pool.getByPid(vo.pid);
        b.runToEnemy(vo.controlPos);
        this.bulletArr.push(b);
    }

});