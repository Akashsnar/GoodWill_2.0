# V2Api.QueryingApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**jsonQuery**](QueryingApi.md#jsonQuery) | **POST** /{indexType}/{indexName}/select | Query a Solr core or collection using the structured request DSL
[**query**](QueryingApi.md#query) | **GET** /{indexType}/{indexName}/select | Query a Solr core or collection using individual query parameters



## jsonQuery

> FlexibleSolrJerseyResponse jsonQuery(indexType, indexName, body)

Query a Solr core or collection using the structured request DSL

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.QueryingApi();
let indexType = new V2Api.IndexType(); // IndexType | 
let indexName = "indexName_example"; // String | 
let body = {key: null}; // Object | 
apiInstance.jsonQuery(indexType, indexName, body, (error, data, response) => {
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
 **body** | **Object**|  | 

### Return type

[**FlexibleSolrJerseyResponse**](FlexibleSolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## query

> FlexibleSolrJerseyResponse query(indexType, indexName, opts)

Query a Solr core or collection using individual query parameters

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.QueryingApi();
let indexType = new V2Api.IndexType(); // IndexType | 
let indexName = "indexName_example"; // String | 
let opts = {
  'q': "q_example", // String | 
  'fq': ["null"], // [String] | 
  'fl': "fl_example", // String | 
  'rows': 56 // Number | 
};
apiInstance.query(indexType, indexName, opts, (error, data, response) => {
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
 **q** | **String**|  | [optional] 
 **fq** | [**[String]**](String.md)|  | [optional] 
 **fl** | **String**|  | [optional] 
 **rows** | **Number**|  | [optional] 

### Return type

[**FlexibleSolrJerseyResponse**](FlexibleSolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

