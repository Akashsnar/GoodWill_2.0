# V2Api.NodeApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteNode**](NodeApi.md#deleteNode) | **POST** /cluster/nodes/{nodeName}/clear | Delete all replicas off of the specified SolrCloud node
[**getCommandStatus**](NodeApi.md#getCommandStatus) | **GET** /node/commands/{requestId} | Request the status of an already submitted asynchronous CoreAdmin API call.
[**getPublicKey**](NodeApi.md#getPublicKey) | **GET** /node/key | Retrieve the public key of the receiving Solr node.
[**replaceNode**](NodeApi.md#replaceNode) | **POST** /cluster/nodes/{sourceNodeName}/replace | &#39;Replace&#39; a specified node by moving all replicas elsewhere



## deleteNode

> SolrJerseyResponse deleteNode(nodeName, deleteNodeRequestBody)

Delete all replicas off of the specified SolrCloud node

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.NodeApi();
let nodeName = "nodeName_example"; // String | The name of the node to be cleared.  Usually of the form 'host:1234_solr'.
let deleteNodeRequestBody = new V2Api.DeleteNodeRequestBody(); // DeleteNodeRequestBody | Contains user provided parameters
apiInstance.deleteNode(nodeName, deleteNodeRequestBody, (error, data, response) => {
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
 **nodeName** | **String**| The name of the node to be cleared.  Usually of the form &#39;host:1234_solr&#39;. | 
 **deleteNodeRequestBody** | [**DeleteNodeRequestBody**](DeleteNodeRequestBody.md)| Contains user provided parameters | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCommandStatus

> GetNodeCommandStatusResponse getCommandStatus(requestId)

Request the status of an already submitted asynchronous CoreAdmin API call.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.NodeApi();
let requestId = "requestId_example"; // String | The user defined request-id for the asynchronous request.
apiInstance.getCommandStatus(requestId, (error, data, response) => {
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
 **requestId** | **String**| The user defined request-id for the asynchronous request. | 

### Return type

[**GetNodeCommandStatusResponse**](GetNodeCommandStatusResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPublicKey

> PublicKeyResponse getPublicKey()

Retrieve the public key of the receiving Solr node.

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.NodeApi();
apiInstance.getPublicKey((error, data, response) => {
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

[**PublicKeyResponse**](PublicKeyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## replaceNode

> SolrJerseyResponse replaceNode(sourceNodeName, replaceNodeRequestBody)

&#39;Replace&#39; a specified node by moving all replicas elsewhere

### Example

```javascript
import V2Api from 'v2_api';

let apiInstance = new V2Api.NodeApi();
let sourceNodeName = "sourceNodeName_example"; // String | The name of the node to be replaced.
let replaceNodeRequestBody = new V2Api.ReplaceNodeRequestBody(); // ReplaceNodeRequestBody | Contains user provided parameters
apiInstance.replaceNode(sourceNodeName, replaceNodeRequestBody, (error, data, response) => {
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
 **sourceNodeName** | **String**| The name of the node to be replaced. | 
 **replaceNodeRequestBody** | [**ReplaceNodeRequestBody**](ReplaceNodeRequestBody.md)| Contains user provided parameters | 

### Return type

[**SolrJerseyResponse**](SolrJerseyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

