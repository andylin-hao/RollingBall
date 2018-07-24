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
var ObstacleScript = /** @class */ (function (_super) {
    __extends(ObstacleScript, _super);
    function ObstacleScript() {
        return _super.call(this) || this;
    }
    ObstacleScript.prototype.onTriggerEnter = function (other) {
        if (!this.owner.isTouched) {
            // console.log("here");
            this.owner.isTouched = true;
            other.owner.Speed.z = 0;
            Laya.SoundManager.playSound("res/Sounds/Collapse.mp3", 1, new Laya.Handler(function () { }));
            other.owner.isDead = true;
        }
    };
    ObstacleScript.prototype.onTriggerStay = function (other) {
        if (!this.owner.isTouched) {
            // console.log("here");
            this.owner.isTouched = true;
            other.owner.Speed.z = 0;
            other.owner.isDead = true;
            Laya.SoundManager.playSound("res/Sounds/Collapse.mp3", 1, new Laya.Handler(function () { }));
        }
    };
    ObstacleScript.prototype.onTriggerExit = function (other) {
    };
    return ObstacleScript;
}(Laya.Script));
//# sourceMappingURL=ObstacleScript.js.map