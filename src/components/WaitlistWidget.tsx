"use client";

import Script from "next/script";

const cssLoader = `
let head = document.getElementsByTagName('HEAD')[0];
let link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css';
head.appendChild(link);
`;

export function WaitlistWidget() {
  return (
    <div>
      <Script
        id="css-loader"
        type=""
        dangerouslySetInnerHTML={{ __html: cssLoader }}
      />
      <Script
        id="js-loader"
        src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"
      />
      <h3>
        Get Priority Access - Limited Beta Spots Available
      </h3>
      <div
        id="getWaitlistContainer"
        className="w-full justify-center"
        data-waitlist_id="25576"
        data-widget_type="WIDGET_2"
      ></div>
    </div>
  );
} 