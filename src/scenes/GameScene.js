var GameScene = cc.Scene.extend({
    /**
     * @type GameControlLayer
     */
    controlLayer: null,
    ctor: function () {
        this._super();


        var bg = new GameBackgroundLayer();
        //this.addChild(bg, 0);

        this.controlLayer = new GameControlLayer();
        this.addChild(this.controlLayer, 10);

        var p = new Lighting();
        this.addChild(p, 1);

        //var battle = new BattleRandom();
        var battle = new BattleLine();
        this.addChild(battle, 2);
    }

});