import React from "react";
import _ from "lodash";

import Table, { TableColumn, TableBody } from "./table";
import DatasetRefreshStatusBadge, {
  PowerBiRefreshStatus,
} from "./DatasetRefreshStatusBadge";
import { SecondaryButton, AnchorButton } from "./buttons";
import ConfirmDatasetRefreshModal from "./ConfirmDatasetRefreshModal";
import Checkbox from "./Checkbox";

import API from "../api";
import ClientDataset from "../api/models/ClientDataset";
import { RefreshErrorDetails } from "../api/models/Dataset";
import { parseClientDatasetId } from "../utils";

import { BulkRefreshContext } from "../BulkRefreshContext";
import { RefreshError } from "./RefreshFailedPopover";

class ClientDatasetRow extends TableBody {
  clientId: string;
  clientName: string;
  datasetId: string;
  datasetName: string;
  refreshStartDateInUtc: Date;
  refreshEndDateInUtc?: Date;
  refreshStatus: string;
  refreshError?: RefreshErrorDetails;

  constructor(
    id: string,
    clientName: string,
    clientId: string,
    datasetId: string,
    datasetName: string,
    refreshStartDateInUtc: Date,
    refreshStatus: string,
    refreshEndDateInUtc?: Date,
    refreshError?: RefreshErrorDetails
  ) {
    super(id);

    this.clientName = clientName;
    this.datasetName = datasetName;
    this.refreshStartDateInUtc = refreshStartDateInUtc;
    this.refreshEndDateInUtc = refreshEndDateInUtc;
    this.refreshStatus = refreshStatus;
    this.clientId = clientId;
    this.datasetId = datasetId;
    this.refreshError = refreshError;
  }
}

const getTableRows = (data: ClientDataset[]): ClientDatasetRow[] => {
  const rows: ClientDatasetRow[] = [];

  for (let cd of data) {
    const row: ClientDatasetRow = {
      id: parseClientDatasetId(cd.clientId, cd.datasetId),
      clientId: cd.clientId,
      datasetId: cd.datasetId,
      clientName: cd.clientName,
      datasetName: cd.datasetName,
      refreshStartDateInUtc: cd.refreshStartDateInUtc,
      refreshEndDateInUtc: cd.refreshEndDateInUtc,
      refreshStatus: cd.refreshStatus,
      refreshError: cd.refreshError,
    };

    rows.push(row);
  }

  return rows;
};

const convertUtcDateTimeToEstDateTime = (date: Date): string =>
  new Date(date.toString()).toLocaleString("en-US", {
    // this is a hack
    timeZone: "America/New_York",
  });

const DatasetActionsContainer = ({
  bulkRefreshEnabled,
  onClickRefreshButton,
}: {
  bulkRefreshEnabled: boolean;
  onClickRefreshButton: () => void;
}) => {
  return (
    <div className="flex space-x-2">
      {!bulkRefreshEnabled ? (
        <SecondaryButton
          placeholder="Trigger Refresh"
          onClick={onClickRefreshButton}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

type ConfirmDatasetRefreshModal = {
  showModal: boolean;
  data: ClientDataset | null;
};

const refreshDataset = async (
  clientDataset: ClientDataset | null
): Promise<void> => {
  if (clientDataset) {
    await API.refreshDatasets([
      {
        clientId: clientDataset.clientId,
        datasetId: clientDataset.datasetId,
      },
    ]);
  }
};

export default function ClientDatasetTable({
  data,
  readonly,
}: {
  data: ClientDataset[];
  readonly: boolean;
}) {
  const bulkRefreshContext = React.useContext(BulkRefreshContext);
  const [rootRefreshCheckboxChecked, setRootRefreshCheckboxChecked] =
    React.useState(false);
  const [confirmDatasetRefreshModal, setConfirmDatasetRefreshModal] =
    React.useState<ConfirmDatasetRefreshModal>({
      showModal: false,
      data: null,
    });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [clientDatasetIdForPopover, setClientDatasetIdForPopover] =
    React.useState(""); // client data set id

  const selectedClientDatasets: ClientDataset[] =
    bulkRefreshContext?.getClientsDatasets() || [];

  React.useEffect(() => {
    const clientDatasetIds = new Set<string>(
      selectedClientDatasets.map((cd) =>
        parseClientDatasetId(cd.clientId, cd.datasetId)
      )
    );

    setRootRefreshCheckboxChecked(
      _(data).every((cd) =>
        clientDatasetIds.has(parseClientDatasetId(cd.clientId, cd.datasetId))
      )
    );
  }, [selectedClientDatasets.length, data.length]);

  const clearClientDatasetIdForPopover = () => setClientDatasetIdForPopover("");

  React.useEffect(() => {
    clearClientDatasetIdForPopover();
  }, [data]);

  let columns: TableColumn<ClientDatasetRow>[] = [
    {
      id: "Client Name",
      name: "Client",
      path: "clientName",
    },
    {
      id: "Dataset Name",
      name: "Dataset",
      path: "datasetName",
    },
    {
      id: "Dataset Refresh Start Date",
      name: "Refresh Start Date (EST)",
      map: ({ refreshStartDateInUtc }) =>
        convertUtcDateTimeToEstDateTime(refreshStartDateInUtc),
    },
    {
      id: "Dataset Refresh End Date",
      name: "Refresh End Date (EST)",
      map: ({ refreshEndDateInUtc }) =>
        refreshEndDateInUtc
          ? convertUtcDateTimeToEstDateTime(refreshEndDateInUtc)
          : "",
    },
    {
      id: "Refresh Status",
      name: "Refresh Status",
      map: ({ refreshStatus, refreshError, id }) => (
        <DatasetRefreshStatusBadge
          status={refreshStatus as PowerBiRefreshStatus}
          data={
            refreshError
              ? {
                  showPopover: clientDatasetIdForPopover === id,
                  error: {
                    code: refreshError.errorCode,
                    description: refreshError.description,
                  } as RefreshError,
                  onBadgeClicked: () => setClientDatasetIdForPopover(id),
                  onPopoverClosed: clearClientDatasetIdForPopover,
                }
              : null
          }
        />
      ),
    },
  ];

  if (!readonly) {
    columns.push({
      id: "Dataset Actions",
      name: "",
      map: ({ clientId, clientName, datasetId, datasetName }) => (
        <DatasetActionsContainer
          bulkRefreshEnabled={
            bulkRefreshContext ? bulkRefreshContext.bulkRefreshEnabled : false
          }
          onClickRefreshButton={() => {
            const clientDataset: ClientDataset = {
              clientId: clientId,
              datasetId: datasetId,
              clientName: clientName,
              datasetName: datasetName,
              refreshStatus: "",
              refreshStartDateInUtc: new Date(),
            };

            setConfirmDatasetRefreshModal({
              showModal: true,
              data: clientDataset,
            });
          }}
        />
      ),
    });
  }

  if (bulkRefreshContext?.bulkRefreshEnabled) {
    const bulkRefreshColumn: TableColumn<ClientDatasetRow> = {
      id: "Dataset Refresh Checkbox",
      name: (
        <Checkbox
          checked={rootRefreshCheckboxChecked}
          onChange={(newValue) => {
            if (newValue) {
              bulkRefreshContext.addClientDataset(data);
            } else {
              bulkRefreshContext.removeClientDataset(data);
            }
            setRootRefreshCheckboxChecked(newValue);
          }}
        />
      ),
      map: ({ clientId, clientName, datasetId, datasetName }) => {
        const clientDataset: ClientDataset = {
          clientId: clientId,
          clientName: clientName,
          datasetId: datasetId,
          datasetName: datasetName,
          refreshStartDateInUtc: new Date(),
          refreshStatus: "",
        };

        const checkboxComponent = (
          <Checkbox
            checked={bulkRefreshContext.isClientDatasetSelected(clientDataset)}
            onChange={(newValue: boolean) => {
              if (newValue) {
                bulkRefreshContext.addClientDataset([clientDataset]);
              } else {
                bulkRefreshContext.removeClientDataset([clientDataset]);
              }
            }}
          />
        );

        return checkboxComponent;
      },
    };

    columns = [bulkRefreshColumn, ...columns];
  }

  return (
    <>
      <ConfirmDatasetRefreshModal
        show={confirmDatasetRefreshModal.showModal}
        clientDataset={confirmDatasetRefreshModal.data || ({} as ClientDataset)}
        onConfirmRefresh={() =>
          refreshDataset(confirmDatasetRefreshModal.data).finally(() => {
            setConfirmDatasetRefreshModal({
              ...confirmDatasetRefreshModal,
              showModal: false,
            });
          })
        }
        onDeniedRefresh={() => {
          setConfirmDatasetRefreshModal({
            ...confirmDatasetRefreshModal,
            showModal: false,
          });
        }}
      />
      <Table
        columns={columns}
        data={getTableRows(data)}
        pagination={{
          currentPage: currentPage,
          updatePage: setCurrentPage,
        }}
      />
    </>
  );
}
