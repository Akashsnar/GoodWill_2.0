import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteBlog } from "./blogdata";
const BlogList = ({blogs}) => {
    const dispatch = useDispatch();
    const deleteBlogFunction = (id) => {
        console.log(id)
        dispatch(deleteBlog(id));
    }
    return ( 
        <div className="w-4/5 md:w-9/12 mx-auto md:mt-10">
            <div className="grid md:grid-cols-3 gap-4">
                {blogs.map( blog => (
                    <div className="blog-div" key={blog.id}>
                        <div className="flex flex-col">
                            <Link to={`/blogs/${blog.id}`}>
                            <div>
                                <img src={blog.image} className="object-fit h-64 md:h-52 w-full"/>
                            </div>
                            <div className="p-4 flex justify-between">
                                <div>
                                    <h2 className="py-2 text-title">{ blog.title }</h2>
                                    <p className="pb-2 text-sub-title">Written by { blog.author }</p>
                                    <p className="pb-2 text-content">{ blog.description.slice(0,100) }<span className="text-primary">Read More.....</span></p>
                                    <span className="inline-block bg-gray-50 shadow-md rounded-full px-2 md:px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{blog.category}</span> 
                                </div>
                            </div>
                            </Link>
                        </div>
                        {/* <button onClick={() => {deleteBlogFunction(blog.id)}}>Delete Blog</button> */}
                    </div>
                ))}
            </div>
            
        </div>
     );
}
 
export default BlogList;