class EndPage extends ui.EndPageUI{
    private score:number;
    private rankList:RankList;

    constructor(pa:Game,score:number,id:string){
        super();
        this.rankList = new RankList(pa, score, id);
        this.rankList.size(1080, 1920);
        this.addChild(this.rankList);
        this.score = score;
        
        // to do show the score
        console.log(`score : ${this.score}`);
    }
}