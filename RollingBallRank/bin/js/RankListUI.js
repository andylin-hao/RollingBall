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
var RankListUI = /** @class */ (function (_super) {
    __extends(RankListUI, _super);
    function RankListUI(data, score, id) {
        var _this = _super.call(this) || this;
        _this.friendData = new Array();
        _this.myData = { url: null, score: null, nickname: null, history: null, id: null };
        _this.imageList = new Array();
        _this.nameLabelList = new Array();
        _this.scoreLabelList = new Array();
        _this.isInit = false; //是否已经初始化以上数组
        Laya.stage.addChild(_this);
        _this.curPage = 1;
        _this.myScore = score;
        _this.myData.id = id;
        _this.initUserData(data, score);
        _this.background.size(Laya.stage.width, Laya.stage.height);
        return _this;
    }
    RankListUI.prototype.prevPage = function () {
        if (this.curPage > 1)
            this.curPage -= 1;
        this.drawRankList();
    };
    RankListUI.prototype.nextPage = function () {
        if (this.curPage < this.pageNum)
            this.curPage += 1;
        this.drawRankList();
    };
    //初始化用户数据
    RankListUI.prototype.initUserData = function (data, score) {
        var dataList;
        var body = this;
        wx.getUserCloudStorage({
            keyList: ["score", "history"],
            success: function (res) {
                dataList = res.KVDataList;
            },
            complete: function () {
                if (dataList.length < 2) {
                    wx.setUserCloudStorage({
                        KVDataList: [{ key: 'score', value: '0' }, { key: 'history', value: '0' }],
                        success: null,
                        fail: null,
                        complete: null
                    });
                }
                else {
                    body.parseData(data);
                }
            }
        });
    };
    //解析数据
    RankListUI.prototype.parseData = function (data) {
        var _this = this;
        var body = this;
        data.forEach(function (item, index) {
            //获取好友数据
            var personData = { url: null, score: null, nickname: null, history: null, id: null };
            personData.url = item.avatarUrl;
            personData.score = item.KVDataList[0].value;
            personData.history = item.KVDataList[1].value;
            personData.nickname = item.nickname;
            personData.id = item.openid;
            if (personData.id === body.myData.id) {
                body.myData = personData;
                body.myData.score = personData.score = _this.myScore;
                var history_1 = item.KVDataList[1].value;
                if (parseInt(body.myData.score) > parseInt(history_1)) {
                    body.myData.history = body.myData.score;
                    personData.history = body.myData.history;
                }
                else
                    body.myData.history = history_1;
                //更新用户数据
                wx.setUserCloudStorage({
                    KVDataList: [{ key: 'score', value: personData.score }, { key: 'history', value: personData.history }],
                    success: null,
                    fail: null,
                    complete: null
                });
            }
            _this.friendData.push(personData);
        });
        this.friendData.sort(function (a, b) { return parseInt(b.history) - parseInt(a.history); });
        this.pageNum = Math.ceil(this.friendData.length / 3);
        var i;
        for (i = 0; i < this.friendData.length; i++) {
            if (this.friendData[i].id === this.myData.id)
                break;
        }
        this.curPage = Math.ceil((i + 1) / 3);
        this.drawRankList();
    };
    //绘制排行榜
    RankListUI.prototype.drawRankList = function () {
        var page = this.curPage;
        this.historyLabel.text = "历史最高得分：" + this.myData.history + '分';
        this.scoreLabel.text = this.myData.score;
        if ((page - 1) * 3 + 1 > this.friendData.length)
            return;
        var start = (page - 1) * 3;
        var end = page * 3;
        if (end > this.friendData.length)
            end = this.friendData.length;
        //数组初始化
        if (!this.isInit) {
            for (var i = 0; i < 3; i++) {
                var posX = i * 120 + 26;
                this.imageList.push(new Laya.Image());
                var name_1 = new Laya.Label();
                name_1.pos(posX, 472);
                name_1.size(90, 40);
                name_1.align = 'center';
                name_1.font = 'Microsoft YaHei';
                name_1.fontSize = 20;
                name_1.bold = true;
                this.nameLabelList.push(name_1);
                var score = new Laya.Label();
                score.pos(posX, 652);
                score.size(90, 40);
                score.align = 'center';
                score.font = 'Microsoft YaHei';
                score.fontSize = 20;
                this.scoreLabelList.push(score);
                this.addChild(this.imageList[i]);
                this.addChild(this.nameLabelList[i]);
                this.addChild(this.scoreLabelList[i]);
            }
            this.isInit = true;
        }
        for (var i = start; i < start + 3; i++) {
            var posX = (i - start) * 120 + 26;
            var imagePosY = 537;
            var num = i - start; //在数组中的位置
            if (i < end) {
                this.imageList[num].loadImage(this.friendData[i].url, posX, imagePosY, 90, 90);
                this.nameLabelList[num].text = this.friendData[i].nickname;
                this.scoreLabelList[num].text = this.friendData[i].history;
            }
            else {
                this.removeChild(this.imageList[num]);
                this.imageList[num].destroy();
                this.imageList[num] = new Laya.Image();
                this.addChild(this.imageList[num]);
                this.nameLabelList[num].text = '';
                this.scoreLabelList[num].text = '';
            }
        }
    };
    return RankListUI;
}(ui.RankListUI));
//初始化微信小游戏
Laya.MiniAdpter.init(true, true);
//程序入口
Laya.init(412, 732);
var rankList;
//响应绘制请求
wx.onMessage(function (message) {
    if (message.score && message.id) {
        wx.getFriendCloudStorage({
            keyList: ["score", "history"],
            success: function (res) {
                var data = res.data;
                rankList = new RankListUI(data, message.score, message.id);
            }
        });
    }
    if (message.page && rankList) {
        if (message.page === '-1')
            rankList.prevPage();
        else
            rankList.nextPage();
    }
});
//# sourceMappingURL=RankListUI.js.map