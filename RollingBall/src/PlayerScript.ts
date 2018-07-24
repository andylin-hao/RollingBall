class PlayerScript extends Laya.Script{
    private playerBall: PlayerBall;
    constructor(){
        super();
        this.playerBall = this.owner as PlayerBall;
    }
    public onTriggerEnter(other:Laya.Collider):void{
        // this.owner.Speed.y = 0;
        // this.owner.isOnBlock = true;
    }
    public onTriggerStay(other: Laya.Collider): void {
        // this.owner.Speed.y = 0;
        // this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x,other.owner.transform.position.y+blockHeight/2+this.owner.radius,this.owner.transform.position.z)
        // this.owner.isOnBlock = true;
    }
    public onTriggerExit(other: Laya.Collider): void {
        // this.owner.isOnBlock = false;
    }

}