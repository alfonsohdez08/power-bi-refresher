import React from "react";
import Select from "react-select";

import Label from "../Label";

import ClientDataset from "../../api/models/ClientDataset";

const DatasetSelect = ({
  data,
  selectedDatasets,
  selectedClients,
  onChangeSelectedDatasets,
}: {
  data: ClientDataset[];
  selectedDatasets: ClientDataset[];
  selectedClients: string[];
  onChangeSelectedDatasets: (options: ClientDataset[]) => void;
}) => {
  const selectedClientSet = new Set<string>(selectedClients);

  return (
    <div>
      <div className="mb-2">
        <Label placeholder="Datasets" htmlFor="datasets" />
      </div>
      <Select
        options={
          selectedClientSet.size > 0
            ? data.filter((d) => selectedClientSet.has(d.clientId))
            : data
        }
        name="datasets"
        isMulti
        value={selectedDatasets}
        getOptionLabel={(c) => `[${c.clientName}]: ${c.datasetName}`}
        getOptionValue={(c) =>
          JSON.stringify({
            clientId: c.clientId,
            datasetId: c.datasetId,
          })
        }
        onChange={(options) => {
          onChangeSelectedDatasets(options.map((v) => v));
        }}
      />
    </div>
  );
};

export default DatasetSelect;
