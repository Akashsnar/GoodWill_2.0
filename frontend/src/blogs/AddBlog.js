import { useState } from "react";
import { useNavigate } from "react-router";
import convertToBase64 from "../helper/ConvertToBase64";
import { useDispatch } from "react-redux";
import { addBlog } from "../redux/features/auth/authSlice";

const AddBlog = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('Tasfia');
    const [blogImage, setBlogImage] = useState(null);
    const [category, setCategory] = useState('Travel');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleImageSelect = async (e) => {
        const base64 = await convertToBase64(e.target.files[0])
        setBlogImage(base64);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = {
            title: title,
            author: author,
            description: body,
            category: category,
            image: blogImage,
            id: crypto.randomUUID()
        };

        setIsLoading(true);

        dispatch(addBlog(blog));
        navigate("/blogs");
    }

    return (
        <div className="w-4/5 md:w-9/12 mx-auto md:mt-10">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 my-4 flex flex-col justify-center items-center">
                <h1 className="text-2xl text-gray-700 font-semibold">New Blog</h1>
                <div className="my-2 w-full md:w-3/5">
                    <label className="block text-gray-700 text-lg font-bold mb-2">
                        Title
                    </label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        id="name" type="text" placeholder="Title" value={title}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="my-2 w-full md:w-3/5">
                    <label className="block text-gray-700 text-lg font-bold mb-2">
                        Blog Content
                    </label>
                    <textarea
                        onChange={(e) => setBody(e.target.value)}
                        id="content" value={body}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="my-2 w-full md:w-3/5">
                    <label className="block text-gray-700 text-lg font-bold mb-2">
                        Author
                    </label>
                    <select
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    >
                        <option value="Scorcesse">Scorcesse</option>
                        <option value="Mansura">Mansura</option>
                        <option value="Steve">Steve</option>
                    </select>
                </div>
                <div className="my-2 w-full md:w-3/5">
                    <label className="block text-gray-700 text-lg font-bold mb-2">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="travel">Cinema</option>
                        <option value="sports">God's</option>
                        <option value="technology">Technology</option>
                    </select>
                </div>
                <div className="my-2 w-full md:w-3/5">
                    <label className="block text-gray-700 text-lg font-bold mb-2">
                        Upload Image
                    </label>
                    <input
                        onChange={handleImageSelect}
                        id="photo" type="file"
                        className="md:w-2/3"
                        style={{height: "50px"}}
                    />
                </div>
                {!isLoading &&
                    <button className="mt-4 w-3/5 md:w-1/5 bg-green-500 hover:bg-green-700 text-white text-lg font-bold py-1 px-2 rounded-lg focus:outline-none focus:shadow-outline" type="submit">
                        Add
                    </button>}
                {isLoading &&
                    <p className="w-3/5 md:w-1/5">
                        Adding blog...
                    </p>}
            </form>
        </div>
    );
}

export default AddBlog;