export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface FetchUserPayload {
    email?: string;
    id?:string;
}

export interface UpdateUserPayload {
    id:string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    password?: string;
}

export interface CreatePostPayload {
    content: string;
    imageUrl?: string;
}

export interface SignedUrlPayload {
    filname: string;
    contentType: string;
    userId: string;
}