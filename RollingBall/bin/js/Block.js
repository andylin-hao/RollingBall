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
var moveSPeed = 0.02;
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(long, width, height, name, moveable, extraObs, SprBoard, hBooster) {
        if (name === void 0) { name = null; }
        if (moveable === void 0) { moveable = false; }
        if (extraObs === void 0) { extraObs = false; }
        if (SprBoard === void 0) { SprBoard = false; }
        if (hBooster === void 0) { hBooster = false; }
        var _this = _super.call(this, new Laya.BoxMesh(long, width, height), name) || this;
        _this.meshRender.receiveShadow = true;
        _this.length = long;
        _this.height = height;
        _this.width = width;
        _this.moveable = moveable;
        _this.extraObs = extraObs;
        _this.SprBoard = SprBoard;
        _this.hBooster = hBooster;
        _this.boosterUsed = !_this.hBooster;
        _this.moveSpeed = moveSPeed;
        _this.moveDirec = 1;
        _this.obstacleList = new Array();
        var material = new Laya.StandardMaterial();
        if (SprBoard) {
            var board = new SpringBoard(_this.length, 2, -60);
            board.transform.translate(new Laya.Vector3(0, 0.5, -_this.width / 2), false);
            _this.addChild(board);
        }
        var url;
        if (hBooster)
            url = "res/material/BoardBst_" + _this.width / 4 + ".png";
        else
            url = "res/material/Board_" + _this.width / 4 + ".png";
        material.diffuseTexture = Laya.Texture2D.load(url);
        _this.meshRender.material = material;
        if (extraObs) {
            var num = Math.random();
            if (num < 0.5)
                num = 1;
            else if (num < 0.8)
                num = 2;
            else
                num = 3;
            var posArray = _this.randomPos(num);
            for (var i = 0; i < num; i++) {
                var obstalce = new Obstacle(0.8, 0.8, 4, true);
                obstalce.transform.translate(new Laya.Vector3((Math.random() < 0.5) ? -1 : 1, 0, posArray[i] - _this.width / 2));
                _this.obstacleList.push(obstalce);
                _this.addChild(obstalce);
            }
        }
        _this.addScript();
        return _this;
    }
    Block.prototype.addScript = function () {
        this.collider = this.addComponent(Laya.BoxCollider);
        var min = new Laya.Vector3();
        var max = new Laya.Vector3();
        Laya.Vector3.add(this.meshFilter.sharedMesh.boundingBox.min, new Laya.Vector3(0, -1, 0), min);
        Laya.Vector3.add(this.meshFilter.sharedMesh.boundingBox.max, new Laya.Vector3(0, 0.5, 0), max);
        this.collider.setFromBoundBox(new Laya.BoundBox(min, max));
        this.addComponent(BlockScript);
    };
    Block.prototype.updatePos = function () {
        if (!this.moveable)
            return;
        if (this.transform.position.x + blockWidth / 2 > rightBoundary)
            this.moveDirec = -1;
        if (this.transform.position.x - blockWidth / 2 < leftBoundary)
            this.moveDirec = 1;
        this.transform.translate(new Laya.Vector3(this.moveDirec * this.moveSpeed, 0, 0), false);
        this.obstacleList.forEach(function (element) {
            element.updateHeight();
        });
    };
    Block.prototype.randomPos = function (num) {
        var piece = (this.width - 1) / num;
        var posArray = new Array();
        for (var i = 0; i < num; i++) {
            posArray.push((i + Math.random()) * piece);
        }
        return posArray;
    };
    return Block;
}(Laya.MeshSprite3D));
//# sourceMappingURL=Block.js.map