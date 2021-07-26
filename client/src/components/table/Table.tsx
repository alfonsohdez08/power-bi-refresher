import React, { useEffect } from "react";
import _ from "lodash";

import Select, { Option } from "../Select";
import PaginationBar from "./PaginationBar";

const rowsPerPageOptions: Option[] = [
  {
    value: "10",
    label: "10",
  },
  {
    value: "25",
    label: "25",
  },
  {
    value: "50",
    label: "50",
  },
];
const pagesPerWindow = 6;

export abstract class Body {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class Column<T> {
  id: string;
  name: string | JSX.Element;
  path?: string;
  map?: (item: T) => JSX.Element | string;

  constructor(
    id: string,
    name: string | JSX.Element,
    path?: string,
    map?: (item: T) => JSX.Element
  ) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.map = map;
  }
}

type Pagination = {
  currentPage: number;
  updatePage: (newPage: number) => void;
};

type TableProps<T extends Body> = {
  columns: Column<T>[];
  data: T[];
  pagination?: Pagination;
};

function Columns({
  columns,
}: {
  columns: { id: string; name: string | JSX.Element }[];
}) {
  const renderColumn = (id: string, name: string | JSX.Element) => {
    return (
      <th
        scope="col"
        className="px-6 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider"
        key={id}
      >
        {name}
      </th>
    );
  };

  return (
    <thead className="bg-yellow-300">
      <tr>{columns.map((column) => renderColumn(column.id, column.name))}</tr>
    </thead>
  );
}

function Rows<T extends Body>({ columns, data }: TableProps<T>) {
  const cssClasses =
    "px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold";

  const renderRow = (dataRow: T) => {
    return (
      <tr key={dataRow.id}>
        {columns.map((column) => (
          <td key={`${dataRow.id}_${column.id}`} className={cssClasses}>
            {column.map
              ? column.map(dataRow)
              : _.get(dataRow, column.path as string)}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <tbody className="bg-yellow-200 divide-y divide-yellow-100">
      {data.length > 0 ? (
        data.map((dataRow) => renderRow(dataRow))
      ) : (
        <tr>
          <td
            className={cssClasses + " uppercase text-center"}
            colSpan={columns.length}
          >
            <span>Whops! There is no data to show &#128554;</span>
          </td>
        </tr>
      )}
    </tbody>
  );
}

export default function Table<T extends Body>({
  columns,
  data,
  pagination,
}: TableProps<T>) {
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(
    parseInt(rowsPerPageOptions[0].value)
  );
  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    const resetPage = () => {
      if (pagination) {
        pagination.updatePage(1);
      }
    };
    resetPage();
  }, [rowsPerPage]);

  const currentPage: number = pagination?.currentPage || 1;

  return (
    <div className="space-y-1">
      <div className="flex">
        <div className="flex items-end">
          <span className="text-gray-800 text-sm font-bold uppercase">
            Query result: {data.length} records
          </span>
        </div>
        <div className="flex-1 flex justify-end">
          <Select
            options={rowsPerPageOptions}
            label="Rows Per Page"
            onOptionSelected={(option) => setRowsPerPage(parseInt(option))}
          />
        </div>
      </div>
      <div className="inline-block">
        <div className="flex flex-col">
          <div className="py-2 inline-block">
            <div className="shadow overflow-hidden border-b border-yellow-100 rounded-lg">
              <table className="divide-y divide-yellow-100">
                <Columns
                  columns={columns.map((c) => ({
                    id: c.id,
                    name: c.name,
                  }))}
                />
                <Rows
                  columns={columns}
                  data={_(data)
                    .slice((currentPage - 1) * rowsPerPage)
                    .take(rowsPerPage)
                    .value()}
                />
              </table>
            </div>
          </div>
        </div>
      </div>
      {pagination ? (
        <div className="py-3 flex justify-center border-t border-gray-200 px-6">
          <PaginationBar
            totalPages={totalPages}
            currentPage={currentPage}
            pagesPerWindow={pagesPerWindow}
            onSelectPage={pagination.updatePage}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
