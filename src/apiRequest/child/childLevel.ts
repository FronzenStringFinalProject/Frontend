import client, {ServiceResponse} from "../baseRequest.ts";

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

export async function getChildLevelInfo(auth:string):Promise<ServiceResponse<ChildLevelInfo>>{
    const resp = await client.get<ServiceResponse<ChildLevelInfo>>
    ("/api/v0/child/score",{
        headers:{
            Authorization:auth,
        }
    },)
    return resp.data
}
