# V2Api.CollectionsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**balanceShardUnique**](CollectionsApi.md#balanceShardUnique) | **POST** /collections/{collectionName}/balance-shard-unique | Ensure a specified per-shard property is distributed evenly amongst physical nodes comprising a collection
[**createCollection**](CollectionsApi.md#createCollection) | **POST** /collections | Creates a new SolrCloud collection.
[**deleteCollection**](CollectionsApi.md#deleteCollection) | **DELETE** /collections/{collectionName} | Deletes a collection from SolrCloud
[**listCollections**](CollectionsApi.md#listCollections) | **GET** /collections | List all collections in this Solr cluster
[**reloadCollection**](CollectionsApi.md#reloadCollection) | **POST** /collections/{collectionName}/reload | Reload all cores in the specified collection.
[**renameCollection**](CollectionsApi.md#renameCollection) | **POST** /collections/{collectionName}/rename | Rename a SolrCloud collection



## balanceShardUnique

> SubResponseAccumulatingJerseyResponse balanceShardUnique(collectionName, opts)

Ensure a specified per-shard property is distributed evenly amongst physical nodes comprising a collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionsApi();
let collectionName = "collectionName_example"; // String | 
let opts = {
  'balanceShardUniqueRequestBody': new V2Api.BalanceShardUniqueRequestBody() // BalanceShardUniqueRequestBody | 
};
apiInstance.balanceShardUnique(collectionName, opts, (error, data, response) => {
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
 **collectionName** | **String**|  | 
 **balanceShardUniqueRequestBody** | [**BalanceShardUniqueRequestBody**](BalanceShardUniqueRequestBody.md)|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## createCollection

> SubResponseAccumulatingJerseyResponse createCollection(opts)

Creates a new SolrCloud collection.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionsApi();
let opts = {
  'createCollectionRequestBody': new V2Api.CreateCollectionRequestBody() // CreateCollectionRequestBody | 
};
apiInstance.createCollection(opts, (error, data, response) => {
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
 **createCollectionRequestBody** | [**CreateCollectionRequestBody**](CreateCollectionRequestBody.md)|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteCollection

> SubResponseAccumulatingJerseyResponse deleteCollection(collectionName, opts)

Deletes a collection from SolrCloud

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionsApi();
let collectionName = "collectionName_example"; // String | The name of the collection to be deleted.
let opts = {
  'followAliases': true, // Boolean | 
  'async': "async_example" // String | An ID to track the request asynchronously
};
apiInstance.deleteCollection(collectionName, opts, (error, data, response) => {
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
 **collectionName** | **String**| The name of the collection to be deleted. | 
 **followAliases** | **Boolean**|  | [optional] 
 **async** | **String**| An ID to track the request asynchronously | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listCollections

> ListCollectionsResponse listCollections()

List all collections in this Solr cluster

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionsApi();
apiInstance.listCollections((error, data, response) => {
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

[**ListCollectionsResponse**](ListCollectionsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## reloadCollection

> SubResponseAccumulatingJerseyResponse reloadCollection(collectionName, opts)

Reload all cores in the specified collection.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionsApi();
let collectionName = "collectionName_example"; // String | 
let opts = {
  'reloadCollectionRequestBody': new V2Api.ReloadCollectionRequestBody() // ReloadCollectionRequestBody | 
};
apiInstance.reloadCollection(collectionName, opts, (error, data, response) => {
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
 **collectionName** | **String**|  | 
 **reloadCollectionRequestBody** | [**ReloadCollectionRequestBody**](ReloadCollectionRequestBody.md)|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## renameCollection

> SubResponseAccumulatingJerseyResponse renameCollection(collectionName, opts)

Rename a SolrCloud collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionsApi();
let collectionName = "collectionName_example"; // String | 
let opts = {
  'renameCollectionRequestBody': new V2Api.RenameCollectionRequestBody() // RenameCollectionRequestBody | 
};
apiInstance.renameCollection(collectionName, opts, (error, data, response) => {
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
 **collectionName** | **String**|  | 
 **renameCollectionRequestBody** | [**RenameCollectionRequestBody**](RenameCollectionRequestBody.md)|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

