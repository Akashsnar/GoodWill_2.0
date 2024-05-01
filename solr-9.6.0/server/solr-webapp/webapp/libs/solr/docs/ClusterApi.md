# V2Api.ClusterApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**balanceReplicas**](ClusterApi.md#balanceReplicas) | **POST** /cluster/replicas/balance | Balance Replicas across the given set of Nodes.
[**migrateReplicas**](ClusterApi.md#migrateReplicas) | **POST** /cluster/replicas/migrate | Migrate Replicas from a given set of nodes.



## balanceReplicas

> SolrJerseyResponse balanceReplicas(opts)

Balance Replicas across the given set of Nodes.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ClusterApi();
let opts = {
  'balanceReplicasRequestBody': new V2Api.BalanceReplicasRequestBody() // BalanceReplicasRequestBody | Contains user provided parameters
};
apiInstance.balanceReplicas(opts, (error, data, response) => {
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
 **balanceReplicasRequestBody** | [**BalanceReplicasRequestBody**](BalanceReplicasRequestBody.md)| Contains user provided parameters | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## migrateReplicas

> SolrJerseyResponse migrateReplicas(migrateReplicasRequestBody)

Migrate Replicas from a given set of nodes.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ClusterApi();
let migrateReplicasRequestBody = new V2Api.MigrateReplicasRequestBody(); // MigrateReplicasRequestBody | Contains user provided parameters
apiInstance.migrateReplicas(migrateReplicasRequestBody, (error, data, response) => {
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
 **migrateReplicasRequestBody** | [**MigrateReplicasRequestBody**](MigrateReplicasRequestBody.md)| Contains user provided parameters | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

