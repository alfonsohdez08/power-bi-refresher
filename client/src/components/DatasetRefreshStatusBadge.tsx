import * as Badges from "./Badge";
import RefreshFailedBadge from "./refreshFailedBadge";

export enum PowerBiRefreshStatus {
  Completed = "Completed",
  Failed = "Failed",
  Unknown = "Unknown",
  Disabled = "Disabled",
}

export const PowerBiRefreshStatusMap = {
  [PowerBiRefreshStatus.Completed]: "Completed",
  [PowerBiRefreshStatus.Failed]: "Failed",
  [PowerBiRefreshStatus.Unknown]: "In Progress",
  [PowerBiRefreshStatus.Disabled]: "Disabled",
};

export default function DatasetRefreshStatusBadge({
  status,
  data,
}: {
  status: PowerBiRefreshStatus;
  data?: any | null;
}) {
  const placeholder: string = PowerBiRefreshStatusMap[status];

  if (status === PowerBiRefreshStatus.Failed) {
    let { showPopover, error, onBadgeClicked, onPopoverClosed } = data ?? {
      showPopover: false,
      error: null,
      onBadgeClicked: null,
      onPopoverClosed: null,
    };

    return (
      <RefreshFailedBadge
        placeholder={placeholder}
        error={error}
        showPopover={showPopover}
        onBadgeClicked={onBadgeClicked}
        onPopoverClosed={onPopoverClosed}
      />
    );
  }

  let statusBadge = <></>;

  switch (status) {
    case PowerBiRefreshStatus.Completed:
      statusBadge = <Badges.SuccessBadge placeholder={placeholder} />;
      break;
    default:
      statusBadge = <Badges.GeneralBadge placeholder={placeholder} />;
      break;
  }

  return statusBadge;
}
