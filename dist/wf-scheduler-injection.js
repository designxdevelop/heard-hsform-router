(function(){let j=window.location.search.includes("debug=true");function K(...q){if(j)console.log("[Webflow Scheduler]",...q)}let L={over_100k:{url:"https://meetings.hubspot.com/bz/consultation",name:"Consultation Scheduler",description:"Revenue over $100k"},under_100k:{url:"https://meetings.hubspot.com/bz/consultations",name:"Consultations Scheduler",description:"Revenue under $100k or not provided"}},Y={portalId:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.portalId||"7507639",formId:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.formId||window.HDYHAU_FORM_ID||"2abfe31d-49b3-433d-9776-4ff663f8c0b9",sourcePropertyName:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.sourcePropertyName||"how_did_you_hear_about_us",otherPropertyName:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.otherPropertyName||"hdyhau_other_text"},b=["Search engine","Social media","Reddit","AI research","Podcast","Blog, article, or news","Influencer or content creator","Postcard or mailer","Professional association","Therapy platform or tools","Friend, family, or colleague","Billboard"],O=!1,_=!1;function B(){try{let q=sessionStorage.getItem("scheduler_router_data");if(q){let z=JSON.parse(q);return K("Found router data in sessionStorage:",z),sessionStorage.removeItem("scheduler_router_data"),{formData:z.formData,schedulerType:z.scheduler_type,source:"sessionStorage"}}}catch(q){K("sessionStorage error:",q)}try{let q=localStorage.getItem("hubspot_form_data");if(q){let z=JSON.parse(q);return K("Found form data in localStorage:",z),{formData:z,source:"localStorage"}}}catch(q){K("localStorage error:",q)}try{let q=(J)=>{let R=`; ${document.cookie}`.split(`; ${J}=`);if(R.length===2)return R.pop().split(";").shift()},z=q("scheduler_type"),G=q("form_data");if(z||G){let J=G?JSON.parse(atob(G)):{};return document.cookie="scheduler_type=; path=/; max-age=0",document.cookie="form_data=; path=/; max-age=0",K("Found data in cookies:",{schedulerType:z,formData:J}),{formData:J,schedulerType:z,source:"cookies"}}}catch(q){K("cookie error:",q)}return null}function Q(){let q={},z=new URLSearchParams(window.location.search);for(let[G,J]of z)q[G]=J;return q}function U(q,z){if(q&&q.schedulerType)return q.schedulerType;if(q&&q.formData&&q.formData.scheduler_type)return q.formData.scheduler_type;if(z&&z.scheduler_type)return z.scheduler_type;return"under_100k"}function P(){try{let q=document.cookie.match(/(?:^|; )hubspotutk=([^;]*)/);return q?decodeURIComponent(q[1]):""}catch(q){return K("HubSpot cookie lookup error:",q),""}}function x(q){if(!q)return"";let z=["email","email_address","0-1/email","0-2/email"];for(let G of z)if(q[G])return String(q[G]).trim();return""}function k(q){let z=[...q];for(let G=z.length-1;G>0;G-=1){let J=Math.floor(Math.random()*(G+1));[z[G],z[J]]=[z[J],z[G]]}return[...z,"Other"]}function H(q){return String(q).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function F(){if(!Y.formId)return"";return"https://api.hsforms.com/submissions/v3/integration/submit/"+Y.portalId+"/"+Y.formId}function T(q,z,G){let J=F();if(!J)return Promise.reject(Error("Missing HDYHAU HubSpot form ID"));let X=[{name:"email",value:q},{name:Y.sourcePropertyName,value:z}];if(G)X.push({name:Y.otherPropertyName,value:G});let R={fields:X,context:{pageUri:window.location.href,pageName:document.title||"Schedule Confirmation"}},$=P();if($)R.context.hutk=$;return fetch(J,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(R),keepalive:!0}).then((A)=>{if(!A.ok)throw Error(`HubSpot HDYHAU submission failed: ${A.status}`);return A})}function N(){if(document.getElementById("hdyhau-styles"))return;let q=document.createElement("style");q.id="hdyhau-styles",q.textContent=`
      .hdyhau-form {
        color: #1a1a1a;
        font-family: inherit;
        margin: 32px auto 0;
        max-width: 640px;
        width: 100%;
      }

      .hdyhau-form[hidden] {
        display: none;
      }

      .hdyhau-question {
        border: 0;
        margin: 0;
        padding: 0;
      }

      .hdyhau-label {
        display: block;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.4;
        margin-bottom: 16px;
      }

      .hdyhau-options {
        display: grid;
        gap: 10px;
      }

      .hdyhau-option {
        align-items: flex-start;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        gap: 10px;
        line-height: 1.4;
        padding: 12px 14px;
      }

      .hdyhau-option input {
        flex: 0 0 auto;
        margin-top: 2px;
      }

      .hdyhau-other-field {
        margin-top: 14px;
      }

      .hdyhau-other-field label {
        display: block;
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .hdyhau-other-field input {
        border: 1px solid #d1d5db;
        border-radius: 8px;
        box-sizing: border-box;
        font: inherit;
        min-height: 48px;
        padding: 12px 14px;
        width: 100%;
      }

      .hdyhau-submit {
        background: #2e7d32;
        border: 0;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        font: inherit;
        font-weight: 600;
        margin-top: 18px;
        min-height: 52px;
        padding: 14px 28px;
        width: 100%;
      }

      .hdyhau-submit:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .hdyhau-status {
        font-size: 15px;
        margin-top: 12px;
        min-height: 22px;
      }

      .hdyhau-status[data-state='error'] {
        color: #b91c1c;
      }
    `,document.head.appendChild(q)}function C(q,z){if(O||_)return;let G=x(q);if(!G){K("Skipping HDYHAU form because no contact email was found");return}O=!0,N();let J=document.createElement("form");J.id="hdyhau-form",J.className="hdyhau-form",J.noValidate=!0;let X=k(b).map((W,V)=>{let E=`hdyhau-option-${V}`;return`
          <label class="hdyhau-option" for="${E}">
            <input
              id="${E}"
              name="hdyhau_source"
              type="radio"
              value="${H(W)}"
              required
            >
            <span>${H(W)}</span>
          </label>
        `}).join("");J.innerHTML=`
      <input type="hidden" name="email" value="${H(G)}">
      <fieldset class="hdyhau-question">
        <legend class="hdyhau-label">How did you hear about us?</legend>
        <div class="hdyhau-options">${X}</div>
      </fieldset>
      <div class="hdyhau-other-field" hidden>
        <label for="hdyhau-other-text">Please describe</label>
        <input
          id="hdyhau-other-text"
          name="hdyhau_other_text"
          type="text"
          autocomplete="off"
        >
      </div>
      <button class="hdyhau-submit" type="submit" disabled>Submit</button>
      <div class="hdyhau-status" role="status" aria-live="polite"></div>
    `;let R=z||document.getElementById("scheduler-target");if(R&&R.parentNode)R.insertAdjacentElement("afterend",J);else document.body.appendChild(J);let $=J.querySelector(".hdyhau-submit"),A=J.querySelector(".hdyhau-other-field"),M=J.querySelector("#hdyhau-other-text"),Z=J.querySelector(".hdyhau-status");J.addEventListener("change",()=>{let W=J.querySelector('input[name="hdyhau_source"]:checked'),V=!!W,E=W&&W.value==="Other";if($.disabled=!V||_,A.hidden=!E,!E)M.value=""}),J.addEventListener("submit",(W)=>{W.preventDefault();let V=J.querySelector('input[name="hdyhau_source"]:checked');if(!V||_)return;$.disabled=!0,Z.dataset.state="",Z.textContent="",T(G,V.value,M.value.trim()).then(()=>{_=!0,J.querySelectorAll("input, button").forEach((E)=>E.disabled=!0),Z.textContent="Thanks!",K("HDYHAU response submitted")}).catch((E)=>{$.disabled=!1,Z.dataset.state="error",Z.textContent="Please try again.",K("HDYHAU submission error:",E)})}),K("HDYHAU form rendered")}function y(q){try{let z=new URL(q).hostname;return z.endsWith("hubspot.com")||z.endsWith("hsforms.com")||z.endsWith("hsforms.net")||z.endsWith("hsappstatic.net")||z.includes("hubspot")||z.includes("hsforms")}catch(z){return!1}}function c(q){let G=(typeof q==="string"?q:q?JSON.stringify(q):"").toLowerCase();return G.includes("meetingbooksucceeded")||G.includes("hsmeetingsbooksucceeded")||G.includes("meeting_booked")||G.includes("meetingbooked")||G.includes("meeting booked")||G.includes("booking confirmed")||G.includes("meeting scheduled")}function h(q){let z=(q.textContent||q.innerText||"").toLowerCase();return z.includes("booked")||z.includes("scheduled")||z.includes("confirmed")||z.includes("you are all set")||z.includes("you're all set")}function g(q,z){if(!z)return;let G=()=>C(q,z);if(window.addEventListener("message",(X)=>{if(!y(X.origin))return;if(c(X.data))K("Detected scheduler completion via postMessage"),G()}),typeof MutationObserver>"u")return;let J=new MutationObserver((X)=>{for(let R of X)for(let $ of R.addedNodes){if($.nodeType!==1)continue;if(h($)){K("Detected scheduler completion via DOM mutation"),G(),J.disconnect();return}}});J.observe(z,{childList:!0,subtree:!0})}function I(q,z){let G=L[z]||L.under_100k,J=new URL(G.url);J.searchParams.set("embed","true");let X=q.partnerstack_click_id||q.ps_xid||q["0-1/partnerstack_click_id"]||q["0-2/partnerstack_click_id"];if(X)J.searchParams.set("partnerstack_click_id",X),K("Adding PartnerStack click id",X);return Object.entries({email:["email","email_address","0-1/email","0-2/email"],firstname:["firstname","first_name","fname","0-1/firstname","0-2/firstname"],lastname:["lastname","last_name","lname","0-1/lastname","0-2/lastname"],company:["company","practice_name","business_name","0-1/company","0-2/company"],phone:["phone","phone_number","telephone","0-1/phone","0-2/phone"]}).forEach(([M,Z])=>{for(let W of Z)if(q[W]){J.searchParams.set(M,q[W]),K(`Mapping ${W} -> ${M}: ${q[W]}`);break}}),["is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_","what_best_describes_your_practice_","referrer","submissionGuid","uuid","partnerstack_click_id"].forEach((M)=>{if(q[M])J.searchParams.set(M,q[M]),K(`Adding additional field: ${M} = ${q[M]}`);else{let Z=[`0-1/${M}`,`0-2/${M}`];for(let W of Z)if(q[W]){J.searchParams.set(M,q[W]),K(`Adding prefixed field: ${W} -> ${M} = ${q[W]}`);break}}}),["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach((M)=>{if(q[M])J.searchParams.set(M,q[M])}),K("Built scheduler URL:",J.toString()),J.toString()}function S(q){try{if(window.location.hostname.includes("joinheard.com")){if(typeof rdt==="function")rdt("track","Lead");if(typeof fbq==="function")fbq("track","Lead")}if(typeof gtag<"u")gtag("event","generate_lead",{event_category:"engagement",event_label:q||"unknown"});else if(typeof ga<"u")ga("send","event","Lead","Generate",q||"unknown");if(typeof window.posthog<"u")window.posthog.capture("scheduler_lead_generated",{scheduler_type:q||"unknown",source:"webflow_complete"});if(typeof window.amplitude<"u")window.amplitude.track("scheduler_lead_generated",{scheduler_type:q||"unknown",source:"webflow_complete"});K("Lead events fired")}catch(z){K("Lead tracking error:",z)}}function v(){K("Starting scheduler setup...");let q=Q(),z=B(),G={...q};if(z&&z.formData)G={...G,...z.formData},K("Merged form data from storage:",G);let J=U(z,G);if(!(G.email||G.firstname||G.first_name||G["0-1/email"]||G["0-1/firstname"]||G["0-2/email"]||G["0-2/firstname"]||Object.keys(G).some((M)=>M!=="debug"&&M!=="utm_source"&&M!=="utm_medium"&&M!=="utm_campaign"&&!M.startsWith("group[")&&G[M]))){K("No form data found, redirecting to /free-consult"),window.location.href="/free-consult";return}K("Form data found, setting up scheduler");let R=document.getElementById("scheduler-target");if(!R){let M=document.querySelector('iframe[src*="meetings.hubspot.com"]'),Z=document.querySelector(".meetings-iframe-container");if(M||Z){K("Found existing iframe/container, will enhance it");let W=document.createElement("div");if(W.id="scheduler-target",Z)Z.parentNode.insertBefore(W,Z),W.appendChild(Z);else if(M)M.parentNode.insertBefore(W,M),W.appendChild(M);R=W}}if(!R)K("No target found, creating scheduler-target div"),R=document.createElement("div"),R.id="scheduler-target",R.style.cssText="min-height: 600px; width: 100%;",document.body.appendChild(R);let $=I(G,J);K("Injecting scheduler into target"),K("Final URL:",$),R.innerHTML=`<div class="meetings-iframe-container" data-src="${$}"></div>`;let A=document.createElement("script");return A.src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js",A.onload=function(){K("HubSpot embed script loaded successfully"),S(J)},A.onerror=function(){console.error("[Webflow Scheduler] Failed to load HubSpot embed script")},document.head.appendChild(A),g(G,R),!0}function p(){if(!j)return;let q=document.createElement("div");q.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      max-width: 400px;
      z-index: 10000;
      border: 2px solid #226752;
    `;let z=B(),G=new URLSearchParams(window.location.search);q.innerHTML=`
      <strong>\uD83D\uDD27 Webflow Scheduler Debug</strong><br><br>
      <strong>Form Data Sources:</strong><br>
      \uD83D\uDCC1 localStorage: ${localStorage.getItem("hubspot_form_data")?"✅ Found":"❌ Empty"}<br>
      \uD83D\uDCBE sessionStorage: ${sessionStorage.getItem("scheduler_router_data")?"✅ Found":"❌ Empty"}<br>
      \uD83C\uDF6A Cookies: ${document.cookie.includes("form_data=")?"✅ Found":"❌ Empty"}<br><br>
      <strong>URL Parameters:</strong><br>
      ${G.toString()||"None"}<br><br>
      <strong>Stored Data:</strong><br>
      ${z?`Source: ${z.source}<br>Fields: ${Object.keys(z.formData||{}).join(", ")}`:"None found"}<br><br>
      <strong>Scheduler Type:</strong><br>
      ${U(z,Q())}<br><br>
      <strong>Action:</strong><br>
      ${z||G.toString()?"✅ Loading scheduler":"❌ Will redirect to /free-consult"}
    `,document.body.appendChild(q);let J=!1,X={x:0,y:0};q.addEventListener("mousedown",(R)=>{J=!0,X.x=R.clientX-q.offsetLeft,X.y=R.clientY-q.offsetTop}),document.addEventListener("mousemove",(R)=>{if(J)q.style.left=R.clientX-X.x+"px",q.style.top=R.clientY-X.y+"px",q.style.right="auto"}),document.addEventListener("mouseup",()=>{J=!1})}function w(){K("Webflow Scheduler Complete initializing..."),p(),v(),K("Webflow Scheduler Complete initialized")}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",w);else w();if(j)window.WebflowSchedulerComplete={getStoredFormData:B,getQueryParams:Q,buildSchedulerUrl:I,handleScheduler:v,renderHdyhauForm:C,fireLeadEvents:S,resolveSchedulerType:U,init:w,config:L};K("Webflow Scheduler Complete script loaded")})();
