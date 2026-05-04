import { useEffect } from "react";

export const SetService = ({ service, children }) => {
  useEffect(() => {
    localStorage.setItem("selectedService", service);
  }, [service]);

  return children;
}

export const GetService = () => {
  const service = localStorage.getItem("selectedService");
  return service;
}