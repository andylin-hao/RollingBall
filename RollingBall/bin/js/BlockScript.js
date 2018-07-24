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
var BlockScript = /** @class */ (function (_super) {
    __extends(BlockScript, _super);
    // private block: Laya.MeshSprite3D;
    function BlockScript() {
        return _super.call(this) || this;
    }
    BlockScript.prototype.onTriggerEnter = function (other) {
        // console.log("Bshit");
        if (!other.owner.isOnBlock)
            Laya.SoundManager.playSound("res/Sounds/drop.mp3", 1, new Laya.Handler(function () { }));
        other.owner.Speed.y = 0;
        other.owner.isOnBlock = true;
        if (!this.owner.hBooster)
            return;
        if (other.owner.transform.position.z < this.owner.transform.position.z + 2 && other.owner.transform.position.z > this.owner.transform.position.z - 2 && !this.owner.boosterUesd) {
            other.owner.Accelerate();
            Laya.SoundManager.playSound("res/Sounds/Boost.mp3", 1, new Laya.Handler(function () { }));
            this.owner.boosterUesd = true;
        }
    };
    BlockScript.prototype.onTriggerStay = function (other) {
        // console.log("Bin");
        if (!other.owner.isOnBlock)
            Laya.SoundManager.playSound("res/Sounds/drop.mp3", 1, new Laya.Handler(function () { }));
        other.owner.Speed.y = 0;
        other.owner.transform.position = new Laya.Vector3(other.owner.transform.position.x, this.owner.transform.position.y + blockHeight / 2 + other.owner.radius, other.owner.transform.position.z);
        other.owner.isOnBlock = true;
        if (!this.owner.hBooster)
            return;
        if (other.owner.transform.position.z < this.owner.transform.position.z + 2 && other.owner.transform.position.z > this.owner.transform.position.z - 2 && !this.owner.boosterUesd) {
            other.owner.Accelerate();
            Laya.SoundManager.playSound("res/Sounds/Boost.mp3", 1, new Laya.Handler(function () { }));
            this.owner.boosterUesd = true;
        }
    };
    BlockScript.prototype.onTriggerExit = function (other) {
        other.owner.isOnBlock = false;
        // console.log("Bout");
    };
    return BlockScript;
}(Laya.Script));
//# sourceMappingURL=BlockScript.js.map