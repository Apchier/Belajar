import { useState } from "react";
import usePosts from "../../features/posts/usePosts";
import { Posts } from "../../types/Types";
import { LuPenSquare } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import useCreatePosts from "../../features/posts/useMutationCreatePosts";
import useDeletePosts from "../../features/posts/useMutationDeletePosts";
import useUpdatePosts from "../../features/posts/useMutationUpdatePosts";

import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

export default function Home() {
    const { data } = usePosts()
    const [ updateID, setUpdateID ] = useState<string>("")
    const [ updateContent, setUpdateContent ] = useState<string>("")
    const { createPost } = useCreatePosts()
    const { deletePost } = useDeletePosts()
    const { updatePosts } = useUpdatePosts()

    const inputSchema = z.object({
        content: z
            .string()
            .min(3, { message: "Minimal 3 characters" })
            .max(20, { message: "Maximal 20 characters" }),
    });
    type FormSchemaType = z.infer<typeof inputSchema>;

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<FormSchemaType>({ resolver: zodResolver(inputSchema) })

    const onSubmit = async () => {
        if (updateID) {
            await updatePosts(updateID, updateContent);
            window.location.reload();
        } else {
            await createPost(updateContent);
            window.location.reload();
        }
        setUpdateID("");
        setUpdateContent("");
        reset();
    };

    const handleUpdate = (posts: Posts) => {
        setUpdateID(posts.id)
        setUpdateContent(posts.content) 
    }

    const handleDelete = (id: string) => {
        deletePost(id)
        window.location.reload()
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gray-100">
            <div className="flex flex-col justify-center items-center w-[70%] h-[600px] bg-white p-[50px] shadow-md">
                <h1 className="text-2xl">FORM PROT-PROT</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-4 mt-[50px]">
                    <div className="flex w-full gap-4">
                        <input
                            type="text"
                            placeholder="Create content"
                            value={updateContent}
                            {...register("content")}
                            onChange={(e) => setUpdateContent(e.target.value)}
                            className="w-full h-[50px] px-4 border border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-[150px] h-[50px] p-2 text-white bg-blue-500 hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                    {errors.content && <span className="text-red-500">{errors.content.message}</span>}
                </form>

                <div className="flex w-full flex-col gap-4 mt-[20px] border border-gray-300">
                    <div className="h-[300px] w-full overflow-y-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200 sticky top-[-1px]">
                                <tr>
                                    <th className="border border-gray-300 p-2">ID</th>
                                    <th className="border border-gray-300 p-2">Content</th>
                                    <th className="border border-gray-300 p-2">Created At</th>
                                    <th className="border border-gray-300 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.data?.map((posts: Posts) => (
                                    <tr key={posts.id}>
                                        <td className="border border-gray-300 p-2">{posts.id}</td>
                                        <td className="border border-gray-300 p-2">{posts.content}</td>
                                        <td className="border border-gray-300 p-2">{new Date(posts.created_at).toLocaleString()}</td>
                                        <td className="border border-gray-300 p-4 text-xl flex justify-around">
                                            <button className="text-blue-500" onClick={() => handleUpdate(posts)}>
                                                <LuPenSquare />
                                            </button>
                                            <button className="text-red-500" onClick={() => handleDelete(posts.id)}>
                                                <MdDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
