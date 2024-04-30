const asyncHandler = require("express-async-handler");
const CartDetails = require('../mongoSchema/productlisting.js');

const handleCart = asyncHandler(async(req,res)=>{
    // console.log(req.body);
    const payload  = req.body.cartitems;

      if(!payload)return;
    //   console.log(payload);
      const ngo_storeDetails = payload[0].ngo_storeDetails;
      const CampaignName = ngo_storeDetails.CampaignName;
      const Ngoname = ngo_storeDetails.NgoName;
    
      const user_storeDetails = payload[0].user_storeDetails;
      const {Email,Gender,Name,Phone}=user_storeDetails;
      const Username = Name;
      const ProductDetails=[];
      for(let i =0 ;i< payload.length ; i++)
      {

          let{category,description,image,price,title} = payload[i];
          ProductDetails.push({
                category:category,
                description:description,
                image:image,
                price:price,
                title:title
            })
      }
//  { $push: { your_array_field: { $each: newValues } } },
      const filter = {Ngoname:Ngoname,Username:Username,CampaignName:CampaignName};
      const doc = {
        $push : {
            ProductDetails:{$each:ProductDetails} 
        }
      }
      const options = {upsert:true};
      const cartInsert = await CartDetails.updateOne(filter,doc,options);
      console.log(`Documents matching filter: ${cartInsert.matchedCount} , upserted Document Count ${cartInsert.upsertedCount}`);
})
module.exports={
    handleCart,
}