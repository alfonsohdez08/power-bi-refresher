type Dataset = {
  id: string;
  name: string;
  refreshHistory: Refresh[];
};

export type RefreshErrorDetails = {
  errorCode: string;
  description?: string;
};

export type Refresh = {
  startDateInUtc: Date;
  endDateInUtc?: Date;
  status: string;
  error?: RefreshErrorDetails;
};

export default Dataset;
