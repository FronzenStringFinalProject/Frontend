import client from "../../baseRequest.ts";

export interface ChildLevelInfo {
    /**
     * 当前等级
     */
    level: number;
    /**
     * 当前等级分数
     */
    level_score: number;
    /**
     * 总积分
     */
    total: number;
}

export async function getChildLevelInfo(auth:string,cid:number){
    const resp = await client.get<ChildLevelInfo>
    ("/api/v0/parent/children/score",{
        headers:{
            Authorization:auth,
        },
        params:{
            cid
        }
    },)
    return resp.data
}
