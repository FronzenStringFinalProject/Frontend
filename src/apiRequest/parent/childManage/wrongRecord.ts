import client, {ResponseResult} from "../../baseRequest.ts";

export interface WrongRecordItem {
    /**
     * 答题时间
     */
    date: Date;
    /**
     * 说书题型
     */
    group: string;
    /**
     * 错题ID
     */
    qid: number;
    /**
     * 错题
     */
    quiz: string;
}

export async function getChildWrongRecord(auth: string,cid:number): Promise<ResponseResult<WrongRecordItem[]>> {
    const resp = await client.get<WrongRecordItem[]>("/api/v0/parent/children/wrongRecords",
        {
            headers: {
                Authorization: auth
            },
            params:{cid}
        }
        )
    return resp.data
}