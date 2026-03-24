export interface User {
    username: string,
    email: string,
    password: string
}

export interface LoginResponse {
    access_token: string,
}

export interface LoginInterface {
    identifier: string,
    password: string,
}