const core = require('@actions/core');
const github = require('@actions/github');
import Lambda from 'aws-sdk/clients/lambda';

const run = async () => {
	try {
		// Extract name
		const lambda_layer_name = core.getInput('layer_name', { required: true });
		const versions_to_keep = core.getInput('version_keep_count', { required: true });
		const lambda_config = {
			accessKeyId: core.getInput('aws_access_key_id', { required: true }),
			apiVersion: '2015-03-31',
			maxRetries: 2,
			region: core.getInput('aws_region', { required: true }),
			secretAccessKey: core.getInput('aws_secret_access_key', { required: true }),
			sslEnabled: true
		};

		// Create lambda API client
		const lambda = new Lambda(lambda_config);

		core.info("Requesting lambda versions");
		const lambda_versions_request = await lambda.listLayerVersions({
			LayerName: lambda_layer_name
		}).promise();

		const sorted_versions = lambda_versions_request
			.LayerVersions.sort((a, b) => a.Version - b.Version);
		const versions_to_delete = sorted_versions.length - versions_to_keep;

		core.info("Deleting "
			+ (versions_to_delete < 0 ? 0 : versions_to_delete)
			+ " old versions");
		for (let i = 0; i < versions_to_delete; ++i) {
			await lambda.deleteLayerVersion({
				LayerName: lambda_layer_name,
				VersionNumber: sorted_versions[i].Version
			}).promise();
			core.info("Deleted version (" + (i + 1) + "/" + versions_to_delete + ")");
		}

		core.info("Layer version deletions success");
	} catch (error) {
		core.setFailed(error.message);
	}
};

run();
