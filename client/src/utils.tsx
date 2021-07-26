const parseClientDatasetId = (clientId: string, datasetId: string): string =>
  `${clientId}_${datasetId}`;

export { parseClientDatasetId };
