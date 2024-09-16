import { Config, File } from './types';

export function trimParam(input: any): string {
  return typeof input === 'string' ? input.trim() : '';
}

export function getServiceBaseUrl(config: Config): string {
  return (
    trimParam(config.serviceBaseURL) ||
    `https://${trimParam(config.account)}.blob.core.windows.net`
  );
}

export function getFileName(defaultPath: string, file: File): string {
  return `${trimParam(defaultPath)}/${file.hash}${file.ext}`;
}
