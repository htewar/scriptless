export class User {
    uid: string;
    userName: string;
    token: string;
    constructor(uid: string, userName: string, token: string) {
        this.uid = uid;
        this.userName = userName;
        this.token = token;
    }
}

export default class LoginApiResponse {
    isUserAuthenticated: boolean;
    errorMessage?: string;
    user?: User
    constructor(
        isUserAuthenticated: boolean,
        errorMessage?: string,
        user?: User
    ) {
        this.isUserAuthenticated = isUserAuthenticated;
        this.errorMessage = errorMessage;
        this.user = user;
    }
}
