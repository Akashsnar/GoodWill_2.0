# V2Api.ReplicaPropertiesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addReplicaProperty**](ReplicaPropertiesApi.md#addReplicaProperty) | **PUT** /collections/{collName}/shards/{shardName}/replicas/{replicaName}/properties/{propName} | Adds a property to the specified replica
[**deleteReplicaProperty**](ReplicaPropertiesApi.md#deleteReplicaProperty) | **DELETE** /collections/{collName}/shards/{shardName}/replicas/{replicaName}/properties/{propName} | Delete an existing replica property



## addReplicaProperty

> SolrJerseyResponse addReplicaProperty(collName, shardName, replicaName, propName, addReplicaPropertyRequestBody)

Adds a property to the specified replica

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ReplicaPropertiesApi();
let collName = "collName_example"; // String | The name of the collection the replica belongs to.
let shardName = "shardName_example"; // String | The name of the shard the replica belongs to.
let replicaName = "replicaName_example"; // String | The replica, e.g., `core_node1`.
let propName = "propName_example"; // String | The name of the property to add.
let addReplicaPropertyRequestBody = new V2Api.AddReplicaPropertyRequestBody(); // AddReplicaPropertyRequestBody | The value of the replica property to create or update
apiInstance.addReplicaProperty(collName, shardName, replicaName, propName, addReplicaPropertyRequestBody, (error, data, response) => {
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
 **collName** | **String**| The name of the collection the replica belongs to. | 
 **shardName** | **String**| The name of the shard the replica belongs to. | 
 **replicaName** | **String**| The replica, e.g., &#x60;core_node1&#x60;. | 
 **propName** | **String**| The name of the property to add. | 
 **addReplicaPropertyRequestBody** | [**AddReplicaPropertyRequestBody**](AddReplicaPropertyRequestBody.md)| The value of the replica property to create or update | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteReplicaProperty

> SolrJerseyResponse deleteReplicaProperty(collName, shardName, replicaName, propName)

Delete an existing replica property

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ReplicaPropertiesApi();
let collName = "collName_example"; // String | The name of the collection the replica belongs to.
let shardName = "shardName_example"; // String | The name of the shard the replica belongs to.
let replicaName = "replicaName_example"; // String | The replica, e.g., `core_node1`.
let propName = "propName_example"; // String | The name of the property to delete.
apiInstance.deleteReplicaProperty(collName, shardName, replicaName, propName, (error, data, response) => {
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
 **collName** | **String**| The name of the collection the replica belongs to. | 
 **shardName** | **String**| The name of the shard the replica belongs to. | 
 **replicaName** | **String**| The replica, e.g., &#x60;core_node1&#x60;. | 
 **propName** | **String**| The name of the property to delete. | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

