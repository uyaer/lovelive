/**
 * 移动过程
 * @type {{move2Cir: number, moveInPerson: number, move2Enemy: number}}
 */
var BulletMoveType = {
    move2Cir: 1,
    moveInPerson: 2,
    move2Enemy: 3
}

/**
 * 控制器子弹
 * @param pid
 * @param pos
 * @param type
 */
var Bullet = cc.Node.extend({
    /**
     * @type ControlButton
     */
    _cir: null,
    /**
     * 初始位置
     * @type cc.Point
     */
    _fromPos: null,
    /**
     * 目标位置
     * @type cc.Point
     */
    _toPos: cc.p(),
    /**
     * 移动总长度
     */
    _maxPosLen: 0,
    /**
     * 光纤长度
     */
    _blurLen: 0,
    /**
     * 是否结束生成光纤
     */
    isCreateLongEnd: false,
    /**
     * 是否到达了光圈
     */
    _isToCir: false,
    /**
     * 控制的类型
     */
    type: null,
    /**
     * 移动方向cc.Point
     */
    _moveV: null,
    /**
     * 移动过程
     */
    moveType: null,
    /**
     * 拖尾控制点
     */
    blurVects: null,
    /**
     * 记录id
     */
    pid: 0,
    /**
     * 是否是长touch
     */
    isLong: false,
    /**
     * 光影移动到cir的时间
     */
    _blur2CirEndTime: 0,
    /**
     * 控制器vo对象
     */
    cvo: null,
    /**
     *
     * @param pid
     * @param pos
     * @param type
     * @param cvo {ControlVo}
     */
    ctor: function (pid, pos, type, cvo) {
        this._super();

        this.pid = pid;
        this.cvo = cvo;
        this.moveType = BulletMoveType.move2Cir;

        this.isCreateLongEnd = false;
        this._isToCir = false;
        this._blur2CirEndTime = 0.25;
        this._fromPos = pos;
        this._toPos = cc.p(Const.LIGHTING_CIR_X_PERCENT * Const.WIN_W, Const.LIGHTING_CIR_Y_PERCENT * Const.WIN_H);
        this.type = type;
        this.setPosition(pos);
        this._maxPosLen = cc.pDistance(pos, this._toPos);

        this._moveV = cc.pNormalize(cc.pSub(this._toPos, this._fromPos));

        this._cir = new ControlButton(type, true);
        this.addChild(this._cir);
        this.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(Const.LONG_TOUCH_TIME, this._toPos),
                cc.scaleTo(Const.LONG_TOUCH_TIME, 0.3)
            ),
            cc.callFunc(function () {
                this._isToCir = true;
            }, this),
            cc.scaleBy(this._blur2CirEndTime, 1, 0.6),
            cc.callFunc(this.putInPool, this),
            cc.callFunc(function () {
                cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_PUSH_CONTROL_2_PERSON, cvo);
            }, this)
        ));

        this.scheduleUpdate();

    },

    putInPool: function () {
        Bullet.pool.putInPool(this);
    },

    update: function (dt) {

        var topScale = this.scaleY;
        var bottomScale = 1;

        var startPos = this.getPosition();
        var v = this._moveV;

        if (!this.isCreateLongEnd) {
            var len = cc.pDistance(this.getPosition(), this._fromPos);
            if (len < 1)return;
            this._blurLen = len;

        } else {
            if (this._isToCir) { //长度开始减小
                this._blurLen -= dt * this._maxPosLen / this._blur2CirEndTime;
            } else { //保持恒定速度
                if (!this.isLong) { //根据是否是长按修正光影的长度
                    this._blurLen = limit(this._blurLen, 10, 35);
                }
            }
            var percent = limit(this._blurLen / this._maxPosLen, 0, 1);
            bottomScale = percent * (1 - this.scaleX) + this.scaleX;
            this._fromPos = cc.pAdd(startPos, cc.pMult(v, -this._blurLen));
        }

        if (this._blurLen <= 1 && this.isCreateLongEnd) {
            this._blurLen = 1;
            this.moveType = BulletMoveType.moveInPerson;
            this.unscheduleUpdate();
        }

        var p1 = cc.pAdd(startPos, cc.pMult(cc.pPerp(v), topScale * 50));
        var p2 = cc.pAdd(this._fromPos, cc.pMult(cc.pPerp(v), bottomScale * 50));
        var p3 = cc.pAdd(this._fromPos, cc.pMult(cc.pRPerp(v), bottomScale * 50));
        var p4 = cc.pAdd(startPos, cc.pMult(cc.pRPerp(v), topScale * 50));

        this.blurVects = [p1, p2, p3, p4];

    },

    runToEnemy: function (endPos) {
        this.moveType = BulletMoveType.move2Enemy;

        this.runAction(cc.sequence(
            cc.moveTo(0.5, endPos),
            cc.removeSelf(), //TODO 缓存池
            cc.callFunc(this.moveToEnemyEnd, this)
        ));
    },

    moveToEnemyEnd: function () {
        cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_MOVE_2_ENEMY_END, this.cvo);
    }

});

/**
 * 光纤子弹池
 * @type {{_arr: null, init: Function, putInPool: Function, getByPid: Function}}
 */
Bullet.pool = {
    /**
     * @type Array [Bullet]
     */
    _arr: null,
    /**
     *每次新开战场，需要调用初始化
     */
    init: function () {
        this._arr = [];
    },
    /**
     * 子弹到达光圈，需要暂时缓存起来
     * @param b
     */
    putInPool: function (b) {
        b.visible = false;
        this._arr.push(b);
    },
    /**
     * 从人物身上冒出来
     * @param pid
     * @returns {*}
     */
    getByPid: function (pid) {
        for (var i = 0; i < this._arr.length; i++) {
            /**@type Bullet*/
            var b = this._arr[i];
            if (b.pid == pid) {
                b.visible = true;
                b.scaleY = b.scaleX;
                b.x = Const.LIGHTING_CIR_X_PERCENT * Const.WIN_W;
                b.y = Const.LIGHTING_CIR_Y_PERCENT * Const.WIN_H + 300;
                return b;
            }
        }
        return null;
    }
}