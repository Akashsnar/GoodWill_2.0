# V2Api.CollectionBackupsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createCollectionBackup**](CollectionBackupsApi.md#createCollectionBackup) | **POST** /collections/{collectionName}/backups/{backupName}/versions | Creates a new backup point for a collection
[**deleteMultipleBackupsByRecency**](CollectionBackupsApi.md#deleteMultipleBackupsByRecency) | **DELETE** /backups/{backupName}/versions | Delete all incremental backup points older than the most recent N
[**deleteSingleBackupById**](CollectionBackupsApi.md#deleteSingleBackupById) | **DELETE** /backups/{backupName}/versions/{backupId} | Delete incremental backup point by ID
[**garbageCollectUnusedBackupFiles**](CollectionBackupsApi.md#garbageCollectUnusedBackupFiles) | **PUT** /backups/{backupName}/purgeUnused | Garbage collect orphaned incremental backup files
[**listBackupsAtLocation**](CollectionBackupsApi.md#listBackupsAtLocation) | **GET** /backups/{backupName}/versions | List existing incremental backups at the specified location.



## createCollectionBackup

> SolrJerseyResponse createCollectionBackup(collectionName, backupName, opts)

Creates a new backup point for a collection

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionBackupsApi();
let collectionName = "collectionName_example"; // String | 
let backupName = "backupName_example"; // String | 
let opts = {
  'createCollectionBackupRequestBody': new V2Api.CreateCollectionBackupRequestBody() // CreateCollectionBackupRequestBody | 
};
apiInstance.createCollectionBackup(collectionName, backupName, opts, (error, data, response) => {
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
 **backupName** | **String**|  | 
 **createCollectionBackupRequestBody** | [**CreateCollectionBackupRequestBody**](CreateCollectionBackupRequestBody.md)|  | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteMultipleBackupsByRecency

> BackupDeletionResponseBody deleteMultipleBackupsByRecency(backupName, opts)

Delete all incremental backup points older than the most recent N

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionBackupsApi();
let backupName = "backupName_example"; // String | 
let opts = {
  'retainLatest': 56, // Number | 
  'location': "location_example", // String | 
  'repository': "repository_example", // String | 
  'async': "async_example" // String | 
};
apiInstance.deleteMultipleBackupsByRecency(backupName, opts, (error, data, response) => {
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
 **backupName** | **String**|  | 
 **retainLatest** | **Number**|  | [optional] 
 **location** | **String**|  | [optional] 
 **repository** | **String**|  | [optional] 
 **async** | **String**|  | [optional] 

### Return type

[**BackupDeletionResponseBody**](BackupDeletionResponseBody.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteSingleBackupById

> BackupDeletionResponseBody deleteSingleBackupById(backupName, backupId, opts)

Delete incremental backup point by ID

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionBackupsApi();
let backupName = "backupName_example"; // String | 
let backupId = "backupId_example"; // String | 
let opts = {
  'location': "location_example", // String | 
  'repository': "repository_example", // String | 
  'async': "async_example" // String | 
};
apiInstance.deleteSingleBackupById(backupName, backupId, opts, (error, data, response) => {
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
 **backupName** | **String**|  | 
 **backupId** | **String**|  | 
 **location** | **String**|  | [optional] 
 **repository** | **String**|  | [optional] 
 **async** | **String**|  | [optional] 

### Return type

[**BackupDeletionResponseBody**](BackupDeletionResponseBody.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## garbageCollectUnusedBackupFiles

> PurgeUnusedResponse garbageCollectUnusedBackupFiles(backupName, opts)

Garbage collect orphaned incremental backup files

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionBackupsApi();
let backupName = "backupName_example"; // String | 
let opts = {
  'purgeUnusedFilesRequestBody': new V2Api.PurgeUnusedFilesRequestBody() // PurgeUnusedFilesRequestBody | Request body parameters for the orphaned file cleanup
};
apiInstance.garbageCollectUnusedBackupFiles(backupName, opts, (error, data, response) => {
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
 **backupName** | **String**|  | 
 **purgeUnusedFilesRequestBody** | [**PurgeUnusedFilesRequestBody**](PurgeUnusedFilesRequestBody.md)| Request body parameters for the orphaned file cleanup | [optional] 

### Return type

[**PurgeUnusedResponse**](PurgeUnusedResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listBackupsAtLocation

> ListCollectionBackupsResponse listBackupsAtLocation(backupName, opts)

List existing incremental backups at the specified location.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CollectionBackupsApi();
let backupName = "backupName_example"; // String | 
let opts = {
  'location': "location_example", // String | 
  'repository': "repository_example" // String | 
};
apiInstance.listBackupsAtLocation(backupName, opts, (error, data, response) => {
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
 **backupName** | **String**|  | 
 **location** | **String**|  | [optional] 
 **repository** | **String**|  | [optional] 

### Return type

[**ListCollectionBackupsResponse**](ListCollectionBackupsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

