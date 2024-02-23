import client, {ServiceResponse} from "../../baseRequest.ts";
import authorize from "../../../utils/authorize.ts";

export interface ChildStatical {
    /**
     * 孩子姓名
     */
    name: string;
    /**
     * 统计信息
     */
    statical: Statical[];
}

export interface Statical {
    /**
     * 正确题目数量
     */
    correct: number;
    /**
     * 正确率
     */
    correct_rate: number;
    /**
     * 累计做题数量
     */
    total: number;
    /**
     * 题目类型
     */
    ty: string;
    /**
     * 题目ID
     */
    ty_id: number;
    /**
     * 错误题目数量
     */
    wrong: number;
    [property: string]: any;
}

export default async function getChildStataical(auth:string,cid:number):Promise<ServiceResponse<ChildStatical>>{
    const resp = await client.get<ServiceResponse<ChildStatical>>("/api/v0/parent/children/statical",{
        params:{cid},
        headers:{
            "Authorization":auth
        }
    })
    return resp.data
}