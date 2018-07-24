class PlayerBall extends Laya.MeshSprite3D{
    public Speed:Laya.Vector3;
    private Gravity:Laya.Vector3;
    private Friction:Laya.Vector3;
    private collider:Laya.SphereCollider;
    public isOnBlock:boolean;
    private havFriction:boolean;
    private radius:number;
    public isAccelerating:boolean;
    public isDead:boolean;
    public normalSpeed:number;
    constructor(radius:number,slice:number,stack:number,name:string = null){
        super(new Laya.SphereMesh(radius,slice,stack),name);
        this.meshRender.castShadow = true;
        this.normalSpeed = -0.2;
        this.radius = radius;
        this.Gravity = new Laya.Vector3(0,-0.01,0);
        // this.Gravity = new Laya.Vector3(0,0,0);
        this.collider = this.addComponent(Laya.SphereCollider) as Laya.SphereCollider;
        this.collider.center = this.meshFilter.sharedMesh.boundingSphere.center.clone();
        this.collider.radius = this.meshFilter.sharedMesh.boundingSphere.radius;
        this.addComponent(PlayerScript);
        this.addComponent(Laya.Rigidbody);
        // this.Speed = new Laya.Vector3(0,0,-0.001);
        this.Speed = new Laya.Vector3(0,0,this.normalSpeed);
        this.Friction = new Laya.Vector3(0,0,0.005)
        this.isOnBlock = false;
        this.havFriction = false;
        this.isAccelerating = false;
        this.isDead = false;
    }
    public updatePos(){
        if(this.isDead)return;
        if(!this.isOnBlock){
            Laya.Vector3.add(this.Speed,this.Gravity,this.Speed);
        }
        if(this.Speed.z+this.Friction.z<this.normalSpeed){
            Laya.Vector3.add(this.Speed,this.Friction,this.Speed);
        }
        this.transform.translate(this.Speed,false);
        // console.log("playerPos Update Over");
    }

    public Accelerate(){
        let body = this;
        for(let i = 0;i<10;i++){
            setTimeout(function() {
                if(body.isDead){
                    body.Speed.z = 0;
                    return;
                }
                body.Speed.z -=0.05;
            }, i*20);
        }
    }
}