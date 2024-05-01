# V2Api.MigrateReplicasRequestBody

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sourceNodes** | **[String]** | The set of nodes which all replicas will be migrated off of. | 
**targetNodes** | **[String]** | A set of nodes to migrate the replicas to. If this is not provided, then the API will use the live data nodes not in &#39;sourceNodes&#39;. | [optional] 
**waitForFinalState** | **Boolean** | If true, the request will complete only when all affected replicas become active. If false, the API will return the status of the single action, which may be before the new replicas are online and active. | [optional] 
**async** | **String** | Request ID to track this action which will be processed asynchronously. | [optional] 


