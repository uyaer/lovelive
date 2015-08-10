var GameManager = {};

GameManager.instance = {
    /**
     * 经历的天数
     */
    day: 1,

    setDay: function (val) {
        this.day = val;
        this.saveData();
        cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_DAY_CHANGE);
    },
    /***
     * tower 剩余hp
     */
    towerHp: 100,
    setTowerHp: function (val) {
        this.towerHp = val;
        this.saveData();
    },

    /**
     * 游戏开始调用
     */
    init: function () {
        this.loadData();
    },


    loadData: function () {
        var str = cc.sys.localStorage.getItem("hello-princess-game-data");
        if (str) {
            var json = JSON.parse(str);
            var vertify1 = json["vertify"];
            var data = json["data"];
            str = JSON.stringify(data);
            var vertify2 = md5(str, Const.VERTIFY_KEY);
            if (vertify1 == vertify2) {
                //TODO  load data
                this.day = data["day"] || 1;
                this.towerHp = data["towerHp"] || Const.TOWER_INIT_HP;

            } else {
                this.useInitFullData();
            }
        } else {
            this.useInitFullData();
        }
    },

    /**
     * 延迟
     */
    _saveCfgDelayId: 0,
    /**
     * 重复多少次后一定保存
     */
    _saveCfgDelayCount: 0,

    saveData: function () {
        this._saveCfgDelayCount++;
        clearTimeout(this._saveCfgDelayId);
        this._saveCfgDelayId = setTimeout(this._saveDataDelay.bind(this), 1000);
        //进行超时同步，如果count>10,就进行立即同步一次
        if (this._saveCfgDelayCount > 10) {
            this._saveDataDelay();
        }
    },

    _saveDataDelay: function () {
        this._saveCfgDelayCount = 0;
        var data = {
            //TODO save data
            "day": this.day,
            "towerHp": this.towerHp

        };
        var dataStr = JSON.stringify(data);
        var vertify = md5(dataStr, Const.VERTIFY_KEY);
        var game_data = {
            "vertify": vertify,
            "data": data
        }
        cc.sys.localStorage.setItem("hello-princess-game-data", JSON.stringify(game_data));
    },

    /**
     * 初始化数据
     */
    useInitFullData: function () {
        this.day = 1;
        this.towerHp = Const.TOWER_INIT_HP;
    },

    /**
     * 移动速度
     */
    moveSpeed: 100
}

this["GameManager"] = GameManager;