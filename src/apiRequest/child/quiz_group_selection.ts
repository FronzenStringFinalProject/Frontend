import client, {ServiceResponse} from "../baseRequest.ts";

export interface QuizGroupItem {
    gid: number;
    name: string;
    select: boolean;
}


export async function getAllQuizGroup(auth: string): Promise<ServiceResponse<QuizGroupItem[]>> {
    const resp = await client.get<ServiceResponse<QuizGroupItem[]>>("/api/v0/child/quiz_group", {
        headers: {
            Authorization: auth
        }
    })

    return resp.data
}

export async function addQuizGroup(auth: string, gid: number): Promise<void> {
    await client.post("/api/v0/child/quiz_group", {gid}, {headers: {Authorization: auth}});
}

export async function removeQuizGroup(auth: string, gid: number): Promise<void> {
    await client.delete("/api/v0/child/quiz_group", {headers: {Authorization: auth}, data: {gid}});
}
