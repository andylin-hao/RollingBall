class ObstacleScript extends Laya.Script{
    constructor(){
        super();
    }
    public onTriggerEnter(other:Laya.Collider):void{
        if(!this.owner.isTouched)
        {
            // console.log("here");
            this.owner.isTouched = true;
            other.owner.Speed.z = 0;
            Laya.SoundManager.playSound("res/Sounds/Collapse.mp3",1,new Laya.Handler(()=>{}));
            other.owner.isDead = true;
        }
    }
    public onTriggerStay(other: Laya.Collider): void {
        if(!this.owner.isTouched)
        {
            // console.log("here");
            this.owner.isTouched = true;
            other.owner.Speed.z = 0;
            other.owner.isDead = true;
            Laya.SoundManager.playSound("res/Sounds/Collapse.mp3",1,new Laya.Handler(()=>{}));
        }
    }
    public onTriggerExit(other: Laya.Collider): void {
        
    }
}
