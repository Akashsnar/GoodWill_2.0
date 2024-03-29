import { useState } from "react";
import {Link} from 'react-router-dom';

const Navbar = () => {
    const [isHidden, setHidden] = useState("true");

    const handleMenu = (e) => {
        e.preventDefault();
        setHidden(!isHidden);
    }

    return ( 
        <header className="md:flex md:items-center md:justify-between py-4 pb-0 md:pb-4">
            <div className="w-4/5 md:w-9/12 mx-auto md:flex md:items-center md:justify-center">
                <div className="flex items-center justify-between md:justify-center">
                    
                    <div className="flex items-center justify-between mb-4 md:mb-0 md:hidden">
                        <h1 className="leading-none text-2xl">
                            <Link to="/blogs" className="text-4xl 2xl:text-8xl no-underline font-allison text-primary">
                            EchoVerse
                            </Link>
                        </h1>
                    </div>

                    <nav className="md:hidden mb-4" onClick={handleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </nav>
                </div>
                <nav className={`md:block ${isHidden ? "hidden" : "block"} `}>
                    <ul className="list-reset md:flex md:items-center">
                        <li className="md:ml-4 md:mx-8">
                            <Link to="/blogs/add" className="nav-link">
                            New Blog
                            </Link>
                        </li>
                        <li className="md:ml-4 md:mx-8">
                            <Link to="/blogs" className="nav-link">
                            Blogs
                            </Link>
                        </li>
                        <div className="items-center justify-between mb-4 md:mb-0 md:mx-8 hidden md:inline">
                            <h1 className="leading-none text-2xl">
                                <Link to="/blogs" className="text-2xl 2xl:text-8xl no-underline font-allison text-primary">
                                NGO-Blogs
                                </Link>
                            </h1>
                        </div>
                        <li className="md:ml-4 md:mx-8">
                            <Link to="/blogs/about" className="nav-link">
                            About
                            </Link>
                        </li>
                        <li className="md:ml-4">
                            <Link to="/blogs/contact" className="nav-link">
                            Contact
                            </Link>
                        </li>
                        <li className="md:ml-8">
                            <Link to="/" style={{color:'red'}} className="nav-link">
                            Exit
                            </Link>
                        </li>
                    </ul>
                </nav>
                </div>
        </header>
    );
}
 
export default Navbar;