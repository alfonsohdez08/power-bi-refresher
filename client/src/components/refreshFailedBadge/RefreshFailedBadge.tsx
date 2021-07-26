import Tippy from "@tippyjs/react";

import { DangerBadge } from "../Badge";
import RefreshFailedPopover, { RefreshError } from "../RefreshFailedPopover";

import "./styles.css";

export default function RefreshFailedBadge({
  placeholder,
  error,
  showPopover,
  onBadgeClicked,
  onPopoverClosed,
}: {
  placeholder: string;
  error: RefreshError | null;
  showPopover: boolean;
  onBadgeClicked: () => void;
  onPopoverClosed: () => void;
}) {
  const hasError = error !== null;

  const dangerBadge: JSX.Element = (
    <div className={hasError ? "cursor-pointer" : ""} onClick={onBadgeClicked}>
      <DangerBadge placeholder={placeholder} />
    </div>
  );

  if (showPopover && hasError) {
    return (
      <Tippy
        content={
          <RefreshFailedPopover
            error={{
              code: error?.code ?? "",
              description: error?.description ?? "",
            }}
            onPopoverClosed={onPopoverClosed}
          />
        }
        visible={showPopover && hasError}
        interactive={true}
        animation={false}
        className="popover-layout"
      >
        {dangerBadge}
      </Tippy>
    );
  }

  return dangerBadge;
}
