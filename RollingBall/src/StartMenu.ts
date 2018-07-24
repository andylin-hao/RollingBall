class StartMenu extends ui.StartUI{
    private pa:Game;
    constructor(pa:Game){
        super();
        this.pa = pa;
        this.ani1.play();
        this.startBtn.on(Laya.Event.MOUSE_UP,this,this.start);

        if (Laya.Browser.height/Laya.Browser.width*9 > 17) {
            this.height = Laya.Browser.height/Laya.Browser.width*1080;
            this.background.height = this.height;
        }
    }
    public start(){
        this.pa.startAGame();
    }
}