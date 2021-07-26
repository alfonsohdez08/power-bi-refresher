import React from "react";

import PageLayout from "../components/PageLayout";
import Table, { TableColumn, TableBody } from "../components/table";
import { PrimaryButton, SecondaryButton } from "../components/buttons";
import ClearBulkRefreshButton from "../components/ClearBulkRefreshButton";

import { BulkRefreshContext, BulkRefresh } from "../BulkRefreshContext";
import ClientDataset from "../api/models/ClientDataset";

import { parseClientDatasetId } from "../utils";
import API from "../api";

import { withRouter } from "react-router";
import { toast } from "react-toastify";

class DatasetRefreshCandidateRow extends TableBody {
  clientId: string;
  clientName: string;
  datasetId: string;
  datasetName: string;

  constructor(
    id: string,
    clientId: string,
    clientName: string,
    datasetId: string,
    datasetName: string
  ) {
    super(id);

    this.clientId = clientId;
    this.clientName = clientName;
    this.datasetId = datasetId;
    this.datasetName = datasetName;
  }
}

const removeClientDataset = (
  clientId: string,
  datasetId: string,
  bulkRefreshContext: BulkRefresh | null
) => {
  const clientDataset: ClientDataset = {
    clientId: clientId,
    datasetId: datasetId,
    clientName: "",
    datasetName: "",
    refreshStartDateInUtc: new Date(),
    refreshStatus: "",
  };

  bulkRefreshContext?.removeClientDataset([clientDataset]);
};

const DatasetRefreshCandidatesTable = ({
  clientsDatasets,
  bulkRefreshContext,
}: {
  clientsDatasets: ClientDataset[];
  bulkRefreshContext: BulkRefresh | null;
}): JSX.Element => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const columns: TableColumn<DatasetRefreshCandidateRow>[] = [
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
      id: "Remove",
      name: "",
      map: ({ clientId, datasetId }) => (
        <SecondaryButton
          placeholder="Remove"
          onClick={() =>
            removeClientDataset(clientId, datasetId, bulkRefreshContext)
          }
        />
      ),
    },
  ];

  const rows: DatasetRefreshCandidateRow[] =
    clientsDatasets.map<DatasetRefreshCandidateRow>((cd) => ({
      id: parseClientDatasetId(cd.clientId, cd.datasetId),
      clientId: cd.clientId,
      clientName: cd.clientName,
      datasetId: cd.datasetId,
      datasetName: cd.datasetName,
    }));

  return (
    <Table
      columns={columns}
      data={rows}
      pagination={{ currentPage: currentPage, updatePage: setCurrentPage }}
    />
  );
};

function ConfirmBulkRefreshPage(props: { [key: string]: any }) {
  const [succeded, setSucceded] = React.useState(false);

  const bulkRefreshContext = React.useContext(BulkRefreshContext);

  const clientsDatasets: ClientDataset[] =
    bulkRefreshContext?.getClientsDatasets() || [];

  React.useEffect(() => {
    if (succeded) {
      bulkRefreshContext?.resetBulkRefresh();
    }
  }, [succeded]);

  React.useEffect(() => {
    if (clientsDatasets.length == 0 && succeded) {
      displayToastMessage(
        "The refreshes went through. You will be redirected to the Home page in a moment."
      );
    }
  }, [clientsDatasets]);

  const displayToastMessage = (message: string) => {
    const cssClasses: string = "text-base text-gray-800 font-semibold";

    if (succeded) {
      toast.success(message, {
        onClose: () => props.history.push("/"),
        className: cssClasses,
      });
    } else {
      toast.error(message, { className: cssClasses });
    }
  };

  const submitRefreshes = () => {
    API.refreshDatasets(
      clientsDatasets.map((cd) => ({
        clientId: cd.clientId,
        datasetId: cd.datasetId,
      }))
    )
      .then(() => {
        setSucceded(true);
      })
      .catch((error) => {
        console.error(error);

        displayToastMessage(
          "Something went wrong when attempting to perform the operation. Please, try again."
        );
      });
  };

  return (
    <PageLayout headerText="Dataset Refresh Confirmation">
      <div className="pt-6 space-y-6">
        <div className="flex justify-center">
          <div className="inline-block space-x-3">
            <PrimaryButton
              placeholder="Submit"
              disabled={clientsDatasets.length === 0}
              onClick={submitRefreshes}
            />
            <ClearBulkRefreshButton />
          </div>
        </div>
        <div className="flex justify-center">
          <DatasetRefreshCandidatesTable
            clientsDatasets={clientsDatasets}
            bulkRefreshContext={bulkRefreshContext}
          />
        </div>
      </div>
    </PageLayout>
  );
}

export default withRouter(ConfirmBulkRefreshPage);
