import React from "react";

export const Table = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>;
export const TableBody = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>;
export const TableRow = ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>;
export const TableHead = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`border-b border-gray-600 p-4 text-left ${className}`}>{children}</th>
);
export const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`border-b border-gray-700 p-4 ${className}`}>{children}</td>
);
export const TableCaption = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <caption className={`text-sm text-gray-400 mb-2 ${className}`}>{children}</caption>
);
