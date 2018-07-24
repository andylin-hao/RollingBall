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
var RankList = /** @class */ (function (_super) {
    __extends(RankList, _super);
    function RankList(myPa, score, id) {
        var _this = _super.call(this) || this;
        _this.pa = myPa;
        _this.curPage = 1;
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.height = 412 / sharedCanvas.width * sharedCanvas.height;
        sharedCanvas.width = 412;
        _this.rankTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
        _this.rankTexture.bitmap.alwaysChange = true;
        var textureWidth = _this.rankTexture.width * 2;
        var textureHeight = _this.rankTexture.height * 2;
        _this.restartButton = new Laya.Button("Ui/restartBtn.png", '');
        _this.restartButton.stateNum = 1;
        _this.restartButton.pos(750, 1060);
        _this.restartButton.scale(1.5, 1.5);
        _this.restartButton.on(Laya.Event.MOUSE_UP, _this, _this.restart);
        _this.prevButton = new Laya.Button("Ui/btn_Prev.png", '');
        _this.prevButton.stateNum = 1;
        _this.prevButton.pos(460, 1700);
        _this.prevButton.size(50, 50);
        _this.prevButton.on(Laya.Event.MOUSE_UP, _this, _this.prevPage);
        _this.nextButton = new Laya.Button("Ui/btn_Next.png", '');
        _this.nextButton.stateNum = 1;
        _this.nextButton.pos(570, 1700);
        _this.nextButton.size(50, 50);
        _this.nextButton.on(Laya.Event.MOUSE_UP, _this, _this.nextPage);
        wx.postMessage({ score: score.toString(), id: id });
        _this.rankSprite = new Laya.Sprite();
        _this.rankSprite.size(1080, 1920);
        _this.addChild(_this.rankSprite);
        _this.addChild(_this.restartButton);
        _this.addChild(_this.prevButton);
        _this.addChild(_this.nextButton);
        var body = _this;
        Laya.timer.once(400, _this, function () {
            body.rankSprite.graphics.drawTexture(body.rankTexture, 140, 300, textureWidth, textureHeight);
        });
        return _this;
    }
    RankList.prototype.restart = function () {
        this.pa.restart();
    };
    RankList.prototype.prevPage = function () {
        wx.postMessage({ page: '-1' });
    };
    RankList.prototype.nextPage = function () {
        wx.postMessage({ page: '1' });
    };
    return RankList;
}(Laya.Sprite));
//# sourceMappingURL=RankList.js.map