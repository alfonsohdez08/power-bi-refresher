import React from "react";
import Select from "react-select";

import Label from "../Label";

import ClientDataset from "../../api/models/ClientDataset";

const ClientSelect = ({
  data,
  selectedClients,
  onChangeSelectedClients,
}: {
  data: ClientDataset[];
  selectedClients: string[];
  onChangeSelectedClients: (newSelectedClients: string[]) => void;
}) => {
  const getClients = (): { id: string; name: string }[] => {
    const map = new Map<string, { id: string; name: string }>();

    for (let client of data) {
      if (!map.has(client.clientId)) {
        map.set(client.clientId, {
          id: client.clientId,
          name: client.clientName,
        });
      }
    }

    return Array.from(map.values());
  };

  const clients = getClients();
  const selectedClientSet = new Set<string>(selectedClients);

  return (
    <div>
      <div className="mb-2">
        <Label placeholder="Clients" htmlFor="clients" />
      </div>
      <Select
        options={clients}
        name="clients"
        isMulti
        getOptionLabel={(o) => o.name}
        getOptionValue={(o) => o.id}
        value={clients.filter((c) => selectedClientSet.has(c.id))}
        onChange={(options) => {
          onChangeSelectedClients(options.map((o) => o["id"]));
        }}
      />
    </div>
  );
};

export default ClientSelect;
