import { ReactNode } from "react";

export default function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-bold mb-6">{children}</h1>;
}
