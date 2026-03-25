import { Config, File } from "./types";

export function trimParam(input: any): string {
  return typeof input === "string" ? input.trim() : "";
}

export function getServiceBaseUrl(config: Config): string {
  return (
    trimParam(config.serviceBaseURL) ||
    `https://${trimParam(config.account)}.blob.core.windows.net`
  );
}

export function getFileName(defaultPath: string, file: File): string {
  const trimmedPath = trimParam(defaultPath);
  return trimmedPath && trimmedPath !== "/"
    ? `${trimmedPath}/${file.hash}${file.ext}`
    : `${file.hash}${file.ext}`;
}
