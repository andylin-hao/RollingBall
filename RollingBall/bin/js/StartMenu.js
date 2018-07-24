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
var StartMenu = /** @class */ (function (_super) {
    __extends(StartMenu, _super);
    function StartMenu(pa) {
        var _this = _super.call(this) || this;
        _this.pa = pa;
        _this.ani1.play();
        _this.startBtn.on(Laya.Event.MOUSE_UP, _this, _this.start);
        if (Laya.Browser.height / Laya.Browser.width * 9 > 17) {
            _this.height = Laya.Browser.height / Laya.Browser.width * 1080;
            _this.background.height = _this.height;
        }
        return _this;
    }
    StartMenu.prototype.start = function () {
        this.pa.startAGame();
    };
    return StartMenu;
}(ui.StartUI));
//# sourceMappingURL=StartMenu.js.map