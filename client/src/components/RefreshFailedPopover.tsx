import * as React from "react";
import { XIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Label, { LabelTextSize } from "./Label";
import { Button } from "./buttons";

export type RefreshError = {
  code: string;
  description?: string;
};

const LabelWithValue = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div>
    <Label placeholder={`${label}:`} textSize={LabelTextSize.ExtraSmall} />
    <span className="text-gray-800 text-xs font-semibold ml-1">
      {value ?? ""}
    </span>
  </div>
);

const PopoverHeader = ({
  onPopoverClosed,
}: {
  onPopoverClosed: () => void;
}) => (
  <div className="flex flex-row">
    <div>
      <h6 className="uppercase text-gray-800 text-lg font-bold">Error</h6>
    </div>
    <div className="flex-grow flex flex-row-reverse">
      <XIcon
        className="cursor-pointer h-6 w-6 text-gray-800"
        onClick={onPopoverClosed}
      />
    </div>
  </div>
);

const ClipboardButton = () => (
  <Button placeholder="Copy to Clipboard" className="bg-red-400 text-xs" />
);

const formatErrorMessage = (error: RefreshError) =>
  `Error Code from Power BI: "${error.code}".\nError Description from Power BI: "${error.description}".`;

export default function RefreshFailedPopover({
  error,
  onPopoverClosed,
}: {
  error: RefreshError;
  onPopoverClosed: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const { code, description } = error;

  return (
    <div className="bg-red-300 rounded-lg space-y-2 p-3">
      <PopoverHeader onPopoverClosed={onPopoverClosed} />
      <div className="flex flex-col overflow-x-hidden">
        <LabelWithValue label="Code" value={code} />
        <LabelWithValue label="Description" value={description} />
      </div>
      <div className="pt-1 flex items-center space-x-2">
        <div>
          <CopyToClipboard
            text={formatErrorMessage(error)}
            onCopy={(text, result) => {
              if (!result) {
                return;
              }

              setCopied(true);
            }}
          >
            {/* Had to wrap with a span element because it seems it does not listen to custom react component (the click event) */}
            <span>
              <ClipboardButton />
            </span>
          </CopyToClipboard>
        </div>
        <div className="inline-block">
          {copied ? (
            <span className="text-gray-800 text-xs font-semibold italic">
              Copied to the Clipboard!
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
