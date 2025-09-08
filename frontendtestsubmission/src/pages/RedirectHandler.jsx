// FrontendTestSubmission/src/pages/RedirectHandler.jsx
import React, {useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadLinks, saveLinks } from "../utils/shortener";
import { getCoarseGeo } from "../utils/geo";
import { Log } from "../utils/loggingClient";

export default function RedirectHandler(){
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(()=>{
    (async ()=>{
      const list = loadLinks();
      const item = list.find(x=>x.shortcode === shortcode);
      if (!item) {
        await Log("frontend","warn","api", `redirect failed - shortcode not found: ${shortcode}`).catch(()=>{});
        navigate("/", {replace:true});
        return;
      }
      // record click
      const geo = await getCoarseGeo().catch(()=> "unknown");
      const source = document.referrer || "direct";
      item.clicks.push({ timestamp: Date.now(), source, geo });
      saveLinks(list);
      await Log("frontend","info","api", `redirect: ${shortcode} -> ${item.longUrl}`).catch(()=>{});
      // perform redirect
      window.location.href = item.longUrl;
    })();
  }, [shortcode, navigate]);

  return <div style={{padding:20}}>Redirecting…</div>;
}
