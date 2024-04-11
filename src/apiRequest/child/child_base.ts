import client, {ResponseResult} from "../baseRequest.ts";

export async function childName(auth: string): Promise<ResponseResult<string>> {
    const resp = await client.get<string>("/api/v0/child/name", {headers: {Authorization: auth}})

    return resp.data
}