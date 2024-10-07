import { useState } from "react";
import { PostsResponse } from "../../types/Types";
import axiosInstance from "../../libs/axios";

export default function useUpdatePosts() {
    const [state, setState] = useState<Omit<PostsResponse, 'mutate'>>({
        data: null,
        loading: false,
        error: null,
        message: '',
        status: '',
    });

    const updatePosts = async (id: string, content: string) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await axiosInstance.put(`/posts/${id}`, { content });
            setState(prev => ({
                ...prev,
                data: response.data,
                loading: false,
                error: null,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'An error occurred while creating the post',
            }));
        }
    }

    return { 
        ...state,
        updatePosts
    }
}