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
var SprBoardScript = /** @class */ (function (_super) {
    __extends(SprBoardScript, _super);
    function SprBoardScript() {
        var _this = _super.call(this) || this;
        _this.isUsed = false;
        return _this;
    }
    SprBoardScript.prototype.onTriggerEnter = function (other) {
        // console.log("I'm hitted");
        if (!this.isUsed) {
            other.owner.Speed.z -= 0.2;
            Laya.SoundManager.playSound("res/Sounds/SprBoard.mp3", 1, new Laya.Handler(function () { }));
            this.isUsed = true;
        }
    };
    SprBoardScript.prototype.onTriggerStay = function (other) {
        other.owner.Speed.y = 0.3;
        if (!this.isUsed) {
            other.owner.Speed.z -= 0.2;
            Laya.SoundManager.playSound("res/Sounds/SprBoard.mp3", 1, new Laya.Handler(function () { }));
            this.isUsed = true;
        }
    };
    SprBoardScript.prototype.onTriggerExit = function (other) {
    };
    return SprBoardScript;
}(Laya.Script));
//# sourceMappingURL=SprBoardScript.js.map