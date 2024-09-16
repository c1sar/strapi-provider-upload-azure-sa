// src/upload.ts

import { Config, File } from './types';
import { BlobServiceClient } from '@azure/storage-blob';
import { getServiceBaseUrl, getFileName, trimParam } from './utils';

const uploadOptions = {
  bufferSize: 4 * 1024 * 1024,
  maxBuffers: 20,
};

export async function handleUpload(
  config: Config,
  blobSvcClient: BlobServiceClient,
  file: File
): Promise<void> {
  const serviceBaseURL = getServiceBaseUrl(config);
  const containerClient = blobSvcClient.getContainerClient(trimParam(config.containerName));
  const client = containerClient.getBlockBlobClient(getFileName(config.defaultPath, file));
  const options = {
    blobHTTPHeaders: {
      blobContentType: file.mime,
      blobCacheControl: trimParam(config.defaultCacheControl),
    },
  };
  const cdnBaseURL = trimParam(config.cdnBaseURL);
  file.url = cdnBaseURL
    ? client.url.replace(serviceBaseURL, cdnBaseURL)
    : client.url;

  if (
    file.url.includes(`/${config.containerName}/`) &&
    config.removeCN &&
    config.removeCN === 'true'
  ) {
    file.url = file.url.replace(`/${config.containerName}/`, '/');
  }

  if (file.buffer) {
    await client.uploadData(file.buffer, options);
  } else if (file.path) {
    await client.uploadFile(file.path, options);
  } else if (file.stream) {
    await client.uploadStream(
      file.stream,
      uploadOptions.bufferSize,
      uploadOptions.maxBuffers,
      options
    );

    // Close the stream to release the file handle
    if (typeof file.stream.destroy === 'function') {
      file.stream.destroy();
    }
  } else {
    throw new Error('File data is not available for upload.');
  }
}
