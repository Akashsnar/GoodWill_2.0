# V2Api.ConfigsetsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**listConfigSet**](ConfigsetsApi.md#listConfigSet) | **GET** /cluster/configs | List the configsets available to Solr.



## listConfigSet

> ListConfigsetsResponse listConfigSet()

List the configsets available to Solr.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.ConfigsetsApi();
apiInstance.listConfigSet((error, data, response) => {
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

[**ListConfigsetsResponse**](ListConfigsetsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

