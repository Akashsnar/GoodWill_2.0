# V2Api.ReplaceNodeRequestBody

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**targetNodeName** | **String** | The target node where replicas will be copied. If this parameter is not provided, Solr will identify nodes automatically based on policies or number of cores in each node. | [optional] 
**waitForFinalState** | **Boolean** | If true, the request will complete only when all affected replicas become active. If false, the API will return the status of the single action, which may be before the new replica is online and active. | [optional] 
**async** | **String** | Request ID to track this action which will be processed asynchronously. | [optional] 


