import client, {ResponseResult} from "../baseRequest.ts";


/**
 * 排行元素
 */
export interface ChildRank {
    cid: number;
    name: string;
    rank: number;
    rank_range: number;
    value: number;
    is_child:boolean;
}

export async function getChildScoreRank(auth: string): Promise<ResponseResult<ChildRank[]>> {
    const resp = await client.get<ChildRank[]>("/api/v0/child/rank/total-score",
        {
            headers: {
                Authorization: auth,
            }
        })

    return resp.data
}

export async function getChildCheckInRank(auth: string): Promise<ResponseResult<ChildRank[]>> {
    const resp = await client.get<ChildRank[]>("/api/v0/child/rank/check-days",
        {
            headers: {
                Authorization: auth,
            }
        })

    return resp.data
}