export type Posts = {
    id: string
    content: string
    created_at: Date
    data: {
        id: string
        content: string
        created_at: string
    } | null
}

export type PostsResponse = {
    mutate: (data: Posts) => Promise<void>;
    data?: Posts | null
    loading?: boolean
    error: string | null
    message: string
    status: string
}


