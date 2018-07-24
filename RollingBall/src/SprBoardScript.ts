class SprBoardScript extends Laya.Script{
    private isUsed:boolean;
    constructor(){
        super();
        this.isUsed = false;
    }
    public onTriggerEnter(other:Laya.Collider):void{
        // console.log("I'm hitted");
        
        if(!this.isUsed){
            
            other.owner.Speed.z -=0.2;
            Laya.SoundManager.playSound("res/Sounds/SprBoard.mp3",1,new Laya.Handler(()=>{}));
            this.isUsed = true;
        }
    }
    public onTriggerStay(other: Laya.Collider): void {
        other.owner.Speed.y = 0.3;
        if(!this.isUsed){
            other.owner.Speed.z -=0.2;
            Laya.SoundManager.playSound("res/Sounds/SprBoard.mp3",1,new Laya.Handler(()=>{}));
            this.isUsed = true;
        }
    }
    public onTriggerExit(other: Laya.Collider): void {
        
    }
}
