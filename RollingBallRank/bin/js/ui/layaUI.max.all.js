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
    var RankListUI = /** @class */ (function (_super) {
        __extends(RankListUI, _super);
        function RankListUI() {
            return _super.call(this) || this;
        }
        RankListUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.RankListUI.uiView);
        };
        RankListUI.uiView = { "type": "View", "props": { "width": 412, "height": 732 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "background", "skin": "Ui/rankbg.png" } }, { "type": "Label", "props": { "y": 50, "x": 46, "width": 319, "text": "本次得分", "height": 77, "fontSize": 50, "font": "Microsoft YaHei", "color": "#fa684f", "bold": true, "align": "center" } }, { "type": "Label", "props": { "y": 122, "x": 0, "width": 412, "var": "scoreLabel", "height": 125, "fontSize": 100, "font": "Microsoft YaHei", "color": "#ff5a44", "bold": true, "align": "center" } }, { "type": "Label", "props": { "y": 269, "x": 0, "width": 412, "var": "historyLabel", "text": "历史最高得分：            ", "height": 30, "fontSize": 25, "font": "Microsoft YaHei", "color": "#ff7761", "align": "center" } }] };
        return RankListUI;
    }(View));
    ui.RankListUI = RankListUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map