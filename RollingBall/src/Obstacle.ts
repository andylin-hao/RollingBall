var changeSpeed = 0.03;
var maxHeight = 3;
var minHeight = 1;
    
class Obstacle extends Laya.MeshSprite3D{
    private collider:Laya.BoxCollider;
    private isChangable:boolean;
    private changeDir:number;
    private length:number;
    private width;number;
    private height:number;
    private isTouched:boolean;
    constructor(length:number,width:number,height:number,isChangable:boolean,name:string = null){
        super(new Laya.BoxMesh(length,width,height),name);
        
        this.length = length;
        this.width = width;
        this.height = height;
        this.isChangable = isChangable;
        this.isTouched = false;
        this.changeDir = 1;

        this.collider = this.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
        this.collider.setFromBoundBox(this.meshFilter.sharedMesh.boundingBox);
        // let min:Laya.Vector3 = new Laya.Vector3();
        // let max:Laya.Vector3 = new Laya.Vector3();
        // Laya.Vector3.add(this.meshFilter.sharedMesh.boundingBox.min,new Laya.Vector3(0.05,0,0),min);
        // Laya.Vector3.add(this.meshFilter.sharedMesh.boundingBox.max,new Laya.Vector3(-0.05,0,0),max);
        // this.collider.setFromBoundBox(new Laya.BoundBox(min,max));
        this.addComponent(ObstacleScript);
        
        // let material = new Laya.StandardMaterial();
        // material.diffuseTexture = Laya.Texture2D.load("res/SpringBoard.png");
        // this.meshRender.material = material;
    }
    public updateHeight(){
        // console.log("update Obstacle");
        if(!this.isChangable)return;
        if(this.changeDir == 1&&this.transform.localPosition.y+this.length/2+this.changeDir*changeSpeed<maxHeight){
            this.transform.translate(new Laya.Vector3(0,changeSpeed,0),true);
        }
        else if(this.changeDir == -1&&this.transform.localPosition.y+this.length/2+this.changeDir*changeSpeed>minHeight){
            this.transform.translate(new Laya.Vector3(0,-changeSpeed,0),true);
        }
        else{
            this.changeDir = -this.changeDir;
            this.transform.translate(new Laya.Vector3(0,this.changeDir*changeSpeed,0),true);
        }
    }
}