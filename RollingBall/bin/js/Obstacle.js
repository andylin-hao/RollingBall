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
var changeSpeed = 0.03;
var maxHeight = 3;
var minHeight = 1;
var Obstacle = /** @class */ (function (_super) {
    __extends(Obstacle, _super);
    function Obstacle(length, width, height, isChangable, name) {
        if (name === void 0) { name = null; }
        var _this = _super.call(this, new Laya.BoxMesh(length, width, height), name) || this;
        _this.length = length;
        _this.width = width;
        _this.height = height;
        _this.isChangable = isChangable;
        _this.isTouched = false;
        _this.changeDir = 1;
        _this.collider = _this.addComponent(Laya.BoxCollider);
        _this.collider.setFromBoundBox(_this.meshFilter.sharedMesh.boundingBox);
        // let min:Laya.Vector3 = new Laya.Vector3();
        // let max:Laya.Vector3 = new Laya.Vector3();
        // Laya.Vector3.add(this.meshFilter.sharedMesh.boundingBox.min,new Laya.Vector3(0.05,0,0),min);
        // Laya.Vector3.add(this.meshFilter.sharedMesh.boundingBox.max,new Laya.Vector3(-0.05,0,0),max);
        // this.collider.setFromBoundBox(new Laya.BoundBox(min,max));
        _this.addComponent(ObstacleScript);
        return _this;
        // let material = new Laya.StandardMaterial();
        // material.diffuseTexture = Laya.Texture2D.load("res/SpringBoard.png");
        // this.meshRender.material = material;
    }
    Obstacle.prototype.updateHeight = function () {
        // console.log("update Obstacle");
        if (!this.isChangable)
            return;
        if (this.changeDir == 1 && this.transform.localPosition.y + this.length / 2 + this.changeDir * changeSpeed < maxHeight) {
            this.transform.translate(new Laya.Vector3(0, changeSpeed, 0), true);
        }
        else if (this.changeDir == -1 && this.transform.localPosition.y + this.length / 2 + this.changeDir * changeSpeed > minHeight) {
            this.transform.translate(new Laya.Vector3(0, -changeSpeed, 0), true);
        }
        else {
            this.changeDir = -this.changeDir;
            this.transform.translate(new Laya.Vector3(0, this.changeDir * changeSpeed, 0), true);
        }
    };
    return Obstacle;
}(Laya.MeshSprite3D));
//# sourceMappingURL=Obstacle.js.map