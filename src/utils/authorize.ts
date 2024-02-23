class AuthorizeManager {
    private static AUTHORIZE_TOKEN?: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJleHAiOjE3MjQyMjgyNDMsInBhcmVudF9" +
        "pZCI6MiwicHdkX3ZlcnNpb24iOjAsImNoaWxkIjpudWxsfQ.eeFnEaNY27euoEp26J6F3PvRBBOWkq1ytyDc5DfNgNJK0Qe-AcB8czJwtcvD9p3a"

    public static authorized(): boolean {
        return AuthorizeManager.AUTHORIZE_TOKEN !== undefined
    }

    public static getToken(): string {
        if (this.authorized()) {
            return this.AUTHORIZE_TOKEN
        } else {
            throw new Error("Unauthorized")
        }
    }

    public static setToken(token: string) {
        this.AUTHORIZE_TOKEN = token
    }

    public static clearToken() {
        this.AUTHORIZE_TOKEN = undefined
    }
}

export default AuthorizeManager