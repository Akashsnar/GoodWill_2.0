# V2Api.SchemaApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSchemaInfo**](SchemaApi.md#getSchemaInfo) | **GET** /{indexType}/{indexName}/schema | Fetch the entire schema of the specified core or collection
[**getSchemaName**](SchemaApi.md#getSchemaName) | **GET** /{indexType}/{indexName}/schema/name | Get the name of the schema used by the specified core or collection
[**getSchemaSimilarity**](SchemaApi.md#getSchemaSimilarity) | **GET** /{indexType}/{indexName}/schema/similarity | Get the default similarity configuration used by the specified core or collection
[**getSchemaUniqueKey**](SchemaApi.md#getSchemaUniqueKey) | **GET** /{indexType}/{indexName}/schema/uniquekey | Fetch the uniquekey of the specified core or collection
[**getSchemaVersion**](SchemaApi.md#getSchemaVersion) | **GET** /{indexType}/{indexName}/schema/version | Fetch the schema version currently used by the specified core or collection
[**getSchemaZkVersion**](SchemaApi.md#getSchemaZkVersion) | **GET** /{indexType}/{indexName}/schema/zkversion | Fetch the schema version currently used by the specified core or collection



## getSchemaInfo

> SchemaInfoResponse getSchemaInfo(indexType, indexName)

Fetch the entire schema of the specified core or collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.SchemaApi();
let indexType = new V2Api.IndexType(); // IndexType | 
let indexName = "indexName_example"; // String | 
apiInstance.getSchemaInfo(indexType, indexName, (error, data, response) => {
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
 **indexType** | [**IndexType**](.md)|  | 
 **indexName** | **String**|  | 

### Return type

[**SchemaInfoResponse**](SchemaInfoResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getSchemaName

> SchemaNameResponse getSchemaName(indexType, indexName)

Get the name of the schema used by the specified core or collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.SchemaApi();
let indexType = new V2Api.IndexType(); // IndexType | 
let indexName = "indexName_example"; // String | 
apiInstance.getSchemaName(indexType, indexName, (error, data, response) => {
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
 **indexType** | [**IndexType**](.md)|  | 
 **indexName** | **String**|  | 

### Return type

[**SchemaNameResponse**](SchemaNameResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getSchemaSimilarity

> SchemaSimilarityResponse getSchemaSimilarity(indexType, indexName)

Get the default similarity configuration used by the specified core or collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.SchemaApi();
let indexType = new V2Api.IndexType(); // IndexType | 
let indexName = "indexName_example"; // String | 
apiInstance.getSchemaSimilarity(indexType, indexName, (error, data, response) => {
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
 **indexType** | [**IndexType**](.md)|  | 
 **indexName** | **String**|  | 

### Return type

[**SchemaSimilarityResponse**](SchemaSimilarityResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getSchemaUniqueKey

> SchemaUniqueKeyResponse getSchemaUniqueKey(indexType, indexName)

Fetch the uniquekey of the specified core or collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.SchemaApi();
let indexType = new V2Api.IndexType(); // IndexType | 
let indexName = "indexName_example"; // String | 
apiInstance.getSchemaUniqueKey(indexType, indexName, (error, data, response) => {
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
 **indexType** | [**IndexType**](.md)|  | 
 **indexName** | **String**|  | 

### Return type

[**SchemaUniqueKeyResponse**](SchemaUniqueKeyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getSchemaVersion

> SchemaVersionResponse getSchemaVersion(indexType, indexName)

Fetch the schema version currently used by the specified core or collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.SchemaApi();
let indexType = new V2Api.IndexType(); // IndexType | 
let indexName = "indexName_example"; // String | 
apiInstance.getSchemaVersion(indexType, indexName, (error, data, response) => {
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
 **indexType** | [**IndexType**](.md)|  | 
 **indexName** | **String**|  | 

### Return type

[**SchemaVersionResponse**](SchemaVersionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getSchemaZkVersion

> SchemaZkVersionResponse getSchemaZkVersion(indexType, indexName, opts)

Fetch the schema version currently used by the specified core or collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.SchemaApi();
let indexType = new V2Api.IndexType(); // IndexType | 
let indexName = "indexName_example"; // String | 
let opts = {
  'refreshIfBelowVersion': -1 // Number | 
};
apiInstance.getSchemaZkVersion(indexType, indexName, opts, (error, data, response) => {
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
 **indexType** | [**IndexType**](.md)|  | 
 **indexName** | **String**|  | 
 **refreshIfBelowVersion** | **Number**|  | [optional] [default to -1]

### Return type

[**SchemaZkVersionResponse**](SchemaZkVersionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

