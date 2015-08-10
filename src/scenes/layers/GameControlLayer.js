/**
 * 控制器代表方向
 * @type {{NONE: number, LEFT: number, RIGHT: number, UP: number, DOWN: number, CIR: number, BOX: number, X: number}}
 */
var ControlType = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 4,
    CIR: 5,
    BOX: 6,
    X: 7
}

/**
 * 控制器vo
 * @constructor
 */
function ControlVo(pid, type, isLong, pos) {
    this.pid = pid;
    /**
     * 控制类型
     * @type {number}
     */
    this.type = type || ControlType.LEFT;
    /**
     * 是否需要长按住
     * @type {boolean}
     */
    this.isLong = isLong;
    /**
     * 控制按钮的位置 | 敌人的位置
     * @type cc.Point
     */
    this.controlPos = pos;

    /**
     * 对应消除的敌人
     * @type {number}
     */
    this.enemyId = -1;

    this.setData = function (pid, type, isLong, pos) {
        this.pid = pid;
        this.type = type || ControlType.LEFT;
        this.isLong = isLong;
        this.controlPos = pos;

        return this;
    }
}

var ControlButton = cc.Node.extend({
    /**
     * @type {*|ControlType}
     */
    type: null,
    /**
     * 长按进度条
     * @type {cc.ProgressTimer}
     */
    longTouchProgress: null,
    /**
     * @type cc.Sprite
     */
    btn: null,
    /**
     * 是否成功长按
     */
    isLongTouchOk: false,
    /**
     * 记录每次按下的id
     */
    pid: 0,
    ctor: function (type, onlyBullet) {
        this._super();

        this.type = type;
        this.pid = 0;

        var iconRes;
        var rotate = 0;
        switch (type) {
            case ControlType.LEFT:
                iconRes = "control_arrow_png";
                rotate = 0;
                break;
            case ControlType.RIGHT:
                iconRes = "control_arrow_png";
                rotate = 180;
                break;
            case ControlType.UP:
                iconRes = "control_arrow_png";
                rotate = 90;
                break;
            case ControlType.DOWN:
                iconRes = "control_arrow_png";
                rotate = 270;
                break;
            case ControlType.CIR:
                iconRes = "control_cir_png";
                break;
            case ControlType.BOX:
                iconRes = "control_box_png";
                break;
            case ControlType.X:
                iconRes = "control_x_png";
                break;
        }

        if (!onlyBullet) {
            var longSp = new cc.Sprite(RES.getRES("control_bg_png"));
            longSp.color = hex2Color(0x00ff00);
            this.longTouchProgress = new cc.ProgressTimer(longSp);
            this.longTouchProgress.setType(cc.ProgressTimer.TYPE_RADIAL);
            this.addChild(this.longTouchProgress, -1);
        }

        var btn = new cc.Sprite(RES.getRES("control_bg_png"));
        this.btn = btn;
        var icon = new cc.Sprite(RES.getRES(iconRes));
        icon.x = btn.width / 2;
        icon.y = btn.height / 2;
        icon.rotation = rotate;
        this.addChild(btn, 1);
        btn.addChild(icon);
    },
    /**
     * @type cc.Rect
     */
    _boundingBoxInScene: null,
    getBoundingBoxInScene: function () {
        if (!this._boundingBoxInScene) {
            this._boundingBoxInScene = cc.rect(this.x - this.btn.width / 2, this.y - this.btn.height / 2, this.btn.width, this.btn.height);
        }
        return this._boundingBoxInScene;
    },

    /**
     * 发射事件的数据
     * @type ControlVo
     */
    _eventData: null,

    /**
     * 开始计算长按
     */
    startLongTouch: function () {
        this.pid++;
        this.isLongTouchOk = false;
        this.btn.scale = 0.9;
        this.longTouchProgress.runAction(
            cc.sequence(
                cc.progressFromTo(Const.LONG_TOUCH_TIME, 0, 100),
                cc.callFunc(this.longTouchOk, this)
            )
        );

        this._eventData = new ControlVo(this.pid, this.type, false, this.getPosition());

        cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_START_NEW_CONTROL_BULLET_ANIM, this._eventData);
    },
    endLongTouch: function () {
        this.btn.scale = 1;
        this.longTouchProgress.stopAllActions();
        this.btn.color = cc.color.WHITE;

        if (!this.isLongTouchOk) {
            cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_END_NEW_CONTROL_BULLET_ANIM, this._eventData.setData(this.pid, this.type, false));
        }
    },

    /**
     * 长按成功
     */
    longTouchOk: function () {
        trace("long touch ok........");
        this.btn.color = cc.color.GREEN;
        this.isLongTouchOk = true;

        cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_END_NEW_CONTROL_BULLET_ANIM, this._eventData.setData(this.pid, this.type, true));
    }

});


/**
 * 游戏控制按钮
 */
var GameControlLayer = cc.Layer.extend({
    /**
     * 控制按钮
     * @type Array
     */
    controlButtons: null,
    /**
     * @type cc.LayerColor
     */
    longTouchColorTip: null,
    ctor: function () {
        this._super();

        //load cfg
        var types = [1, 2];
        //TODO 长按概率

        this.makeLongTouchTip();

        this.controlButtons = [];
        for (var i = 0; i < types.length; i++) {
            var btn = new ControlButton(types[i], false);
            this.setControlButtonPos(types.length, i, btn);
            this.controlButtons.push(btn);
            this.addChild(btn);
        }

        //bind event
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
            onTouchCanceled: this.onTouchEnded.bind(this)
        }, this);

    },
    makeLongTouchTip: function () {
        this.longTouchColorTip = new cc.LayerColor(hex2Color(0x00ff00), Const.WIN_W, 10);
        this.longTouchColorTip.anchorX = 0.5;
        this.longTouchColorTip.y = Const.WIN_H - 10;
        this.longTouchColorTip.scaleX = 0;
        this.addChild(this.longTouchColorTip);
    },
    /**
     * 开始播放长按动画提示
     */
    startLongTouchTip: function () {
        this.longTouchColorTip.scaleX = 0;
        this.longTouchColorTip.runAction(cc.scaleTo(Const.LONG_TOUCH_TIME, 1, 1));
    },
    endLongTouchTip: function () {
        this.longTouchColorTip.stopAllActions();
        this.longTouchColorTip.runAction(cc.scaleTo(0.1, 0, 1));
    },

    /**
     * 正在touch的按钮
     * @type ControlButton
     */
    touchControlBtn: null,

    onTouchBegan: function (touch, event) {
        for (var i = 0; i < this.controlButtons.length; i++) {
            var btn = this.controlButtons[i];
            var box = btn.getBoundingBoxInScene();
            if (cc.rectContainsPoint(box, touch.getLocation())) {
                this.touchControlBtn = btn;
                this.touchControlBtn.startLongTouch();
                this.startLongTouchTip();
                return true;
            }
        }
        return false;
    },
    onTouchEnded: function (touch, event) {
        this.touchControlBtn.endLongTouch();
        this.endLongTouchTip();
        this.touchControlBtn = null;
    },

    /**
     * 根据控制个数和type决定位置
     * @param len
     * @param type
     * @param btn {ControlButton}
     */
    setControlButtonPos: function (len, i, btn) {
        if (len == 2) {
            btn.x = 100 + (Const.WIN_W - 200) * i;
            btn.y = 100;
        } else if (len >= 4) {
            if (i < 4) {
                btn.x = 100 + (Const.WIN_W - 200) * int(i % 2);
                btn.y = 50 + 100 * int(i / 2);
            } else {
                btn.y = 100;
                if (len == 5) {
                    btn.x = Const.WIN_W / 2;
                } else if (len == 6) {
                    btn.x = 256 + (i - 4) * 128;
                } else if (len == 7) {
                    btn.x = 210 + (i - 4) * 110;
                }
            }
        }

        Const.CONTROL_POS_ARR[btn.type] = btn.getPosition();
    }

});


