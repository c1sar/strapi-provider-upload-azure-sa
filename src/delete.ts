import { Config, File } from './types';
import { BlobServiceClient } from '@azure/storage-blob';
import { getFileName, trimParam } from './utils';
import * as fs from 'fs';

export async function handleDelete(
  config: Config,
  blobSvcClient: BlobServiceClient,
  file: File
): Promise<void> {
  const containerClient = blobSvcClient.getContainerClient(trimParam(config.containerName));
  const client = containerClient.getBlobClient(getFileName(config.defaultPath, file));

  await client.delete();

  const tmpFilePath = file.tmpPath || file.path;
  if (tmpFilePath) {
    try {
      fs.unlinkSync(tmpFilePath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  file.url = undefined;
}
