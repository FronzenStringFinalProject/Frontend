import client, {ResponseResult} from "../../baseRequest.ts";


export interface QuizGroupStaticalItem {
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
    quiz_ty: string;
    /**
     * 题目ID
     */
    quiz_ty_id: number;
    /**
     * 错误题目数量
     */
    wrong: number;
}

export async function getChildQuizGroupStatical(auth:string,cid:number):Promise<ResponseResult<QuizGroupStaticalItem[]>>{
    const resp = await client.get<QuizGroupStaticalItem[]>("/api/v0/parent/children/statical/quiz_group",{
        params:{cid},
        headers:{
            "Authorization":auth
        }
    })
    return resp.data
}

export interface ResentCorrectStaticalItem {
    correct: number;
    correct_rate: number;
    date: string;
    total: number;
    wrong: number;
}

export async function getChildCorrectTrendStatical(auth:string,cid:number):Promise<ResponseResult<ResentCorrectStaticalItem[]>>{
    const resp = await client.get<ResentCorrectStaticalItem[]>(
        "/api/v0/parent/children/statical/correct_trend",
        {
            params:{cid},
            headers:{
                "Authorization":auth,
            },
            method:"GET"

    });
    return resp.data
}