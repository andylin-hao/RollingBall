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
var PlayerScript = /** @class */ (function (_super) {
    __extends(PlayerScript, _super);
    function PlayerScript() {
        var _this = _super.call(this) || this;
        _this.playerBall = _this.owner;
        return _this;
    }
    PlayerScript.prototype.onTriggerEnter = function (other) {
        // this.owner.Speed.y = 0;
        // this.owner.isOnBlock = true;
    };
    PlayerScript.prototype.onTriggerStay = function (other) {
        // this.owner.Speed.y = 0;
        // this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x,other.owner.transform.position.y+blockHeight/2+this.owner.radius,this.owner.transform.position.z)
        // this.owner.isOnBlock = true;
    };
    PlayerScript.prototype.onTriggerExit = function (other) {
        // this.owner.isOnBlock = false;
    };
    return PlayerScript;
}(Laya.Script));
//# sourceMappingURL=PlayerScript.js.map