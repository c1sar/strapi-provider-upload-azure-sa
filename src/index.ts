import { Config, File } from "./types";
import { makeBlobServiceClient } from "./azure-client";
import { handleUpload } from "./upload";
import { handleDelete } from "./delete";

module.exports = {
  provider: "azure",
  auth: {
    clientId: {
      label:
        'Azure Identity ClientId (consumed if authType is "msi" and passed as DefaultAzureCredential({ managedIdentityClientId: clientId }))',
      type: "text",
    },
    account: {
      label: "Account name (required)",
      type: "text",
    },
    accountKey: {
      label: 'Secret access key (required if authType is "default")',
      type: "text",
    },
    serviceBaseURL: {
      label:
        "Base service URL to be used, optional. Defaults to https://${account}.blob.core.windows.net (optional)",
      type: "text",
    },
    containerName: {
      label: "Container name (required)",
      type: "text",
    },
    createContainerIfNotExist: {
      label: "Create container on upload if it does not (optional)",
      type: "text",
    },
    publicAccessType: {
      label:
        'If createContainerIfNotExist is true, set the public access type to one of "blob" or "container" (optional)',
      type: "text",
    },
    cdnBaseURL: {
      label: "CDN base url (optional)",
      type: "text",
    },
    defaultCacheControl: {
      label: "Default cache-control setting for all uploaded files",
      type: "text",
    },
    removeCN: {
      label: "Remove container name from URL (optional)",
      type: "text",
    },
  },
  init: (config: Config) => {
    const blobSvcClient = makeBlobServiceClient(config);
    return {
      upload(file: File) {
        return handleUpload(config, blobSvcClient, file);
      },
      uploadStream(file: File) {
        return handleUpload(config, blobSvcClient, file);
      },
      delete(file: File) {
        return handleDelete(config, blobSvcClient, file);
      },
    };
  },
};
