class SpringBoard extends Laya.MeshSprite3D{
    private collider:Laya.BoxCollider;
    constructor(length:number,width:number,angle:number,name:string = null){
        super(new Laya.QuadMesh(length,width),name);
        this.transform.rotate(new Laya.Vector3(angle,0,0),false,false);
        this.collider = this.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
        this.collider.setFromBoundBox(this.meshFilter.sharedMesh.boundingBox);
        this.addComponent(SprBoardScript);
        let material = new Laya.StandardMaterial();
        material.diffuseTexture = Laya.Texture2D.load("res/SpringBoard.png");
        this.meshRender.material = material;
    }
}