# V2Api.ShardsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createShard**](ShardsApi.md#createShard) | **POST** /collections/{collectionName}/shards | Create a new shard in an existing collection
[**deleteShard**](ShardsApi.md#deleteShard) | **DELETE** /collections/{collectionName}/shards/{shardName} | Delete an existing shard
[**forceShardLeader**](ShardsApi.md#forceShardLeader) | **POST** /collections/{collectionName}/shards/{shardName}/force-leader | Force leader election to occur on the specified collection and shard
[**installShardData**](ShardsApi.md#installShardData) | **POST** /collections/{collName}/shards/{shardName}/install | Install offline index into an existing shard
[**syncShard**](ShardsApi.md#syncShard) | **POST** /collections/{collectionName}/shards/{shardName}/sync | Trigger a &#39;sync&#39; operation for the specified shard



## createShard

> SubResponseAccumulatingJerseyResponse createShard(collectionName, opts)

Create a new shard in an existing collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ShardsApi();
let collectionName = "collectionName_example"; // String | 
let opts = {
  'createShardRequestBody': new V2Api.CreateShardRequestBody() // CreateShardRequestBody | 
};
apiInstance.createShard(collectionName, opts, (error, data, response) => {
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
 **createShardRequestBody** | [**CreateShardRequestBody**](CreateShardRequestBody.md)|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteShard

> SubResponseAccumulatingJerseyResponse deleteShard(collectionName, shardName, opts)

Delete an existing shard

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ShardsApi();
let collectionName = "collectionName_example"; // String | 
let shardName = "shardName_example"; // String | 
let opts = {
  'deleteInstanceDir': true, // Boolean | 
  'deleteDataDir': true, // Boolean | 
  'deleteIndex': true, // Boolean | 
  'followAliases': true, // Boolean | 
  'async': "async_example" // String | 
};
apiInstance.deleteShard(collectionName, shardName, opts, (error, data, response) => {
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
 **shardName** | **String**|  | 
 **deleteInstanceDir** | **Boolean**|  | [optional] 
 **deleteDataDir** | **Boolean**|  | [optional] 
 **deleteIndex** | **Boolean**|  | [optional] 
 **followAliases** | **Boolean**|  | [optional] 
 **async** | **String**|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## forceShardLeader

> SolrJerseyResponse forceShardLeader(collectionName, shardName)

Force leader election to occur on the specified collection and shard

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ShardsApi();
let collectionName = "collectionName_example"; // String | 
let shardName = "shardName_example"; // String | 
apiInstance.forceShardLeader(collectionName, shardName, (error, data, response) => {
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
 **shardName** | **String**|  | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## installShardData

> SolrJerseyResponse installShardData(collName, shardName, opts)

Install offline index into an existing shard

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ShardsApi();
let collName = "collName_example"; // String | 
let shardName = "shardName_example"; // String | 
let opts = {
  'installShardDataRequestBody': new V2Api.InstallShardDataRequestBody() // InstallShardDataRequestBody | 
};
apiInstance.installShardData(collName, shardName, opts, (error, data, response) => {
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
 **shardName** | **String**|  | 
 **installShardDataRequestBody** | [**InstallShardDataRequestBody**](InstallShardDataRequestBody.md)|  | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## syncShard

> SolrJerseyResponse syncShard(collectionName, shardName)

Trigger a &#39;sync&#39; operation for the specified shard

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ShardsApi();
let collectionName = "collectionName_example"; // String | 
let shardName = "shardName_example"; // String | 
apiInstance.syncShard(collectionName, shardName, (error, data, response) => {
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
 **shardName** | **String**|  | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

