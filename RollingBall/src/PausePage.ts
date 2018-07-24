class PausePage extends ui.PausePageUI{
    private pa:LayaAir3D;
    constructor(pa:LayaAir3D){
        super();
        this.pa = pa;
        this.resumeButton.on(Laya.Event.MOUSE_UP,this,this.Resume)
        this.restartButton.on(Laya.Event.MOUSE_UP,this,this.Restart);
        this.quitButton.on(Laya.Event.MOUSE_UP,this,this.Quit);

        if (Laya.Browser.height/Laya.Browser.width*9 > 17) {
            this.height = Laya.Browser.height/Laya.Browser.width*1080;
            this.background.height = this.height;
            
            let space:number = (this.height-900)/4
            this.resumeButton.y = space;
            this.restartButton.y = space*2 + 300;
            this.quitButton.y = space*3 + 600;
        }
    }
    public Resume(){
        this.pa.pauseCancel();
    }
    public Restart(){
        // this.pa.restart();
        this.pa.restart();
    }
    public Quit(){
        this.pa.gameOver();
    }
    // public show(){
    //     let body = this;
    //     for(let i = 0;i<50;i++){
    //         setTimeout(function() {
    //             body.resumeButton.alpha += 0.02;
    //             body.restartButton.alpha += 0.02;
    //             body.quitButton.alpha += 0.02;
    //         }, i*10);
    //     }
    // }
}