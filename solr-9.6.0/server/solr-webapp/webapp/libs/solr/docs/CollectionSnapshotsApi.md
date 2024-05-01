# V2Api.CollectionSnapshotsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createCollectionSnapshot**](CollectionSnapshotsApi.md#createCollectionSnapshot) | **POST** /collections/{collName}/snapshots/{snapshotName} | Creates a new snapshot of the specified collection.
[**deleteCollectionSnapshot**](CollectionSnapshotsApi.md#deleteCollectionSnapshot) | **DELETE** /collections/{collName}/snapshots/{snapshotName} | Delete an existing collection-snapshot by name.



## createCollectionSnapshot

> CreateCollectionSnapshotResponse createCollectionSnapshot(collName, snapshotName, createCollectionSnapshotRequestBody)

Creates a new snapshot of the specified collection.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionSnapshotsApi();
let collName = "collName_example"; // String | The name of the collection.
let snapshotName = "snapshotName_example"; // String | The name of the snapshot to be created.
let createCollectionSnapshotRequestBody = new V2Api.CreateCollectionSnapshotRequestBody(); // CreateCollectionSnapshotRequestBody | Contains user provided parameters
apiInstance.createCollectionSnapshot(collName, snapshotName, createCollectionSnapshotRequestBody, (error, data, response) => {
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
 **collName** | **String**| The name of the collection. | 
 **snapshotName** | **String**| The name of the snapshot to be created. | 
 **createCollectionSnapshotRequestBody** | [**CreateCollectionSnapshotRequestBody**](CreateCollectionSnapshotRequestBody.md)| Contains user provided parameters | 

### Return type

[**CreateCollectionSnapshotResponse**](CreateCollectionSnapshotResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteCollectionSnapshot

> DeleteCollectionSnapshotResponse deleteCollectionSnapshot(collName, snapshotName, opts)

Delete an existing collection-snapshot by name.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionSnapshotsApi();
let collName = "collName_example"; // String | The name of the collection.
let snapshotName = "snapshotName_example"; // String | The name of the snapshot to be deleted.
let opts = {
  'followAliases': false, // Boolean | A flag that treats the collName parameter as a collection alias.
  'async': "async_example" // String | 
};
apiInstance.deleteCollectionSnapshot(collName, snapshotName, opts, (error, data, response) => {
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
 **collName** | **String**| The name of the collection. | 
 **snapshotName** | **String**| The name of the snapshot to be deleted. | 
 **followAliases** | **Boolean**| A flag that treats the collName parameter as a collection alias. | [optional] [default to false]
 **async** | **String**|  | [optional] 

### Return type

[**DeleteCollectionSnapshotResponse**](DeleteCollectionSnapshotResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

