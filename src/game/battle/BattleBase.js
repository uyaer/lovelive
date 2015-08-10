/**
 * 游戏性类型
 * @type {{ORDER_ONE: number, LINE: number, RANDOM: number}}
 */
var BattleType = {
    ORDER_ONE: 1, //有序一个的下落
    LINE: 2, //一行一行的出现
    RANDOM: 3 //随机出现,1维数组数据，2维数组展现，相当于打地鼠
}

/**
 * 所有关卡的类型
 */
var BattleBase = cc.Layer.extend({
    /**
     * music total time (s)
     */
    totalTime: 150,
    /**
     * play time (s)
     */
    useTime: 0,
    /**
     * 所有的敌人
     * @type Array [Enemy]
     */
    enemyArr: null,
    ctor: function () {

        this._super();

        this.enemyArr = [];

    },

    onEnter: function () {
        this._super();


        this.useTime = 0;
        Bullet.pool.init();

        this.playLevelMusic();

        cc.eventManager.addCustomListener(GameEvent.EVENT_END_NEW_CONTROL_BULLET_ANIM, this.onControlEnd.bind(this));
        cc.eventManager.addCustomListener(GameEvent.EVENT_POP_FROM_PERSON, this.onPopFromPerson.bind(this));
        cc.eventManager.addCustomListener(GameEvent.EVENT_MOVE_2_ENEMY_END, this.onMove2EnemyEnd.bind(this));

        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();

        cc.eventManager.removeCustomListeners(GameEvent.EVENT_END_NEW_CONTROL_BULLET_ANIM);

        this.unscheduleUpdate();
    },

    playLevelMusic: function () {
        //TODO music total time
        this.totalTime = 150;
        //cc.audioEngine.playMusic(res.music_01, false);
    },

    /**
     * 获得控制，需要重写这个方法
     */
    onControlEnd: function () {
    },

    /**
     * 光圈从人物中射出
     */
    onPopFromPerson: function (e) {
        /**  @type ControlVo */
        var cvo = e.getUserData();
        for (var i = 0; i < this.enemyArr.length; i++) {
            /** @type Enemy */
            var enemy = this.enemyArr[i];
            if (enemy.createId == cvo.enemyId) {
                cvo.controlPos = enemy.getPosition();
                cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_SHOOT_CONTROL_2_ENEMY, cvo);
                return;
            }
        }
    },

    onMove2EnemyEnd: function (e) {
        /**  @type ControlVo */
        var cvo = e.getUserData();
        for (var i = 0; i < this.enemyArr.length; i++) {
            /** @type Enemy */
            var enemy = this.enemyArr[i];
            if (enemy.createId == cvo.enemyId) {
               enemy.setDead();
                return;
            }
        }
    },

    update: function (dt) {
        this.useTime += dt;
    }
});