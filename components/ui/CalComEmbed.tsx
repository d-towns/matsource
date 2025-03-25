'use client'

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
export default function CalComEmbed() {
  useEffect(()=>{
    (async function () {
      const cal = await getCalApi({"namespace":"discovery-call"});
      cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])
  return <Cal namespace="discovery-call"
    calLink="dennistowns/discovery-call"
    style={{width:"100%",height:"100%",overflow:"scroll"}}
    config={{"layout":"month_view"}}
  
    
  />;
};

