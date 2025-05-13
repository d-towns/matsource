import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
export default function MyApp() {
  useEffect(()=>{
    (async function () {
      const cal = await getCalApi({"namespace":"discovery-call"});
      cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])
  return <button data-cal-namespace="discovery-call"
    data-cal-link="dennistowns/discovery-call"
    className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm"
    data-cal-config='{"layout":"month_view"}'
    >Click Here to Book a Discovery Call</button>;
};