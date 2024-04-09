import client from "../baseRequest.ts";
import AuthorizeManager from "../../utils/authorize.ts";

export async function toChildMode(auth: string, childId: number): Promise<void> {
    const resp = await client.post<string>("/api/v0/parent/to_child", {cid: childId}, {
        headers: {
            "Authorization": auth
        }
    })
    if (resp.data.isOk()) {

        const newToken = resp.data.expect();
        AuthorizeManager.setToken(newToken)
    }

}

export async function toParentMode(auth: string, secret: string): Promise<void> {
    const resp = await client.post<string>("/api/v0/parent/access",
        {secret: secret}, {
            headers: {
                "Authorization": auth
            }
        })
    if (resp.data.isOk()) {

        const newToken = resp.data.expect();
        AuthorizeManager.setToken(newToken)
    }

}