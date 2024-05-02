# V2Api.AliasPropertiesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createOrUpdateAliasProperty**](AliasPropertiesApi.md#createOrUpdateAliasProperty) | **PUT** /aliases/{aliasName}/properties/{propName} | Update a specific property for a collection alias.
[**deleteAliasProperty**](AliasPropertiesApi.md#deleteAliasProperty) | **DELETE** /aliases/{aliasName}/properties/{propName} | Delete a specific property for a collection alias.
[**getAliasProperty**](AliasPropertiesApi.md#getAliasProperty) | **GET** /aliases/{aliasName}/properties/{propName} | Get a specific property for a collection alias.
[**getAllAliasProperties**](AliasPropertiesApi.md#getAllAliasProperties) | **GET** /aliases/{aliasName}/properties | Get properties for a collection alias.
[**updateAliasProperties**](AliasPropertiesApi.md#updateAliasProperties) | **PUT** /aliases/{aliasName}/properties | Update properties for a collection alias.



## createOrUpdateAliasProperty

> SolrJerseyResponse createOrUpdateAliasProperty(aliasName, propName, updateAliasPropertyRequestBody)

Update a specific property for a collection alias.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.AliasPropertiesApi();
let aliasName = "aliasName_example"; // String | Alias Name
let propName = "propName_example"; // String | Property Name
let updateAliasPropertyRequestBody = new V2Api.UpdateAliasPropertyRequestBody(); // UpdateAliasPropertyRequestBody | Property value that needs to be updated
apiInstance.createOrUpdateAliasProperty(aliasName, propName, updateAliasPropertyRequestBody, (error, data, response) => {
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
 **aliasName** | **String**| Alias Name | 
 **propName** | **String**| Property Name | 
 **updateAliasPropertyRequestBody** | [**UpdateAliasPropertyRequestBody**](UpdateAliasPropertyRequestBody.md)| Property value that needs to be updated | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteAliasProperty

> SolrJerseyResponse deleteAliasProperty(aliasName, propName)

Delete a specific property for a collection alias.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.AliasPropertiesApi();
let aliasName = "aliasName_example"; // String | Alias Name
let propName = "propName_example"; // String | Property Name
apiInstance.deleteAliasProperty(aliasName, propName, (error, data, response) => {
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
 **aliasName** | **String**| Alias Name | 
 **propName** | **String**| Property Name | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getAliasProperty

> GetAliasPropertyResponse getAliasProperty(aliasName, propName)

Get a specific property for a collection alias.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.AliasPropertiesApi();
let aliasName = "aliasName_example"; // String | Alias Name
let propName = "propName_example"; // String | Property Name
apiInstance.getAliasProperty(aliasName, propName, (error, data, response) => {
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
 **aliasName** | **String**| Alias Name | 
 **propName** | **String**| Property Name | 

### Return type

[**GetAliasPropertyResponse**](GetAliasPropertyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getAllAliasProperties

> GetAllAliasPropertiesResponse getAllAliasProperties(aliasName)

Get properties for a collection alias.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.AliasPropertiesApi();
let aliasName = "aliasName_example"; // String | Alias Name
apiInstance.getAllAliasProperties(aliasName, (error, data, response) => {
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
 **aliasName** | **String**| Alias Name | 

### Return type

[**GetAllAliasPropertiesResponse**](GetAllAliasPropertiesResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## updateAliasProperties

> SolrJerseyResponse updateAliasProperties(aliasName, updateAliasPropertiesRequestBody)

Update properties for a collection alias.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.AliasPropertiesApi();
let aliasName = "aliasName_example"; // String | Alias Name
let updateAliasPropertiesRequestBody = new V2Api.UpdateAliasPropertiesRequestBody(); // UpdateAliasPropertiesRequestBody | Properties that need to be updated
apiInstance.updateAliasProperties(aliasName, updateAliasPropertiesRequestBody, (error, data, response) => {
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
 **aliasName** | **String**| Alias Name | 
 **updateAliasPropertiesRequestBody** | [**UpdateAliasPropertiesRequestBody**](UpdateAliasPropertiesRequestBody.md)| Properties that need to be updated | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

