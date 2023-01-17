
export interface Secret {
    hash: string,
    secretText:string,
    createdAt: Date,
    expiresAt: Date,
    remainingViews: number
}