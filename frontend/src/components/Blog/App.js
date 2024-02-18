import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import Navbar from './Navbar';
import Home from './Home';
import ContactUs from './ContactUs';
import AboutUs from './AboutUs'

const client = new ApolloClient({
  uri: 'http://localhost:1337/graphql',
  cache: new InMemoryCache()
})


function App() {

  return (
    // <Router>
    //   <ApolloProvider client={client}>
    //     <div className="App">
    //       <Navbar />
    //       <div className="content">
    //         <Routes>
    //           <Route exact path="/react-blog">
    //             <Home />
    //           </Route>
    //           {/* <Route exact path="/blogs/add">
    //             <AddBlog />
    //           </Route> */}
    //           {/* <Route path="/blogs/:id">
    //             <BlogDetails />
    //           </Route> */}
    //           <Route path="/contact">
    //             <ContactUs />
    //           </Route>
    //           <Route path="/about">
    //             <AboutUs />
    //           </Route>
    //         </Routes>
    //       </div>
    //     </div>
    //   </ApolloProvider>
    // </Router>
    <>
    </>
  );
}

export default App;
