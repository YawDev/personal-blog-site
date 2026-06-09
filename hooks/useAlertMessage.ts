import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useAlertMessage = (urlParam: string, message: string) => {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    apiStatus: number;
  }>({
    show: false,
    message: "",
    apiStatus: 0,
  });

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // Check for "urlParam=true" in query params to show success message after action
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get(urlParam) === "true") {
      setAlert({
        show: true,
        message: message,
        apiStatus: 200,
      });
    }
  }, [searchParams]);

  return alert;
};
