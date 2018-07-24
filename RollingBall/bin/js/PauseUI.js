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
var Pause = /** @class */ (function (_super) {
    __extends(Pause, _super);
    function Pause(pa) {
        var _this = _super.call(this) || this;
        _this.pos(900, 200);
        _this.pa = pa;
        _this.isPaused = false;
        _this.on(Laya.Event.MOUSE_UP, _this, _this.mouseUP);
        return _this;
        // this.on(Laya.Event.MOUSE_DOWN,this,this.mouseUP);
    }
    Pause.prototype.mouseUP = function () {
        console.log("pause");
        if (!this.isPaused) {
            this.isPaused = true;
            this.pa.gamePause();
        }
        // else{
        //     this.isPaused = false;
        //     this.pa.pauseCancel();
        // }
    };
    return Pause;
}(ui.PauseUI));
//# sourceMappingURL=PauseUI.js.map