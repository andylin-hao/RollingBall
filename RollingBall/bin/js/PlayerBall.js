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
var PlayerBall = /** @class */ (function (_super) {
    __extends(PlayerBall, _super);
    function PlayerBall(radius, slice, stack, name) {
        if (name === void 0) { name = null; }
        var _this = _super.call(this, new Laya.SphereMesh(radius, slice, stack), name) || this;
        _this.meshRender.castShadow = true;
        _this.normalSpeed = -0.2;
        _this.radius = radius;
        _this.Gravity = new Laya.Vector3(0, -0.01, 0);
        // this.Gravity = new Laya.Vector3(0,0,0);
        _this.collider = _this.addComponent(Laya.SphereCollider);
        _this.collider.center = _this.meshFilter.sharedMesh.boundingSphere.center.clone();
        _this.collider.radius = _this.meshFilter.sharedMesh.boundingSphere.radius;
        _this.addComponent(PlayerScript);
        _this.addComponent(Laya.Rigidbody);
        // this.Speed = new Laya.Vector3(0,0,-0.001);
        _this.Speed = new Laya.Vector3(0, 0, _this.normalSpeed);
        _this.Friction = new Laya.Vector3(0, 0, 0.005);
        _this.isOnBlock = false;
        _this.havFriction = false;
        _this.isAccelerating = false;
        _this.isDead = false;
        return _this;
    }
    PlayerBall.prototype.updatePos = function () {
        if (this.isDead)
            return;
        if (!this.isOnBlock) {
            Laya.Vector3.add(this.Speed, this.Gravity, this.Speed);
        }
        if (this.Speed.z + this.Friction.z < this.normalSpeed) {
            Laya.Vector3.add(this.Speed, this.Friction, this.Speed);
        }
        this.transform.translate(this.Speed, false);
        // console.log("playerPos Update Over");
    };
    PlayerBall.prototype.Accelerate = function () {
        var body = this;
        for (var i = 0; i < 10; i++) {
            setTimeout(function () {
                if (body.isDead) {
                    body.Speed.z = 0;
                    return;
                }
                body.Speed.z -= 0.05;
            }, i * 20);
        }
    };
    return PlayerBall;
}(Laya.MeshSprite3D));
//# sourceMappingURL=PlayerBall.js.map