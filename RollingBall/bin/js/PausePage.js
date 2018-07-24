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
var PausePage = /** @class */ (function (_super) {
    __extends(PausePage, _super);
    function PausePage(pa) {
        var _this = _super.call(this) || this;
        _this.pa = pa;
        _this.resumeButton.on(Laya.Event.MOUSE_UP, _this, _this.Resume);
        _this.restartButton.on(Laya.Event.MOUSE_UP, _this, _this.Restart);
        _this.quitButton.on(Laya.Event.MOUSE_UP, _this, _this.Quit);
        if (Laya.Browser.height / Laya.Browser.width * 9 > 17) {
            _this.height = Laya.Browser.height / Laya.Browser.width * 1080;
            _this.background.height = _this.height;
            var space = (_this.height - 900) / 4;
            _this.resumeButton.y = space;
            _this.restartButton.y = space * 2 + 300;
            _this.quitButton.y = space * 3 + 600;
        }
        return _this;
    }
    PausePage.prototype.Resume = function () {
        this.pa.pauseCancel();
    };
    PausePage.prototype.Restart = function () {
        // this.pa.restart();
        this.pa.restart();
    };
    PausePage.prototype.Quit = function () {
        this.pa.gameOver();
    };
    return PausePage;
}(ui.PausePageUI));
//# sourceMappingURL=PausePage.js.map