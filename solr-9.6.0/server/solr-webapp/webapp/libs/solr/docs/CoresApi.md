# V2Api.CoresApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**installCoreData**](CoresApi.md#installCoreData) | **POST** /cores/{coreName}/install | Install an offline index to a specified core
[**mergeIndexes**](CoresApi.md#mergeIndexes) | **POST** /cores/{coreName}/merge-indices | The MERGEINDEXES action merges one or more indexes to another index.
[**reloadCore**](CoresApi.md#reloadCore) | **POST** /cores/{coreName}/reload | Reload the specified core.
[**renameCore**](CoresApi.md#renameCore) | **POST** /cores/{coreName}/rename | The RENAME action changes the name of a Solr core
[**restoreCore**](CoresApi.md#restoreCore) | **POST** /cores/{coreName}/restore | Restore a previously-taken backup to the specified core
[**swapCores**](CoresApi.md#swapCores) | **POST** /cores/{coreName}/swap | SWAP atomically swaps the names used to access two existing Solr cores.
[**unloadCore**](CoresApi.md#unloadCore) | **POST** /cores/{coreName}/unload | Unloads a single core specified by name



## installCoreData

> SolrJerseyResponse installCoreData(coreName, opts)

Install an offline index to a specified core

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoresApi();
let coreName = "coreName_example"; // String | 
let opts = {
  'installCoreDataRequestBody': new V2Api.InstallCoreDataRequestBody() // InstallCoreDataRequestBody | 
};
apiInstance.installCoreData(coreName, opts, (error, data, response) => {
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
 **coreName** | **String**|  | 
 **installCoreDataRequestBody** | [**InstallCoreDataRequestBody**](InstallCoreDataRequestBody.md)|  | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## mergeIndexes

> SolrJerseyResponse mergeIndexes(coreName, opts)

The MERGEINDEXES action merges one or more indexes to another index.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoresApi();
let coreName = "coreName_example"; // String | The core that the specified indices are merged into.
let opts = {
  'mergeIndexesRequestBody': new V2Api.MergeIndexesRequestBody() // MergeIndexesRequestBody | Additional properties for merge indexes.
};
apiInstance.mergeIndexes(coreName, opts, (error, data, response) => {
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
 **coreName** | **String**| The core that the specified indices are merged into. | 
 **mergeIndexesRequestBody** | [**MergeIndexesRequestBody**](MergeIndexesRequestBody.md)| Additional properties for merge indexes. | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## reloadCore

> SolrJerseyResponse reloadCore(coreName)

Reload the specified core.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoresApi();
let coreName = "coreName_example"; // String | The name of the core to reload.
apiInstance.reloadCore(coreName, (error, data, response) => {
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
 **coreName** | **String**| The name of the core to reload. | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## renameCore

> SolrJerseyResponse renameCore(coreName, opts)

The RENAME action changes the name of a Solr core

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoresApi();
let coreName = "coreName_example"; // String | 
let opts = {
  'renameCoreRequestBody': new V2Api.RenameCoreRequestBody() // RenameCoreRequestBody | Additional properties related to the core renaming
};
apiInstance.renameCore(coreName, opts, (error, data, response) => {
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
 **coreName** | **String**|  | 
 **renameCoreRequestBody** | [**RenameCoreRequestBody**](RenameCoreRequestBody.md)| Additional properties related to the core renaming | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## restoreCore

> SolrJerseyResponse restoreCore(coreName, opts)

Restore a previously-taken backup to the specified core

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoresApi();
let coreName = "coreName_example"; // String | The name of the core to be restored
let opts = {
  'restoreCoreRequestBody': new V2Api.RestoreCoreRequestBody() // RestoreCoreRequestBody | 
};
apiInstance.restoreCore(coreName, opts, (error, data, response) => {
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
 **coreName** | **String**| The name of the core to be restored | 
 **restoreCoreRequestBody** | [**RestoreCoreRequestBody**](RestoreCoreRequestBody.md)|  | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## swapCores

> SolrJerseyResponse swapCores(coreName, opts)

SWAP atomically swaps the names used to access two existing Solr cores.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoresApi();
let coreName = "coreName_example"; // String | 
let opts = {
  'swapCoresRequestBody': new V2Api.SwapCoresRequestBody() // SwapCoresRequestBody | Additional properties related to core swapping.
};
apiInstance.swapCores(coreName, opts, (error, data, response) => {
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
 **coreName** | **String**|  | 
 **swapCoresRequestBody** | [**SwapCoresRequestBody**](SwapCoresRequestBody.md)| Additional properties related to core swapping. | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## unloadCore

> SolrJerseyResponse unloadCore(coreName, opts)

Unloads a single core specified by name

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.CoresApi();
let coreName = "coreName_example"; // String | 
let opts = {
  'unloadCoreRequestBody': new V2Api.UnloadCoreRequestBody() // UnloadCoreRequestBody | Additional properties related to the core unloading
};
apiInstance.unloadCore(coreName, opts, (error, data, response) => {
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
 **coreName** | **String**|  | 
 **unloadCoreRequestBody** | [**UnloadCoreRequestBody**](UnloadCoreRequestBody.md)| Additional properties related to the core unloading | [optional] 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

