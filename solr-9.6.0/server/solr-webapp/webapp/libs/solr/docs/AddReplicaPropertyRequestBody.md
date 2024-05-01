# V2Api.AddReplicaPropertyRequestBody

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**value** | **String** | The value to assign to the property. | 
**shardUnique** | **Boolean** | If &#x60;true&#x60;, then setting this property in one replica will remove the property from all other replicas in that shard. The default is &#x60;false&#x60;.\\nThere is one pre-defined property &#x60;preferredLeader&#x60; for which &#x60;shardUnique&#x60; is forced to &#x60;true&#x60; and an error returned if &#x60;shardUnique&#x60; is explicitly set to &#x60;false&#x60;. | [optional] [default to false]


