import React from "react";
import ClientDataset from "./api/models/ClientDataset";

import { parseClientDatasetId } from "./utils";

export interface BulkRefresh {
  isClientDatasetSelected: (clientDataset: ClientDataset) => boolean;
  addClientDataset: (data: ClientDataset[]) => void;
  removeClientDataset: (data: ClientDataset[]) => void;
  getClientDatasetCount: () => number;
  getClientsDatasets: () => ClientDataset[];
  clearClientsDatasets: () => void;
  bulkRefreshEnabled: boolean;
  toggleBulkRefresh: () => void;
  resetBulkRefresh: () => void;
}

export const BulkRefreshContext = React.createContext<BulkRefresh | null>(null);

BulkRefreshContext.displayName = "DatasetBulkRefreshContext";

export default function BulkRefreshProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [isBulkRefreshEnabled, setIsBulkRefreshEnabled] = React.useState(false);
  const [clientsDatasets, setClientsDatasets] = React.useState<
    Map<string, ClientDataset>
  >(new Map<string, ClientDataset>());

  const addOrDeleteClientDataset = (data: ClientDataset[], add: boolean) => {
    const tempMap = new Map<string, ClientDataset>();
    for (let d of data) {
      tempMap.set(parseClientDatasetId(d.clientId, d.datasetId), d);
    }

    if (add) {
      tempMap.forEach((cd, key) => {
        clientsDatasets.set(key, cd);
      });
    } else {
      tempMap.forEach((cd, key) => {
        clientsDatasets.delete(key);
      });
    }

    setClientsDatasets(new Map<string, ClientDataset>(clientsDatasets));
  };

  const isClientDatasetSelected = (clientDataset: ClientDataset) => {
    const clientDatasetId: string = parseClientDatasetId(
      clientDataset.clientId,
      clientDataset.datasetId
    );

    return clientsDatasets.has(clientDatasetId);
  };

  const clearClientsDatasets = () => {
    clientsDatasets.clear();

    setClientsDatasets(new Map<string, ClientDataset>(clientsDatasets));
  };

  const resetBulkRefresh = () => {
    clearClientsDatasets();
    setIsBulkRefreshEnabled(false);
  };

  return (
    <BulkRefreshContext.Provider
      value={{
        addClientDataset: (data: ClientDataset[]) =>
          addOrDeleteClientDataset(data, true),
        bulkRefreshEnabled: isBulkRefreshEnabled,
        isClientDatasetSelected: isClientDatasetSelected,
        removeClientDataset: (data: ClientDataset[]) =>
          addOrDeleteClientDataset(data, false),
        getClientDatasetCount: () => clientsDatasets.size,
        getClientsDatasets: () => Array.from(clientsDatasets.values()),
        clearClientsDatasets: clearClientsDatasets,
        toggleBulkRefresh: () =>
          setIsBulkRefreshEnabled((previousValue) => !previousValue),
        resetBulkRefresh: resetBulkRefresh,
      }}
    >
      {children}
    </BulkRefreshContext.Provider>
  );
}
