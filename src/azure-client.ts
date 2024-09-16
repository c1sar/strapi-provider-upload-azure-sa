// src/azureClient.ts

import {
    BlobServiceClient,
    AnonymousCredential,
    StorageSharedKeyCredential,
    newPipeline,
  } from '@azure/storage-blob';
  import { Config } from './types';
  import { trimParam, getServiceBaseUrl } from './utils';
  
  export function makeBlobServiceClient(config: Config): BlobServiceClient {
    const serviceBaseURL = getServiceBaseUrl(config);
    const account = trimParam(config.account);
    const accountKey = trimParam(config.accountKey);
    const sasToken = trimParam(config.sasToken);
  
    if (sasToken) {
      const anonymousCredential = new AnonymousCredential();
      return new BlobServiceClient(`${serviceBaseURL}${sasToken}`, anonymousCredential);
    }
  
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey || '');
    const pipeline = newPipeline(sharedKeyCredential);
    return new BlobServiceClient(serviceBaseURL, pipeline);
  }
  
