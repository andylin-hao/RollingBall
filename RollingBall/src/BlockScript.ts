class BlockScript extends Laya.Script{
    // private block: Laya.MeshSprite3D;
    constructor(){
        super();
    }
    public onTriggerEnter(other:Laya.Collider):void{
        // console.log("Bshit");
        if(!other.owner.isOnBlock)Laya.SoundManager.playSound("res/Sounds/drop.mp3",1,new Laya.Handler(()=>{}));
        other.owner.Speed.y = 0;
        other.owner.isOnBlock = true;
        
        if(!this.owner.hBooster)return;
        if(other.owner.transform.position.z<this.owner.transform.position.z+2&&other.owner.transform.position.z>this.owner.transform.position.z-2&&!this.owner.boosterUesd){
            other.owner.Accelerate();
            Laya.SoundManager.playSound("res/Sounds/Boost.mp3",1,new Laya.Handler(()=>{}));
            this.owner.boosterUesd = true;
        }
        
    }
    public onTriggerStay(other: Laya.Collider): void {
        // console.log("Bin");
        if(!other.owner.isOnBlock)Laya.SoundManager.playSound("res/Sounds/drop.mp3",1,new Laya.Handler(()=>{}));
        other.owner.Speed.y = 0;
        other.owner.transform.position = new Laya.Vector3(other.owner.transform.position.x,this.owner.transform.position.y+blockHeight/2+other.owner.radius,other.owner.transform.position.z)
        other.owner.isOnBlock = true;

        if(!this.owner.hBooster)return;
        if(other.owner.transform.position.z<this.owner.transform.position.z+2&&other.owner.transform.position.z>this.owner.transform.position.z-2&&!this.owner.boosterUesd){
            other.owner.Accelerate();
            Laya.SoundManager.playSound("res/Sounds/Boost.mp3",1,new Laya.Handler(()=>{}));
            this.owner.boosterUesd = true;
        }
}
    public onTriggerExit(other: Laya.Collider): void {
        other.owner.isOnBlock = false;
        // console.log("Bout");
    }

}