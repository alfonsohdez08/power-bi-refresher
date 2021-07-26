import React from "react";

import { SecondaryButton } from "./buttons";

import { BulkRefreshContext } from "../BulkRefreshContext";

export default function ClearBulkRefreshButton() {
  const bulkRefreshContext = React.useContext(BulkRefreshContext);

  return (
    <SecondaryButton
      placeholder="Clear Selection"
      onClick={() => bulkRefreshContext?.clearClientsDatasets()}
    />
  );
}
