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
var SpringBoard = /** @class */ (function (_super) {
    __extends(SpringBoard, _super);
    function SpringBoard(length, width, angle, name) {
        if (name === void 0) { name = null; }
        var _this = _super.call(this, new Laya.QuadMesh(length, width), name) || this;
        _this.transform.rotate(new Laya.Vector3(angle, 0, 0), false, false);
        _this.collider = _this.addComponent(Laya.BoxCollider);
        _this.collider.setFromBoundBox(_this.meshFilter.sharedMesh.boundingBox);
        _this.addComponent(SprBoardScript);
        var material = new Laya.StandardMaterial();
        material.diffuseTexture = Laya.Texture2D.load("res/SpringBoard.png");
        _this.meshRender.material = material;
        return _this;
    }
    return SpringBoard;
}(Laya.MeshSprite3D));
//# sourceMappingURL=SpringBoard.js.map