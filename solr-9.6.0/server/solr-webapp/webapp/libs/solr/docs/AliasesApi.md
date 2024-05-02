# V2Api.AliasesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteAlias**](AliasesApi.md#deleteAlias) | **DELETE** /aliases/{aliasName} | Deletes an alias by its name
[**getAliasByName**](AliasesApi.md#getAliasByName) | **GET** /aliases/{aliasName} | Get details for a specific collection alias.
[**getAliases**](AliasesApi.md#getAliases) | **GET** /aliases | List the existing collection aliases.



## deleteAlias

> SolrJerseyResponse deleteAlias(aliasName, opts)

Deletes an alias by its name

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.AliasesApi();
let aliasName = "aliasName_example"; // String | The name of the alias to delete
let opts = {
  'async': "async_example" // String | 
};
apiInstance.deleteAlias(aliasName, opts, (error, data, response) => {
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
 **aliasName** | **String**| The name of the alias to delete | 
 **async** | **String**|  | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getAliasByName

> GetAliasByNameResponse getAliasByName(aliasName)

Get details for a specific collection alias.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.AliasesApi();
let aliasName = "aliasName_example"; // String | Alias name.
apiInstance.getAliasByName(aliasName, (error, data, response) => {
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
 **aliasName** | **String**| Alias name. | 

### Return type

[**GetAliasByNameResponse**](GetAliasByNameResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getAliases

> ListAliasesResponse getAliases()

List the existing collection aliases.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.AliasesApi();
apiInstance.getAliases((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ListAliasesResponse**](ListAliasesResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

