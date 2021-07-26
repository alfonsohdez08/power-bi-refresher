import React from "react";

import { AnchorButton, SecondaryButton } from "./buttons";
import ClearBulkRefreshButton from "./ClearBulkRefreshButton";

import { BulkRefreshContext } from "../BulkRefreshContext";

export default function BulkRefreshButtonsContainer() {
  const context = React.useContext(BulkRefreshContext);

  const buttons: JSX.Element[] = [];
  buttons.push(
    <SecondaryButton
      key={buttons.length}
      placeholder={
        context?.bulkRefreshEnabled
          ? "Disable Bulk Refresh"
          : "Enable Bulk Refresh"
      }
      onClick={() => context?.toggleBulkRefresh()}
    />
  );

  if (context?.bulkRefreshEnabled && context.getClientDatasetCount() > 0) {
    buttons.push(
      <AnchorButton
        key={buttons.length}
        to="confirm-bulk-refresh"
        placeholder="Review Datasets Selected"
      />
    );

    buttons.push(<ClearBulkRefreshButton key={buttons.length} />);
  }

  return <div className="flex space-x-3">{buttons}</div>;
}
