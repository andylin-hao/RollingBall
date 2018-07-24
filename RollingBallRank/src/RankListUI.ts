class RankListUI extends ui.RankListUI {
    private friendData:Array<any> = new Array();
    private myScore:string;
    private myData = {url: null, score: null, nickname: null, history: null, id: null};
    private imageList:Array<Laya.Image> = new Array()
    private nameLabelList:Array<Laya.Label> = new Array()
    private scoreLabelList:Array<Laya.Label> = new Array()
    private isInit:boolean = false; //是否已经初始化以上数组
    private pageNum:number;
    private curPage:number;

    constructor(data:any, score:string, id:string) {
        super();
        Laya.stage.addChild(this);

        this.curPage = 1;
        this.myScore = score;
        this.myData.id = id;

        this.initUserData(data, score)
        this.background.size(Laya.stage.width, Laya.stage.height);
    }

    public prevPage():void {
        if (this.curPage > 1)
            this.curPage -= 1;
        this.drawRankList();
    }

    public nextPage():void {
        if (this.curPage < this.pageNum) 
            this.curPage += 1;
        this.drawRankList();
    }

    //初始化用户数据
    private initUserData(data:any, score:string):void {
        let dataList;
        let body = this;
        wx.getUserCloudStorage({
            keyList:["score", "history"],
            success: res => {
                dataList = res.KVDataList;
            },
            complete: () => {
                if (dataList.length < 2) {
                    wx.setUserCloudStorage({
                        KVDataList: [{key: 'score', value: '0'}, {key: 'history', value: '0'}],
                        success: null,
                        fail: null,
                        complete: null
                    })
                }
                else {
                    body.parseData(data);
                }
            }
        });
    }
    
    //解析数据
    private parseData(data:any):void {
        let body = this;

        data.forEach((item, index) => {
            //获取好友数据
            let personData = {url: null, score: null, nickname: null, history: null, id: null};
            personData.url = item.avatarUrl;
            personData.score = item.KVDataList[0].value;
            personData.history = item.KVDataList[1].value;
            personData.nickname = item.nickname;
            personData.id = item.openid;

            if(personData.id === body.myData.id){
                body.myData = personData;
                body.myData.score = personData.score = this.myScore;
                let history = item.KVDataList[1].value;

                if (parseInt(body.myData.score) > parseInt(history)) {
                    body.myData.history = body.myData.score;
                    personData.history = body.myData.history;
                }
                else
                    body.myData.history = history;
                //更新用户数据
                wx.setUserCloudStorage({
                    KVDataList: [{key: 'score', value: personData.score}, {key: 'history', value: personData.history}],
                    success: null,
                    fail: null,
                    complete: null
                })
            }

            this.friendData.push(personData);
        });

        this.friendData.sort((a, b) => parseInt(b.history) - parseInt(a.history));
        this.pageNum = Math.ceil(this.friendData.length/3);

        let i:number;
        for (i = 0; i < this.friendData.length; i++) {
            if(this.friendData[i].id === this.myData.id)
                break;
        }
        this.curPage = Math.ceil((i+1)/3);

        this.drawRankList();
    }

    //绘制排行榜
    private drawRankList():void{
        let page = this.curPage;
        this.historyLabel.text = "历史最高得分：" + this.myData.history + '分';
        this.scoreLabel.text = this.myData.score;

        if ((page-1)*3 + 1 > this.friendData.length)
            return;
        
        let start:number = (page-1)*3;
        let end:number = page * 3;
        
        if (end > this.friendData.length)
            end = this.friendData.length;

        //数组初始化
        if (!this.isInit) {
            for (let i:number = 0; i < 3; i++) {
                let posX = i * 120 + 26;

                this.imageList.push(new Laya.Image());

                let name:Laya.Label = new Laya.Label();
                name.pos(posX, 472)
                name.size(90, 40);
                name.align = 'center'
                name.font = 'Microsoft YaHei';
                name.fontSize = 20;
                name.bold = true;
                this.nameLabelList.push(name);

                let score:Laya.Label = new Laya.Label();
                score.pos(posX, 652)
                score.size(90, 40);
                score.align = 'center'
                score.font = 'Microsoft YaHei';
                score.fontSize = 20;
                this.scoreLabelList.push(score);

                this.addChild(this.imageList[i]);
                this.addChild(this.nameLabelList[i]);
                this.addChild(this.scoreLabelList[i]);
            }
            this.isInit = true;
        }

        for (let i:number = start; i < start + 3; i++) {
            let posX = (i - start) * 120 + 26;
            let imagePosY = 537;
            let num = i - start; //在数组中的位置

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
        
    }
}

//初始化微信小游戏
Laya.MiniAdpter.init(true, true);
//程序入口
Laya.init(412, 732);

let rankList:RankListUI;

//响应绘制请求
wx.onMessage(function(message){
    if(message.score && message.id){
        wx.getFriendCloudStorage({
            keyList: ["score", "history"],
            success: res => {
                let data = res.data;
                rankList =  new RankListUI(data, message.score, message.id);
            }
        })
    }
    if(message.page && rankList){
        if(message.page === '-1')
            rankList.prevPage();
        else
            rankList.nextPage();
    }
});