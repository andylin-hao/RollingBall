class RankList extends Laya.Sprite{

    private rankSprite:Laya.Sprite;
    private restartButton:Laya.Button;
    private prevButton:Laya.Button;
    private nextButton:Laya.Button;
    private pa:Game
    private curPage:number;
    private rankTexture:Laya.Texture;

    constructor(myPa:Game, score:number, id:string) {
        super();

        this.pa = myPa;
        this.curPage = 1;

        let openDataContext = wx.getOpenDataContext()
        let sharedCanvas = openDataContext.canvas
        sharedCanvas.height = 412/sharedCanvas.width*sharedCanvas.height;
        sharedCanvas.width = 412;

        this.rankTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
        this.rankTexture.bitmap.alwaysChange = true
        let textureWidth = this.rankTexture.width*2;
        let textureHeight = this.rankTexture.height*2;

        this.restartButton = new Laya.Button("Ui/restartBtn.png", '');
        this.restartButton.stateNum = 1;
        this.restartButton.pos(750, 1060);
        this.restartButton.scale(1.5, 1.5);
        this.restartButton.on(Laya.Event.MOUSE_UP,this,this.restart);

        this.prevButton = new Laya.Button("Ui/btn_Prev.png", '');
        this.prevButton.stateNum = 1;
        this.prevButton.pos(460, 1700);
        this.prevButton.size(50, 50);
        this.prevButton.on(Laya.Event.MOUSE_UP,this,this.prevPage);

        this.nextButton = new Laya.Button("Ui/btn_Next.png", '');
        this.nextButton.stateNum = 1;
        this.nextButton.pos(570, 1700);
        this.nextButton.size(50, 50);
        this.nextButton.on(Laya.Event.MOUSE_UP,this,this.nextPage);
        
        wx.postMessage({score: score.toString(), id: id});
        this.rankSprite = new Laya.Sprite();
        this.rankSprite.size(1080,1920);
        this.addChild(this.rankSprite);
        this.addChild(this.restartButton);
        this.addChild(this.prevButton);
        this.addChild(this.nextButton);
        let body = this;
        Laya.timer.once(400, this, () => {  
            body.rankSprite.graphics.drawTexture(body.rankTexture, 140, 300, textureWidth, textureHeight);
        });
    }

    private restart():void {
        this.pa.restart();
    }

    private prevPage():void{
        wx.postMessage({page: '-1'});
    }

    private nextPage():void {
        wx.postMessage({page: '1'});
    }
}
