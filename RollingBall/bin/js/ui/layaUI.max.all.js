var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var EndPageUI = /** @class */ (function (_super) {
        __extends(EndPageUI, _super);
        function EndPageUI() {
            return _super.call(this) || this;
        }
        EndPageUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.EndPageUI.uiView);
        };
        EndPageUI.uiView = { "type": "View", "props": { "width": 1080, "height": 1920 } };
        return EndPageUI;
    }(View));
    ui.EndPageUI = EndPageUI;
})(ui || (ui = {}));
(function (ui) {
    var PauseUI = /** @class */ (function (_super) {
        __extends(PauseUI, _super);
        function PauseUI() {
            return _super.call(this) || this;
        }
        PauseUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.PauseUI.uiView);
        };
        PauseUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 100, "height": 100 }, "child": [{ "type": "Button", "props": { "y": 0, "x": 0, "width": 100, "var": "btn", "stateNum": 1, "skin": "Ui/btn_Pause.png", "height": 100 } }] };
        return PauseUI;
    }(View));
    ui.PauseUI = PauseUI;
})(ui || (ui = {}));
(function (ui) {
    var PausePageUI = /** @class */ (function (_super) {
        __extends(PausePageUI, _super);
        function PausePageUI() {
            return _super.call(this) || this;
        }
        PausePageUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.PausePageUI.uiView);
        };
        PausePageUI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 1080, "height": 1920 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "background", "skin": "Ui/pausebg.png", "alpha": 0.5 } }, { "type": "Button", "props": { "y": 255, "x": 390, "width": 300, "var": "resumeButton", "stateNum": 1, "skin": "Ui/btn_Resume.png", "labelSize": 160, "labelFont": "Arial", "labelColors": "#FFFFFF", "height": 300, "alpha": 0 }, "compId": 3 }, { "type": "Button", "props": { "y": 810, "x": 390, "width": 300, "var": "restartButton", "stateNum": 1, "skin": "Ui/btn_Restart.png", "labelSize": 160, "labelColors": "#FFFFFF", "height": 300, "alpha": 0 }, "compId": 5 }, { "type": "Button", "props": { "y": 1365, "x": 390, "width": 300, "var": "quitButton", "stateNum": 1, "skin": "Ui/btn_Quit.png", "labelSize": 160, "labelColors": "#FFFFFF", "height": 300, "alpha": 0 }, "compId": 6 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": "1", "key": "alpha", "index": 0 }, { "value": 0.5, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 5 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 15 }] } }, { "target": 5, "keyframes": { "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": false, "target": 5, "key": "alpha", "index": 0 }, { "value": 0.5, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 7 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 20 }] } }, { "target": 6, "keyframes": { "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": false, "target": 6, "key": "alpha", "index": 0 }, { "value": 0.5, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "alpha", "index": 9 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "alpha", "index": 23 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }] };
        return PausePageUI;
    }(View));
    ui.PausePageUI = PausePageUI;
})(ui || (ui = {}));
(function (ui) {
    var StartUI = /** @class */ (function (_super) {
        __extends(StartUI, _super);
        function StartUI() {
            return _super.call(this) || this;
        }
        StartUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.StartUI.uiView);
        };
        StartUI.uiView = { "type": "View", "props": { "width": 1080, "height": 1920 }, "child": [{ "type": "Image", "props": { "width": 1080, "var": "background", "skin": "Ui/background.png", "height": 1920 } }, { "type": "Animation", "props": { "y": 700, "x": 400, "source": "Ui/title.png", "scaleY": 1.5, "scaleX": 1.5 }, "compId": 12 }, { "type": "Button", "props": { "y": 1300, "x": 440, "width": 200, "var": "startBtn", "stateNum": 1, "skin": "Ui/btn_Resume.png", "height": 200 } }], "animations": [{ "nodes": [{ "target": 12, "keyframes": { "y": [{ "value": 700, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "y", "index": 0 }], "x": [{ "value": 300, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "x", "index": 0 }, { "value": 600, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "x", "index": 30 }, { "value": 300, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "x", "index": 60 }], "autoPlay": [{ "value": true, "tweenMethod": "linearNone", "tween": false, "target": 12, "key": "autoPlay", "index": 60 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }] };
        return StartUI;
    }(View));
    ui.StartUI = StartUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map