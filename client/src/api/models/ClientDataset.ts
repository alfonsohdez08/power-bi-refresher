import _ from "lodash";

import Client from "./Client";
import {RefreshErrorDetails} from "./Dataset";

class ClientDataset {
  clientId: string = "";
  clientName: string = "";
  datasetId: string = "";
  datasetName: string = "";
  refreshStartDateInUtc!: Date;
  refreshEndDateInUtc?: Date;
  refreshStatus: string = "";
  refreshError?: RefreshErrorDetails;
};

const flatClients = (clients: Client[]): ClientDataset[] =>
  _(clients)
    .flatMap(({ id, name, datasets }) =>
      _.map(datasets, (dataset) => ({
        id,
        name,
        dataset: { ...dataset },
      }))
    )
    .map<ClientDataset>((client) => ({
      clientId: client.id,
      clientName: client.name,
      datasetId: client.dataset.id,
      datasetName: client.dataset.name,
      refreshStartDateInUtc: client.dataset.refreshHistory[0].startDateInUtc,
      refreshEndDateInUtc: client.dataset.refreshHistory[0].endDateInUtc,
      refreshStatus: client.dataset.refreshHistory[0].status,
      refreshError: client.dataset.refreshHistory[0].error
    }))
    .value();

export { flatClients };

export default ClientDataset;
