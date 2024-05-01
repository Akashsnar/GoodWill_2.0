# V2Api.CoreSnapshotsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createSnapshot**](CoreSnapshotsApi.md#createSnapshot) | **POST** /cores/{coreName}/snapshots/{snapshotName} | Create a new snapshot of the specified core.
[**deleteSnapshot**](CoreSnapshotsApi.md#deleteSnapshot) | **DELETE** /cores/{coreName}/snapshots/{snapshotName} | Delete a single snapshot from the specified core.
[**listSnapshots**](CoreSnapshotsApi.md#listSnapshots) | **GET** /cores/{coreName}/snapshots | List existing snapshots for the specified core.



## createSnapshot

> CreateCoreSnapshotResponse createSnapshot(coreName, snapshotName, opts)

Create a new snapshot of the specified core.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoreSnapshotsApi();
let coreName = "coreName_example"; // String | The name of the core to snapshot.
let snapshotName = "snapshotName_example"; // String | The name to associate with the core snapshot.
let opts = {
  'async': "async_example" // String | The id to associate with the async task.
};
apiInstance.createSnapshot(coreName, snapshotName, opts, (error, data, response) => {
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
 **coreName** | **String**| The name of the core to snapshot. | 
 **snapshotName** | **String**| The name to associate with the core snapshot. | 
 **async** | **String**| The id to associate with the async task. | [optional] 

### Return type

[**CreateCoreSnapshotResponse**](CreateCoreSnapshotResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteSnapshot

> DeleteSnapshotResponse deleteSnapshot(coreName, snapshotName, opts)

Delete a single snapshot from the specified core.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoreSnapshotsApi();
let coreName = "coreName_example"; // String | The name of the core for which to delete a snapshot.
let snapshotName = "snapshotName_example"; // String | The name of the core snapshot to delete.
let opts = {
  'async': "async_example" // String | The id to associate with the async task.
};
apiInstance.deleteSnapshot(coreName, snapshotName, opts, (error, data, response) => {
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
 **coreName** | **String**| The name of the core for which to delete a snapshot. | 
 **snapshotName** | **String**| The name of the core snapshot to delete. | 
 **async** | **String**| The id to associate with the async task. | [optional] 

### Return type

[**DeleteSnapshotResponse**](DeleteSnapshotResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listSnapshots

> ListCoreSnapshotsResponse listSnapshots(coreName)

List existing snapshots for the specified core.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoreSnapshotsApi();
let coreName = "coreName_example"; // String | The name of the core for which to retrieve snapshots.
apiInstance.listSnapshots(coreName, (error, data, response) => {
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
 **coreName** | **String**| The name of the core for which to retrieve snapshots. | 

### Return type

[**ListCoreSnapshotsResponse**](ListCoreSnapshotsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

