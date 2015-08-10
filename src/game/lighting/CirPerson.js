var CirPerson = cc.Node.extend({
    /**
     * 保存小圆点的数组
     * @type Array
     */
    allCirArr: null,

    /**
     * 各个圆点的控制类型
     * @type Array
     */
    cirControlArr: null,

    /**
     * 是否需要循环去改变控制，没有新的控制点输出，不去遍历，节省性能
     */
    isNeedChangeControl: false,
    ctor: function () {
        this._super();

        var mc = flax.createDisplay(res.lighting, "person", {x: Const.WIN_W / 2, y: 120});
        this.addChild(mc);
        mc.play();

        this.getCirArr(mc);
    },

    onEnter: function () {
        this._super();

        cc.eventManager.addCustomListener(GameEvent.EVENT_PUSH_CONTROL_2_PERSON, this.pushControl.bind(this));

        this.schedule(this.changeCirControl, 0.1, cc.REPEAT_FOREVER, 0.1);

    },

    onExit: function () {
        this._super();

        cc.eventManager.removeCustomListeners(GameEvent.EVENT_PUSH_CONTROL_2_PERSON);

        this.unschedule(this.changeCirControl);
    },

    changeCirControl: function () {
        if (!this.isNeedChangeControl)return;

        var len = this.cirControlArr.length;
        var cvo = this.cirControlArr[len - 1];
        for (var i = len - 2; i >= 0; i--) {
            this.cirControlArr[i + 1] = this.cirControlArr[i];
        }
        this.cirControlArr[0] = null;
        if (cvo) {
            this.shootControl(cvo);
        }

        this.updateCirColor();
    },

    updateCirColor: function () {
        this.isNeedChangeControl = false;
        //chang color
        var len = this.cirControlArr.length;
        for (var i = 0; i < len; i++) {
            var cir = this.allCirArr[i];
            /**@type ControlVo*/
            var cvo = this.cirControlArr[i];
            if (!cvo) {
                cir.color = hex2Color(0xffffff);
            } else {
                cir.color = hex2Color(0x00ff00);
                this.isNeedChangeControl = true;
            }
        }
    },

    /**
     * 过滤获得cirArray
     * @param mc {flax._movieClip}
     */
    getCirArr: function (mc) {
        this.allCirArr = [];
        for (var i = 0; i <= 7; i++) {
            this.allCirArr.push(mc.getChild("p" + i));
        }

        this.cirControlArr = [];
        for (var i = 0; i < this.allCirArr.length; i++) {
            this.cirControlArr.push(null);
        }
    },
    /**
     * 颜色入堆栈
     * @param e {cc.EventCustom}
     */
    pushControl: function (e) {
        if (this.cirControlArr[0] != null) {
            this.changeCirControl();
        }
        this.cirControlArr[0] = e.getUserData();
        this.updateCirColor();
    },
    /**
     * 发射颜色
     * @param cvo {ControlVo}
     */
    shootControl: function (cvo) {
        //TODO 移动消灭对应的敌人，可能需要某种id来进行关联
        cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_POP_FROM_PERSON, cvo);
    }
});