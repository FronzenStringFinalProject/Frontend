class AuthorizeManager {
    private static AUTHORIZE_TOKEN?: string

    public static authorized(): boolean {
        return AuthorizeManager.AUTHORIZE_TOKEN !== undefined
    }

    public static getToken(): string {
        if (this.AUTHORIZE_TOKEN) {
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