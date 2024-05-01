# V2Api.CoreBackupsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createBackup**](CoreBackupsApi.md#createBackup) | **POST** /cores/{coreName}/backups | Creates a core-level backup



## createBackup

> SolrJerseyResponse createBackup(coreName, opts)

Creates a core-level backup

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoreBackupsApi();
let coreName = "coreName_example"; // String | The name of the core.
let opts = {
  'createCoreBackupRequestBody': new V2Api.CreateCoreBackupRequestBody() // CreateCoreBackupRequestBody | 
};
apiInstance.createBackup(coreName, opts, (error, data, response) => {
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
 **coreName** | **String**| The name of the core. | 
 **createCoreBackupRequestBody** | [**CreateCoreBackupRequestBody**](CreateCoreBackupRequestBody.md)|  | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

