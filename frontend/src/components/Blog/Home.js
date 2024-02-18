import { useState } from "react";
import BlogList from "./BlogList";
import { useSelector } from "react-redux";


const Home = () => {
    const data = useSelector((state) => state.blogs)
    return (
        <div>
            <div className="w-4/5 md:w-9/12 mx-auto mt-10">
            </div>
            <BlogList
                blogs={data}
            />
        </div>
    );
}

export default Home;