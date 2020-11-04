import { ToasterContext } from "providers/ToasterProvider";
import { useContext } from "react";

export const useToaster = () => useContext(ToasterContext);
