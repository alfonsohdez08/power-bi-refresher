import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RefreshIcon } from "@heroicons/react/outline";

import ClientDataset from "../api/models/ClientDataset";

export default function ConfirmDatasetRefreshModal({
  show,
  clientDataset,
  onConfirmRefresh,
  onDeniedRefresh,
}: {
  show: boolean;
  clientDataset: ClientDataset;
  onConfirmRefresh: () => void;
  onDeniedRefresh: () => void;
}) {
  const confirmButtonRef = useRef(null);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={confirmButtonRef}
        open={show}
        onClose={onDeniedRefresh}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <RefreshIcon
                      className="h-6 w-6 text-yellow-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Refresh Dataset
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-gray-800 text-sm">
                        Do you want to refresh the dataset{" "}
                        <span className="font-bold">
                          {clientDataset.datasetName}
                        </span>{" "}
                        for the client{" "}
                        <span className="font-bold">
                          {clientDataset.clientName}
                        </span>
                        ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-base text-gray-800 font-bold focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onConfirmRefresh}
                  ref={confirmButtonRef}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 bg-gray-300 hover:bg-gray-400 shadow-sm px-4 py-2 text-base font-bold text-gray-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onDeniedRefresh}
                >
                  No
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
