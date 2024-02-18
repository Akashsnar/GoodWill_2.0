// Import necessary React modules
import React from 'react';

// AboutUsPage component
const AboutUsPage = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
                <div className="flex flex-col md:flex-row items-center justify-center">
                    <div className="md:w-1/2 mb-6 md:mb-0">
                        <img
                            src="https://www.blogtyrant.com/wp-content/uploads/2011/02/best-about-us-pages.png"
                            alt="Team"
                            className="rounded-lg shadow-md"
                        />
                    </div>
                    <div className="md:w-1/2 md:ml-8">
                        <p className="text-gray-800 text-lg mb-4">
                            Empowering Voices, Fostering Connections
                            Our mission is to empower individuals to share their unique perspectives, experiences, and expertise. We strive to foster a sense of connection
                            and community through the written word, transcending geographical boundaries and cultural differences.
                        </p>
                        <p className="text-gray-800 text-lg mb-4">
                            We believe in the value of well-crafted content that adds meaning to our readers' lives. From thought-provoking essays to practical advice,
                            we aim to provide content that informs, entertains, and sparks meaningful conversations.
                        </p>
                        <p className="text-gray-800 text-lg">
                            Thank you for being a part of our journey. Together, let's continue to explore, learn, and celebrate the power of words.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
