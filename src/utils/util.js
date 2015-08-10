function trace(str) {
    var log = "";
    for (var i = 0; i < arguments.length; i++) {
        log += arguments[i] + ",";
    }
    cc.error(log);
}

function int(val) {
    return parseInt(val);
}

function ang2rad(val) {
    return Math.PI * val / 180;
}
function rad2ang(val) {
    return 180 * val / Math.PI;
}

function hex2Color(val) {
    if (val instanceof cc.Color) {
        return val;
    }
    if (cc.isNumber(val)) {
        val = val.toString(16);
    }
    return cc.hexToColor(val);
}

/**
 * 产生包含min,max的整数
 * @param min
 * @param max
 * @returns {*}
 */
function randomInt(min, max) {
    return min + Math.round(Math.random() * (max - min));
}
/**
 * 返回 min-max之间的小数
 * @param min
 * @param max
 * @returns {*}
 */
function range(min, max) {
    return min + Math.random() * (max - min);
}

/**
 * 约束val范围值
 * @param val
 * @param min
 * @param max
 * @returns {number}
 */
function limit(val, min, max) {
    return Math.min(max, Math.max(val, min));
}

/**
 * 判断元素是否在数组中
 * @param el {*}
 * @param arr {Array}
 * @returns {boolean}
 */
function isElinArray(el, arr) {
    return arr.indexOf(el) != -1;
}

/**
 * 2个数组中是否有相同元素
 * @param arr1
 * @param arr2
 * @returns {boolean}
 */
function isSameElTowArray(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        var flag = isElinArray(arr1[i], arr2);
        if (flag)return true;
    }
    return false;
}

/**
 * 显示提示信息
 * @param str
 */
function showTip(str) {
    var tf = new cc.TextFieldTTF(str, cc.size(Const.WIN_W, 50), cc.TEXT_ALIGNMENT_CENTER, "Arial", 32);
    tf.setString(str);
    tf.x = Const.WIN_W * 0.5;
    tf.y = Const.WIN_H * 0.55;
    tf.setTextColor(hex2Color(0xffff22));
    cc.director.getRunningScene().addChild(tf);
    tf.runAction(cc.sequence(
        cc.moveBy(0.15, 0, -20).easing(cc.easeSineOut()),
        cc.delayTime(0.2),
        cc.moveBy(0.35, 0, 90),
        cc.removeSelf(true)
    ));
}
/**
 * 在任意地方显示提示
 * @param str 文字
 * @param x
 * @param y
 * @param color {cc.Color | Number }0xffffff
 */
function showTipAnyWhere(str, x, y, color) {
    var tf = new cc.TextFieldTTF(str, "Arial", 32);
    tf.setString(str);
    tf.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    tf.x = x;
    tf.y = y;
    if (color instanceof cc.Color) {
        tf.setTextColor(color);
    } else if (cc.isNumber(color)) {
        tf.setTextColor(hex2Color(color));
    }
    cc.director.getRunningScene().addChild(tf);
    tf.runAction(cc.sequence(
        cc.moveBy(0.15, 0, -20).easing(cc.easeSineIn()),
        cc.delayTime(0.2),
        cc.moveBy(0.35, 0, 90),
        cc.removeSelf(true)
    ));
}

/**
 * 矩形与圆的碰撞检测
 * @param rect {cc.Rect}矩形
 * @param cx 圆心x坐标
 * @param cy 圆心y坐标
 * @param r 圆半径
 * @returns {boolean}
 */
function hitTestRectArc(rect, cx, cy, r) {
    //圆心与矩形中心的相对坐标
    var rx = cx - (rect.x + rect.width * 0.5);
    var ry = cy - (rect.y + rect.height * 0.5);

    var dx = Math.min(rx, rect.width * 0.5);
    var dx1 = Math.max(dx, -rect.width * 0.5);
    var dy = Math.min(ry, rect.height * 0.5);
    var dy1 = Math.max(dy, -rect.height * 0.5);
    return (dx1 - rx) * (dx1 - rx) + (dy1 - ry) * (dy1 - ry) <= r * r;
}

/**
 * 多边形碰撞
 * @param ax 第一个多边形的偏移x
 * @param ay 第一个多边形的偏移y
 * @param ashape {Array}第一个多边形的点数据
 * @param bx
 * @param by
 * @param bshape{Array}
 * @returns {boolean}
 */
function hitTestPolygon(ax, ay, ashape, bx, by, bshape) {
    for (var ia = 0, la = ashape.length; ia < la; ia++) {

        var ax0 = ashape[ia].x, ay0 = ashape[ia].y, ax1, ay1;
        if (ia == la - 1) {
            ax1 = ashape[0].x;
            ay1 = ashape[0].y;
        } else {
            ax1 = ashape[ia + 1].x;
            ay1 = ashape[ia + 1].y;
        }

        for (var ib = 0, lb = bshape.length; ib < lb; ib++) {
            var bx0 = bshape[ib].x, by0 = bshape[ib].y, bx1, by1;
            if (ib == lb - 1) {
                bx1 = bshape[0].x;
                by1 = bshape[0].y;
            } else {
                bx1 = bshape[ib + 1].x;
                by1 = bshape[ib + 1].y;
            }

            var hitTest = _hitTestPolygonLine(ax + ax0, ay + ay0, ax + ax1, ay + ay1, bx + bx0, by + by0, bx + bx1, by + by1);
            if (hitTest)
                return true;
        }
    }
    return false;
}
/**
 * 多边形碰撞中的一条边碰撞
 * @param ax0
 * @param ay0
 * @param ax1
 * @param ay1
 * @param bx0
 * @param by0
 * @param bx1
 * @param by1
 * @returns {boolean}
 * @private
 */
function _hitTestPolygonLine(ax0, ay0, ax1, ay1, bx0, by0, bx1, by1) {
    return cc.pCross(cc.p(ax0 - bx0, ay0 - by0), cc.p(bx1 - bx0, by1 - by0)) * cc.pCross(cc.p(ax1 - bx0, ay1 - by0), cc.p(bx1 - bx0, by1 - by0)) <= 0
        && cc.pCross(cc.p(bx0 - ax0, by0 - ay0), cc.p(ax1 - ax0, ay1 - ay0)) * cc.pCross(cc.p(bx1 - ax0, by1 - ay0), cc.p(ax1 - ax0, ay1 - ay0)) <= 0;
}

/**
 * 给按钮增加动画
 * @param btn{ccui.Button}
 */
function addButtonTouchEffect(btn) {
    btn.addTouchEventListener(function (target, type) {
        if (type == ccui.Widget.TOUCH_BEGAN) {
            target.scale = 0.9;
        } else if (type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED) {
            target.scale = 1;
        }
    }, btn);
}
/**
 * 给root中所有的button增加效果
 * @param names {Array}
 * @param root {cc.Node}
 */
function addButtonsTouchEffect(names, root) {
    for (var i = 0; i < names.length; i++) {
        var btn = ccui.helper.seekWidgetByName(root, names[i]);
        if (btn) {
            addButtonTouchEffect(btn);
        }
    }
}
/**
 * 自适应屏幕
 * @param root
 */
function doLayout(root) {
    if (!root) {
        return null;
    }
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
        var child = arrayRootChildren[i];
        var percentX = child.x / Const.DESIGN_W;
        var percentY = child.y / Const.DESIGN_H;
        child.x = percentX * cc.winSize.width;
        child.y = percentY * cc.winSize.height;
        if (child.getName() == "mask") {
            child.width = cc.winSize.width;
            child.height = cc.winSize.height;
        }
    }
}

/**
 * 查找dom结构中的元素
 * @param {*} root
 * @param {String} name
 * @returns {*}
 */
function seekChildByName(root, name) {
    if (!root)
        return null;
    if (root.getName() === name)
        return root;
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
        var child = arrayRootChildren[i];
        var res = seekChildByName(child, name);
        if (res !== null)
            return res;
    }
    return null;
}


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////     文字工具    ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

!function ($) {
    var FontUtil = FontUtil || {};

    var TAG_START = "<#";
    var TAG_END = "</>";
    var TAG_START_END = ">";

    /**
     * 为文字设置颜色，拼凑字符串时候使用
     * @param txt 文字内容
     * @param color  {cc.Color|number|string} 颜色
     */
    FontUtil.setColor = function (txt, color) {
        if (!color)return txt;
        color = hex2Color(color);
        return TAG_START + cc.colorToHex(color).replace("#", "") + TAG_START_END + txt + TAG_END;
    }

    /**
     * 为RichText设置文本,不能嵌套，只能设置颜色
     * @param tf {ccui.RichText}
     * @param str {string}
     * @param fontColor {cc.Color|number|string} 默认颜色
     * @example  var str = abc = "a<#0>bc</>ddd<#ff>ad</>";
     */
    FontUtil.setRickText = function (tf, str, fontColor, fontSize, fontName) {
        fontColor = hex2Color(fontColor) || cc.color.WHITE;
        fontSize = fontSize || 30;
        fontName = fontName || "Arial";

        var tempArr = str.split(TAG_START);
        var result = [];
        tempArr.forEach(function (el, index, arr) {
            if (el.indexOf(TAG_END) != -1) { //有颜色元素的
                var tempArr2 = el.split(TAG_END);
                tempArr2.forEach(function (el2) {
                    if (el2.indexOf(TAG_START_END) != -1) {
                        result.push(el2.split(TAG_START_END));
                    } else if (el2) { //非空才放进去
                        result.push(el2);
                    }
                });
            } else {
                result.push(el);
            }
        });

        var el;
        for (var i = 0; i < result.length; i++) {
            var txt = result[i];
            if (cc.isArray(txt)) {
                el = new ccui.RichElementText(i, hex2Color(txt[0]), 255, txt[1], fontName, fontSize);
            } else {

                el = new ccui.RichElementText(i, fontColor, 255, txt, fontName, fontSize);
            }
            tf.pushBackElement(el);
        }
    }
    this["FontUtil"] = FontUtil;
}(this);

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////     文字工具    ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////       震屏      ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
!function ($) {
    var shake = shake || {};
    var shakeScreenOffsetArr = [
        [-8, -8], [8, 8],
        [-6, -6], [6, 6],
        [-4, -4], [4, 4],
        [-2, -2], [2, 2], [0, 0]
    ];
    var shakeScreenIndex = 0;
    var shakeTarget = null;
    var isShaking = false;
    /**
     * 震动屏幕
     * @param target {cc.Node}默认为整个屏幕
     */
    shake.shake = function (target) {
        if (isShaking)return;
        isShaking = true;
        shakeTarget = target || cc.director.getRunningScene();
        shakeScreenIndex = 0;
        _shakeUpdate();
    }

    function _shakeUpdate(dt) {
        var that = shakeTarget;
        that.x = shakeScreenOffsetArr[shakeScreenIndex][0];
        that.y = shakeScreenOffsetArr[shakeScreenIndex][1];
        shakeScreenIndex++;
        if (shakeScreenIndex < shakeScreenOffsetArr.length) {
            setTimeout(_shakeUpdate, 40);
        } else {
            isShaking = false;
        }
    }

    $["shake"] = shake;
}(this);

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////       震屏      ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
