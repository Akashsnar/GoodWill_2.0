# V2Api.BalanceReplicasRequestBody

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**nodes** | **[String]** | The set of nodes across which replicas will be balanced. Defaults to all live data nodes. | [optional] 
**waitForFinalState** | **Boolean** | If true, the request will complete only when all affected replicas become active. If false, the API will return the status of the single action, which may be before the new replica is online and active. | [optional] 
**async** | **String** | Request ID to track this action which will be processed asynchronously. | [optional] 


