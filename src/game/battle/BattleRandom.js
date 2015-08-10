var BattleRandom = BattleBase.extend({
    /**
     * 音乐数据
     */
    soundWaveData: [2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2],
    soundWaveIndex: 0,
    /**
     * 下一次出现wave的时间
     */
    nextWaveTime: 0,

    ctor: function () {
        this._super();


        this.soundWaveIndex = 0;
        this.makeNextWaveTime();
    },

    update: function (dt) {
        this._super(dt);

        if (this.useTime >= this.nextWaveTime) {
            //create enemy
            var type = this.soundWaveData[this.soundWaveIndex];
            /**@type Enemy*/
            var enemy = Enemy.create(type);
            this.enemyArr.push(enemy);
            if(!enemy.parent){
                this.addChild(enemy);
            }
            enemy.startRandomRun();

            //next
            this.soundWaveIndex++;
            this.makeNextWaveTime();
        }
    },

    makeNextWaveTime: function () {
        this.nextWaveTime = 0 + this.soundWaveIndex * 0.5;
    },

    /**
     * @override
     * 获得用户发射的控制按键
     * @param e {cc.EventCustom}
     */
    onControlEnd: function (e) {
        /**@type ControlVo*/
        var vo = e.getUserData();
        for (var i = 0; i < this.enemyArr.length; i++) {
            /**@type Enemy*/
            var enemy = this.enemyArr[i];
            if (enemy.type == vo.type && !enemy.isLock) {
                enemy.setLock();
                vo.enemyId = enemy.createId;
                return;
            }
        }
    }
});