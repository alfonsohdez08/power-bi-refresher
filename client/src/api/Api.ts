import Client from "./models/Client";
import Dataset from "./models/Dataset";

import Env from "../Env";

const apiBaseUrl: string = `${Env.ApiBaseUrl}/api`;

const getClients = async (): Promise<Client[]> => {
  const response = await fetch(apiBaseUrl + "/clients");
  const clients: Client[] = await response.json();

  return clients;
};

const refreshDatasets = async (
  datasets: {
    clientId: string;
    datasetId: string;
  }[]
): Promise<void> => {
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");

  const requestInit: RequestInit = {
    method: "POST",
    body: JSON.stringify(datasets),
    headers: requestHeaders,
  };

  const response = await fetch(apiBaseUrl + "/dataset-refreshes", requestInit);
  if (!response.ok) {
    const errorMessage = await response.json();
    throw Error(JSON.stringify(errorMessage));
  }
};

const getRefreshStatuses = async (): Promise<string[]> => {
  const response = await fetch(apiBaseUrl + "/refresh-statuses");
  const statuses: string[] = await response.json();

  return statuses;
};

const API = {
  getClients,
  refreshDatasets,
  getRefreshStatuses,
};

export default API;
