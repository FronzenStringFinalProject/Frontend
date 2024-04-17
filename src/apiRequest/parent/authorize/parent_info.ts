import client, {ResponseResult} from "../../baseRequest.ts";

export async function getParentName(auth: string): Promise<ResponseResult<string>> {
    const resp = await client.get<string>("/api/v0/parent/name",
        {
            headers: {
                Authorization: auth
            }
        }
    )

    return resp.data

}