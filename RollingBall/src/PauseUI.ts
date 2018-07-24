class Pause extends ui.PauseUI{
    private pa:LayaAir3D;
    public isPaused:boolean;
    constructor(pa:LayaAir3D){
        super();
        this.pos(900, 200);
        this.pa = pa;
        this.isPaused = false;
        this.on(Laya.Event.MOUSE_UP,this,this.mouseUP);
        // this.on(Laya.Event.MOUSE_DOWN,this,this.mouseUP);
    }
    public mouseUP(){
        console.log("pause");
        if(!this.isPaused){
            this.isPaused = true;
            this.pa.gamePause();
        }
        // else{
        //     this.isPaused = false;
        //     this.pa.pauseCancel();
        // }
    }
}