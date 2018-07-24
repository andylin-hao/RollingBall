var moveSPeed = 0.02;
    
class Block extends Laya.MeshSprite3D{
    private collider:Laya.BoxCollider;
    public height:number;
    public width:number;
    public length:number;
    public moveable:boolean;
    public extraObs:boolean;
    public SprBoard:boolean;
    public hBooster:boolean;
    public moveSpeed:number;
    public moveDirec:number;
    public obstacleList:Array<Obstacle>;
    public boosterUsed:boolean;
    constructor(long:number,width:number,height:number,name:string = null,moveable = false,extraObs = false,SprBoard = false,hBooster = false){
        super(new Laya.BoxMesh(long,width,height),name);
        
        this.meshRender.receiveShadow = true;
        this.length = long;
        this.height = height;
        this.width = width;
        this.moveable = moveable;
        this.extraObs = extraObs;
        this.SprBoard = SprBoard;
        this.hBooster = hBooster;
        this.boosterUsed = !this.hBooster;
        this.moveSpeed = moveSPeed;
        this.moveDirec = 1;
        this.obstacleList = new Array<Obstacle>();

        let material = new Laya.StandardMaterial();
        
        
        if(SprBoard){
            let board = new SpringBoard(this.length,2,-60);
            board.transform.translate(new Laya.Vector3(0,0.5,-this.width/2),false);
            this.addChild(board);
        }
        let url:string;
        
        if(hBooster) url = `res/material/BoardBst_${this.width/4}.png`;
        else  url = `res/material/Board_${this.width/4}.png`;
        
        material.diffuseTexture = Laya.Texture2D.load(url);
                    this.meshRender.material = material;
        if(extraObs){
            let num = Math.random();
            
            if(num<0.5) num = 1;
            else if(num<0.8) num = 2;
            else num = 3;
            let posArray=this.randomPos(num);

            for(let i = 0;i<num;i++){
                let obstalce = new Obstacle(0.8,0.8,4,true);
                obstalce.transform.translate(new Laya.Vector3((Math.random()<0.5)?-1:1,0,posArray[i]-this.width/2));
                this.obstacleList.push(obstalce);
                this.addChild(obstalce);
            }
        }


        
        this.addScript();
        
    }
    private addScript():void{
        this.collider = this.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
        let min:Laya.Vector3 = new Laya.Vector3();
        let max:Laya.Vector3 = new Laya.Vector3();
        Laya.Vector3.add(this.meshFilter.sharedMesh.boundingBox.min,new Laya.Vector3(0,-1,0),min);
        Laya.Vector3.add(this.meshFilter.sharedMesh.boundingBox.max,new Laya.Vector3(0,0.5,0),max);
        this.collider.setFromBoundBox(new Laya.BoundBox(min,max));
        this.addComponent(BlockScript);
    }
    public updatePos():void{
        if(!this.moveable)return;
        if(this.transform.position.x+blockWidth/2>rightBoundary) this.moveDirec = -1;
        if(this.transform.position.x-blockWidth/2<leftBoundary) this.moveDirec = 1;
        this.transform.translate(new Laya.Vector3(this.moveDirec*this.moveSpeed,0,0),false);
        this.obstacleList.forEach(element => {
            element.updateHeight();
        });
    }
    private randomPos(num):Array<number>{
        let piece = (this.width-1)/num;
        let posArray = new Array<number>();
        for(let i = 0;i<num;i++){
            posArray.push((i+Math.random())*piece);
        }
        return posArray;
    }
}