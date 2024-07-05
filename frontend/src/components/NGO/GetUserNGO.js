import React, { useState, useEffect, useRef } from 'react';
import Campaign from "./UserNGO";

function GetUserNGO(props) {
    const [campaigns, setCampaigns] = useState([]);
    const [visibleCampaigns, setVisibleCampaigns] = useState(3);
    const [searchQuery, setSearchQuery] = useState('');

     useEffect(() => {
        fetchData();
    }, [props.mode, props.ngoname, props.status]);

    useEffect(() => {
        if (searchQuery) {
            SearchData();
        } else {
            fetchData();
        }
    }, [searchQuery]);
    

    const SearchData = async () => {
        try {
            const encodedQuery = encodeURIComponent(searchQuery);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sitedata/searchNGO?input=${encodedQuery}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCampaigns(data.response.docs);
            console.log("Search Results:", data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchData = async () => {
        const { ngoname, status, mode } = props;
        console.log("Fetching data with status:", status);

        try {
            let response;
            if (mode !== 'ngodash') {
                response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sitedata/ngodetails`);
            } else {
                response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sitedata/ngodetails/campns`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ngoname, status })
                });
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCampaigns(data);
            console.log("Fetched Data:", data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            SearchData();
        }
    };

    const loadMore = () => {
        setVisibleCampaigns(prevVisibleCampaigns => prevVisibleCampaigns + 3);
    };

    return (
        <div style={{ marginTop: "0px" }}>
            <div style={{ marginTop: "10px" }}>
                <div id="search" style={{ display: 'grid', gridArea: 'search', gridTemplate: "'search' 60px / 420px", justifyContent: 'center', alignContent: 'center', justifyItems: 'stretch', alignItems: 'stretch', background: 'hsl(0, 0%, 99%)' }}>
                    <svg viewBox="0 0 420 60" xmlns="http://www.w3.org/2000/svg" style={{ gridArea: 'search', overflow: 'visible', color: 'hsl(215, 100%, 50%)', fill: 'none', stroke: 'currentColor' }}>
                        <rect className="bar" style={{ width: '100%', height: '100%', ry: '50%', strokeWidth: 1 }}></rect>
                        <g className="magnifier" style={{ transformBox: 'fill-box' }}>
                            <circle className="glass" cx="27" cy="27" r="8" strokeWidth="3"></circle>
                            <line className="handle" x1="32" y1="32" x2="44" y2="44" strokeWidth="3"></line>
                        </g>
                    </svg>
                    <input
                        type="search"
                        name="query"
                        aria-label="Search for inspiration"
                        style={{ display: 'block', gridArea: 'search', WebkitAppearance: 'none', appearance: 'none', width: '100%', height: '100%', background: 'none', padding: '0 30px 0 60px', border: 'none', borderRadius: 100, font: '24px/1 system-ui, sans-serif', outlineOffset: -8, marginTop: 'auto', marginBottom: 'auto' }}
                        value={searchQuery}
                        onKeyDown={handleSearchInputKeyPress}
                        onChange={handleSearchInputChange}
                    />
                </div>
            </div>

            {campaigns.slice(0, visibleCampaigns).map(campaign => (
                <Campaign key={campaign._id} data={campaign} mode={props.mode} username={props.username} userDetails={props.userDetails} />
            ))}

            {visibleCampaigns < campaigns.length && (
                <div className="text-center more-post__btn">
                    <a onClick={loadMore} className="thm-btn">
                        Load More
                    </a>
                </div>
            )}
        </div>
    );
}

export default GetUserNGO;
