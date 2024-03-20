import NGOHeader  from './NGO_header';
import NGOContent from './api_NGO_Content';
// import NGOContent from './NGO_Content';

function NGOPage() {
  const headerProps={
    bgimage:"assets/images/main-slider/slider-1-2.avif",
    heading:"NGO with US",
    page:"NGO"
  }
    return (
      <>      
        <NGOHeader props = { headerProps } />
        <NGOContent />
      </>
    );
  }
  
  export default NGOPage;