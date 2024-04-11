import client, {ResponseResult} from "../baseRequest.ts";

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

export async function getWrongRecord(auth: string): Promise<ResponseResult<WrongRecordItem[]>> {
    const resp = await client.get<WrongRecordItem[]>("/api/v0/child/wrong_record", {headers: {Authorization: auth}})
    return resp.data
}