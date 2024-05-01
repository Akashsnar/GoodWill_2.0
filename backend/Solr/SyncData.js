const axios = require('axios');
const Ngomodel = require("../mongoSchema/mongoschemango");

// Function to fetch data from MongoDB
async function fetchDataFromMongoDB() {
    try {
        const ngodetails = await Ngomodel.find({});
        return ngodetails;
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        throw error;
    }
}

// Function to transform MongoDB data into Solr format
function transformDataForSolr(ngodetails) {
    return ngodetails.map(doc => ({
        _id: doc._id.toString(),
        ngoname: doc.ngoname,
        campagainname: doc.campagainname,
        category: doc.category,
        goal: doc.goal,
        desc: doc.desc,
        image: doc.image,
        raised: doc.raised
    }));
}

// Function to send data to Solr using Axios
async function sendDataToSolr(data) {
    const solrUrl = `http://127.0.0.1:8983/solr/Ngodetails/update?commit=true`;

    try {
        const response = await axios.post(solrUrl, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Data synchronized successfully:', response.data);
    } catch (error) {
        console.error('Error synchronizing data with Solr:', error);
        throw error;
    }
    
}

// Main function to synchronize data between MongoDB and Solr
async function syncData() {
    try {
        const ngodetails = await fetchDataFromMongoDB();
        
        const solrData = transformDataForSolr(ngodetails);
    
        await sendDataToSolr(solrData);
    } catch (error) {
        console.error('Error synchronizing data:', error);
    }
}

// Execute synchronization
module.exports = syncData;
