import React from "react";

import _ from "lodash";

import Select, { Option } from "../Select";
import ClientSelect from "./ClientSelect";
import DatasetSelect from "./DatasetSelect";

import {
  PowerBiRefreshStatusMap,
  PowerBiRefreshStatus,
} from "../DatasetRefreshStatusBadge";
import ClientDataset from "../../api/models/ClientDataset";

type DashboardFiltersProps = {
  clientsDatasets: ClientDataset[];
  refreshStatuses: string[];
  selectedClients: string[];
  selectedDatasets: ClientDataset[];
  onChangeSelectedClients: (newSelectedClients: string[]) => void;
  onChangeSelectedDatasets: (newSelectedDatasets: ClientDataset[]) => void;
  onSelectRefreshStatus: (newStatus: string) => void;
};

const DashboardFilters = ({
  clientsDatasets,
  refreshStatuses,
  selectedClients,
  selectedDatasets,
  onChangeSelectedClients,
  onChangeSelectedDatasets,
  onSelectRefreshStatus,
}: DashboardFiltersProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <ClientSelect
        data={clientsDatasets}
        onChangeSelectedClients={onChangeSelectedClients}
        selectedClients={selectedClients}
      />
      <DatasetSelect
        data={clientsDatasets}
        onChangeSelectedDatasets={onChangeSelectedDatasets}
        selectedDatasets={selectedDatasets}
        selectedClients={selectedClients}
      />
      <Select
        label="Refresh Status"
        onOptionSelected={onSelectRefreshStatus}
        options={[
          { label: "", value: "" } as Option,
          ...refreshStatuses.map<Option>((r) => ({
            label: PowerBiRefreshStatusMap[r as PowerBiRefreshStatus],
            value: r,
          })),
        ]}
      />
    </div>
  );
};

export default DashboardFilters;
