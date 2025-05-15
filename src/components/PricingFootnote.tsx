import React from "react";

/**
 * PricingFootnote displays the fine print and extra details for the pricing plans.
 */
const PricingFootnote = () => (
  <div className="max-w-3xl mx-auto mt-8 mb-4 text-xs text-gray-500 font-sans space-y-2">
    <div>* &quot;Pooled minutes&quot; roll over 30 days.</div>
    <div>* Voice-AI Cost-Saver blend available on Growth &amp; up (-$0.03/min).</div>
    <div>* Implementation fee waived on annual terms.</div>
    <div>* Outcome-based pricing, BYOC SIP, and wholesale/white-label available only in Enterprise contracts.</div>
    <div className="mt-2">Overage: <span className="font-semibold">$0.09 / min</span> &ndash; auto-upgrade when it&apos;s cheaper.<br />Free trial: first 300 minutes on every plan &rarr; zero risk.</div>
  </div>
);

export default PricingFootnote; 