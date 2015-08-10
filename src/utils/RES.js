/**
 * 获取资源模块
 * @type {{getRES: Function}}
 */
var RES = {
    /**
     * @type HashMap
     */
    _resData: null,

    init: function () {
        var data = cc.loader.getRes("res/resource.json");
        this._resData = new HashMap();
        data = data["resources"];
        data.forEach(function (el, index, arr) {
            this._resData.set(el["name"], el["url"]);
        });
    },
    /**
     * 返回真实的路径
     * @param name
     * @returns {*}
     */
    getRES: function (name) {
        return res[name];
        var url = this._resData.get(name);
        if (!url) {
            cc.error("没有name=%s的素材配置", name);
            return "";
        } else {
            if (cc.loader.getRes(url)) {
                return url;
            } else {
                return "#" + url;
            }
        }
    }
}