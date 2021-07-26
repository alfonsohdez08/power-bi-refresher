import React from "react";

import _ from "lodash";

import ClientDatasetTable from "../ClientDatasetTable";
import BulkRefreshButtonsContainer from "../BulkRefreshButtonsContainer";
import DashboardFilters from "./DashboardFilters";

import Client from "../../api/models/Client";
import ClientDataset, { flatClients } from "../../api/models/ClientDataset";
import { parseClientDatasetId } from "../../utils";

type ClientDatasetDashboardProps = {
  clients: Client[];
  refreshStatuses: string[];
};

const ClientDatasetDashboard = ({
  clients,
  refreshStatuses,
}: ClientDatasetDashboardProps) => {
  const [selectedClients, setSelectedClients] = React.useState<string[]>([]);
  const [selectedDatasets, setSelectedDatasets] = React.useState<
    ClientDataset[]
  >([]);
  const [refreshStatus, setRefreshStatus] = React.useState<string>("");

  React.useEffect(() => {
    const removeSelectedDatasetsForUnselectedClients = () => {
      const deleteClientDatasetIdSet = new Set<string>();

      const selectedClientSet = new Set<string>(selectedClients);
      for (let d of selectedDatasets) {
        if (!selectedClientSet.has(d.clientId)) {
          deleteClientDatasetIdSet.add(
            parseClientDatasetId(d.clientId, d.datasetId)
          );
        }
      }

      if (deleteClientDatasetIdSet.size > 0) {
        setSelectedDatasets(
          selectedDatasets.filter(
            (d) =>
              !deleteClientDatasetIdSet.has(
                parseClientDatasetId(d.clientId, d.datasetId)
              )
          )
        );
      }
    };

    removeSelectedDatasetsForUnselectedClients();
  }, [selectedClients]);

  React.useEffect(() => {
    const addClientIfFirstDatasetSelected = () => {
      const newClientIds: string[] = [];
      const selectedClientSet = new Set<string>(selectedClients);

      for (let d of selectedDatasets) {
        if (!selectedClientSet.has(d.clientId)) {
          newClientIds.push(d.clientId);
        }
      }

      if (newClientIds.length > 0) {
        setSelectedClients([...newClientIds, ...selectedClients]);
      }
    };

    addClientIfFirstDatasetSelected();
  }, [selectedDatasets]);

  const clientsDatasets: ClientDataset[] = flatClients(clients);

  const getDatasetSet = (): Set<string> => {
    const set = new Set<string>();

    for (let dataset of selectedDatasets) {
      set.add(parseClientDatasetId(dataset.clientId, dataset.datasetId));
    }

    return set;
  };

  const getClientsDatasets = (): ClientDataset[] => {
    let query = _(clientsDatasets);

    if (selectedClients.length > 0) {
      const clientSet = new Set<string>(selectedClients);

      query = query.filter((c) => clientSet.has(c.clientId));
    }

    if (selectedDatasets.length > 0) {
      const datasetSet: Set<string> = getDatasetSet();

      query = query.filter((c) =>
        datasetSet.has(parseClientDatasetId(c.clientId, c.datasetId))
      );
    }

    if (refreshStatus !== "") {
      query = query.filter((c) => c.refreshStatus === refreshStatus);
    }

    return query.value();
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="w-3/5">
          <DashboardFilters
            clientsDatasets={clientsDatasets}
            refreshStatuses={refreshStatuses}
            selectedDatasets={selectedDatasets}
            selectedClients={selectedClients}
            onChangeSelectedClients={setSelectedClients}
            onChangeSelectedDatasets={setSelectedDatasets}
            onSelectRefreshStatus={setRefreshStatus}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div>
          <ClientDatasetTable readonly={false} data={getClientsDatasets()} />
        </div>
      </div>
    </>
  );
};

export default ClientDatasetDashboard;
