# V2Api.ReplicasApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createReplica**](ReplicasApi.md#createReplica) | **POST** /collections/{collectionName}/shards/{shardName}/replicas | Creates a new replica of an existing shard.
[**deleteReplicaByName**](ReplicasApi.md#deleteReplicaByName) | **DELETE** /collections/{collectionName}/shards/{shardName}/replicas/{replicaName} | Delete an single replica by name
[**deleteReplicasByCount**](ReplicasApi.md#deleteReplicasByCount) | **DELETE** /collections/{collectionName}/shards/{shardName}/replicas | Delete one or more replicas from the specified collection and shard
[**deleteReplicasByCountAllShards**](ReplicasApi.md#deleteReplicasByCountAllShards) | **PUT** /collections/{collectionName}/scale | Scale the replica count for all shards in the specified collection



## createReplica

> SubResponseAccumulatingJerseyResponse createReplica(collectionName, shardName, opts)

Creates a new replica of an existing shard.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ReplicasApi();
let collectionName = "collectionName_example"; // String | 
let shardName = "shardName_example"; // String | 
let opts = {
  'createReplicaRequestBody': new V2Api.CreateReplicaRequestBody() // CreateReplicaRequestBody | 
};
apiInstance.createReplica(collectionName, shardName, opts, (error, data, response) => {
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
 **createReplicaRequestBody** | [**CreateReplicaRequestBody**](CreateReplicaRequestBody.md)|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteReplicaByName

> SubResponseAccumulatingJerseyResponse deleteReplicaByName(collectionName, shardName, replicaName, opts)

Delete an single replica by name

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ReplicasApi();
let collectionName = "collectionName_example"; // String | 
let shardName = "shardName_example"; // String | 
let replicaName = "replicaName_example"; // String | 
let opts = {
  'followAliases': true, // Boolean | 
  'deleteInstanceDir': true, // Boolean | 
  'deleteDataDir': true, // Boolean | 
  'deleteIndex': true, // Boolean | 
  'onlyIfDown': true, // Boolean | 
  'async': "async_example" // String | 
};
apiInstance.deleteReplicaByName(collectionName, shardName, replicaName, opts, (error, data, response) => {
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
 **replicaName** | **String**|  | 
 **followAliases** | **Boolean**|  | [optional] 
 **deleteInstanceDir** | **Boolean**|  | [optional] 
 **deleteDataDir** | **Boolean**|  | [optional] 
 **deleteIndex** | **Boolean**|  | [optional] 
 **onlyIfDown** | **Boolean**|  | [optional] 
 **async** | **String**|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteReplicasByCount

> SubResponseAccumulatingJerseyResponse deleteReplicasByCount(collectionName, shardName, opts)

Delete one or more replicas from the specified collection and shard

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ReplicasApi();
let collectionName = "collectionName_example"; // String | 
let shardName = "shardName_example"; // String | 
let opts = {
  'count': 56, // Number | 
  'followAliases': true, // Boolean | 
  'deleteInstanceDir': true, // Boolean | 
  'deleteDataDir': true, // Boolean | 
  'deleteIndex': true, // Boolean | 
  'onlyIfDown': true, // Boolean | 
  'async': "async_example" // String | 
};
apiInstance.deleteReplicasByCount(collectionName, shardName, opts, (error, data, response) => {
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
 **count** | **Number**|  | [optional] 
 **followAliases** | **Boolean**|  | [optional] 
 **deleteInstanceDir** | **Boolean**|  | [optional] 
 **deleteDataDir** | **Boolean**|  | [optional] 
 **deleteIndex** | **Boolean**|  | [optional] 
 **onlyIfDown** | **Boolean**|  | [optional] 
 **async** | **String**|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteReplicasByCountAllShards

> SubResponseAccumulatingJerseyResponse deleteReplicasByCountAllShards(collectionName, opts)

Scale the replica count for all shards in the specified collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ReplicasApi();
let collectionName = "collectionName_example"; // String | 
let opts = {
  'scaleCollectionRequestBody': new V2Api.ScaleCollectionRequestBody() // ScaleCollectionRequestBody | 
};
apiInstance.deleteReplicasByCountAllShards(collectionName, opts, (error, data, response) => {
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
 **scaleCollectionRequestBody** | [**ScaleCollectionRequestBody**](ScaleCollectionRequestBody.md)|  | [optional] 

### Return type

[**SubResponseAccumulatingJerseyResponse**](SubResponseAccumulatingJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

