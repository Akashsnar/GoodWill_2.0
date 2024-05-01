# V2Api.CreateCoreBackupRequestBody

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**repository** | **String** | The name of the repository to be used for backup. | [optional] 
**location** | **String** | The path where the backup will be created | [optional] 
**shardBackupId** | **String** |  | [optional] 
**prevShardBackupId** | **String** |  | [optional] 
**commitName** | **String** | The name of the commit which was used while taking a snapshot using the CREATESNAPSHOT command. | [optional] 
**incremental** | **Boolean** | To turn on incremental backup feature | [optional] 
**async** | **String** | Request ID to track this action which will be processed asynchronously. | [optional] 
**backupName** | **String** | A descriptive name for the backup.  Only used by non-incremental backups. | [optional] 


