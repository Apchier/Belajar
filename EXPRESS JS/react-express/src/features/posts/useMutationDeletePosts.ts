import { useState } from "react";
import { PostsResponse } from "../../types/Types";
import axiosInstance from "../../libs/axios";

export default function useDeletePosts() {
    const [state, setState] = useState<Omit<PostsResponse, "mutate">>({
        data: null,
        error: null,
        loading: false,
        message: "",
        status: "",
    });

    const deletePost = async (id: string) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await axiosInstance.delete(`/posts/${id}`);
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
    };

    return {
        ...state,
        deletePost,
    };
}
