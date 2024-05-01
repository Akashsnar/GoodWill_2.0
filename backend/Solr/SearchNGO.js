const axios = require('axios');

async function searchSolr(userInput) {
    const encodedUserInput = encodeURIComponent(userInput);
    const solrUrl = `http://127.0.0.1:8983/solr/Ngodetails/select?q=${encodedUserInput}&defType=edismax&qf=campagainname^4%20ngoname^3%20category^2%20desc^1`;

    try {
        const response = await axios.get(solrUrl);
        console.log('Search results:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error searching Solr:', error);
        throw error;
    }
}

// Example usage:
// const userInput = "your search query here";/
module.exports = searchSolr;
