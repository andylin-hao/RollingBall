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
var EndPage = /** @class */ (function (_super) {
    __extends(EndPage, _super);
    function EndPage(pa, score, id) {
        var _this = _super.call(this) || this;
        _this.rankList = new RankList(pa, score, id);
        _this.rankList.size(1080, 1920);
        _this.addChild(_this.rankList);
        _this.score = score;
        // to do show the score
        console.log("score : " + _this.score);
        return _this;
    }
    return EndPage;
}(ui.EndPageUI));
//# sourceMappingURL=EndPage.js.map