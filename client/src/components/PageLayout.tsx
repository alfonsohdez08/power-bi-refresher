import React from "react";

import Navbar from "./Navbar";

function PageHeader({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      <Navbar />
      {text ? (
        <h1 className="uppercase font-bold text-gray-800 text-3xl leading-8 text-left">
          {text}
        </h1>
      ) : null}
    </div>
  );
}

export default function PageLayout({
  headerText,
  children,
}: {
  headerText: string;
  children: JSX.Element;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-9/12 mx-auto flex-grow space-y-4">
        <PageHeader text={headerText} />
        {children}
      </div>
    </div>
  );
}
