cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));
    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(false);
    //初始化引
    if (!cc.sys.isMobile) {
        flax.init(cc.ResolutionPolicy.SHOW_ALL);
    } else {
        flax.init(cc.ResolutionPolicy.FIXED_HEIGHT);
    }
    Const.WIN_W = cc.winSize.width;
    Const.WIN_H = cc.winSize.height;
    Const.DESIGN_W = flax.designedStageSize.width;
    Const.DESIGN_H = flax.designedStageSize.height;

    //注册场景（参数：场景名字，场景，素材）
    flax.registerScene("gameScene", GameScene, res_game_scene);
    //flax.registerScene("gameScene", HelloWorldScene, res_game_scene);
    //根据场景名字切换场景
    flax.replaceScene("gameScene");
};
cc.game.run();