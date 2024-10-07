import { useEffect, useState } from "react";
import axiosIntence from "../../libs/axios";
import { PostsResponse } from "../../types/Types";

export default function usePosts() {
    const [state, setState] = useState<Omit<PostsResponse, 'mutate'>>({
        data: null,
        loading: false,
        error: null,
        message: '',
        status: '',
    });

    useEffect(() => {
        const fetchPosts = async () => {
            setState(prev => ({ ...prev })); 
            try {
                const response = await axiosIntence.get('/posts')
                setState(prev => ({
                    ...prev,
                    data: response.data,
                }));
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: error instanceof Error ? error.message : 'An error occurred while creating the post',
                }))
            }
        };
        fetchPosts()
    }, [])

    return {
        ...state,
    }
}