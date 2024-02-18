import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlog } from "../redux/features/auth/authSlice";


const BlogDetails = () => {
    const blogs = useSelector((state)=> state.blogs);
    const {id} = useParams();
    const dispatch = useDispatch();
    const [liked, setLiked] = useState(false);

    const deleteBlogFunction = () => {
        console.log(id)
        dispatch(deleteBlog(id));
    }

    const datas = blogs.filter((blog) => { return blog.id == id});
    const data = datas[0];
    const toggleLike = () => {
        let localLiked = liked;
        localLiked = !localLiked;
        setLiked(localLiked);
        if(localLiked){
            console.log("liked");
        }
        else{
            console.log("unliked");
        }
    }

    return ( 
        <div className="w-4/5 md:w-7/12 mx-auto md:mt-10">
            {/* {console.log(data)} */}
            {data && (
                <div>
                    <h2 className="py-2 blog-detail-title">{ data.title }</h2>
                    <p className="text-sub-title mb-6">Written by { data.author }</p>
                    <div>
                        <img className="w-full object-cover h-40 md:h-4/5 mb-6 rounded" src={data.image}/>
                        <p className="text-content text-justify">{ data.description }</p>
                    </div>
                    <div className="my-4 flex space-x-4">
                        <div className="text-red-500 hover:text-black" onClick={deleteBlogFunction}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div className="" onClick={toggleLike}>
                            {liked === false ?  
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            :
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-red-500 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default BlogDetails;