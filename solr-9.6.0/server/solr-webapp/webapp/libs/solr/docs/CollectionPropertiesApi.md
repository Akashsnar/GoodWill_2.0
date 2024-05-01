# V2Api.CollectionPropertiesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createOrUpdateCollectionProperty**](CollectionPropertiesApi.md#createOrUpdateCollectionProperty) | **PUT** /collections/{collName}/properties/{propName} | Create or update a collection property
[**deleteCollectionProperty**](CollectionPropertiesApi.md#deleteCollectionProperty) | **DELETE** /collections/{collName}/properties/{propName} | Delete the specified collection property from the collection



## createOrUpdateCollectionProperty

> SolrJerseyResponse createOrUpdateCollectionProperty(collName, propName, opts)

Create or update a collection property

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionPropertiesApi();
let collName = "collName_example"; // String | 
let propName = "propName_example"; // String | 
let opts = {
  'updateCollectionPropertyRequestBody': new V2Api.UpdateCollectionPropertyRequestBody() // UpdateCollectionPropertyRequestBody | 
};
apiInstance.createOrUpdateCollectionProperty(collName, propName, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **collName** | **String**|  | 
 **propName** | **String**|  | 
 **updateCollectionPropertyRequestBody** | [**UpdateCollectionPropertyRequestBody**](UpdateCollectionPropertyRequestBody.md)|  | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteCollectionProperty

> SolrJerseyResponse deleteCollectionProperty(collName, propName)

Delete the specified collection property from the collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionPropertiesApi();
let collName = "collName_example"; // String | 
let propName = "propName_example"; // String | 
apiInstance.deleteCollectionProperty(collName, propName, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **collName** | **String**|  | 
 **propName** | **String**|  | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

