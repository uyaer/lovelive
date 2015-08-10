/**
 * 总体的光效
 */
var Lighting = cc.Layer.extend({
    /**
     * @type CirLight
     */
    cirLight: null,
    /**
     * 跳舞的人
     * @type CirPerson
     */
    cirPerson: null,
    /**
     * 闪关灯
     * @type LineLight
     */
    lineLight: null,
    /**
     * 子弹拖尾控制
     * @type BulletBlur
     */
    blur: null,

    ctor: function () {
        this._super();

        this.cirLight = new CirLight();
        this.addChild(this.cirLight, 0);

        this.cirPerson = new CirPerson();
        this.addChild(this.cirPerson, 1);

        this.blur = new BulletBlur();
        this.addChild(this.blur);

        this.lineLight = new LineLight();
        this.addChild(this.lineLight, 10);


    }
})