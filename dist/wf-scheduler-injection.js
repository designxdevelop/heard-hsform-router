(function(){let U=window.location.search.includes("debug=true");function W(...q){if(U)console.log("[Webflow Scheduler]",...q)}let O={over_100k:{url:"https://meetings.hubspot.com/bz/consultation",name:"Consultation Scheduler",description:"Revenue over $100k"},under_100k:{url:"https://meetings.hubspot.com/bz/consultations",name:"Consultations Scheduler",description:"Revenue under $100k or not provided"}},K={portalId:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.portalId||"7507639",formId:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.formId||window.HDYHAU_FORM_ID||"2abfe31d-49b3-433d-9776-4ff663f8c0b9",sourcePropertyName:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.sourcePropertyName||"how_did_you_heard_about_us",fallbackSourcePropertyName:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.fallbackSourcePropertyName||"where_did_you_hear_about_heard_",otherPropertyName:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.otherPropertyName||"hdyhau_other_text"},N=[{label:"Search engine",value:"Search engine"},{label:"Social media",value:"Social media"},{label:"Reddit",value:"Reddit"},{label:"AI research",value:"AI research"},{label:"Podcast",value:"Podcast"},{label:"Blog, article, or news",value:"Blog, article, or news"},{label:"Influencer or content creator",value:"Influencer or content creator"},{label:"Postcard or mailer",value:"Postcard or mailer"},{label:"Professional association",value:"Professional association"},{label:"Therapy platform or tools",value:"Therapy platform or tools"},{label:"Friend, family, or colleague",value:"Friend, family, or colleague"},{label:"Billboard",value:"Billboard"}],y={label:"Other",value:"Other"},I=!1,E=!1;function B(){try{let q=sessionStorage.getItem("scheduler_router_data");if(q){let z=JSON.parse(q);return W("Found router data in sessionStorage:",z),sessionStorage.removeItem("scheduler_router_data"),{formData:z.formData,schedulerType:z.scheduler_type,source:"sessionStorage"}}}catch(q){W("sessionStorage error:",q)}try{let q=localStorage.getItem("hubspot_form_data");if(q){let z=JSON.parse(q);return W("Found form data in localStorage:",z),{formData:z,source:"localStorage"}}}catch(q){W("localStorage error:",q)}try{let q=(J)=>{let R=`; ${document.cookie}`.split(`; ${J}=`);if(R.length===2)return R.pop().split(";").shift()},z=q("scheduler_type"),G=q("form_data");if(z||G){let J=G?JSON.parse(atob(G)):{};return document.cookie="scheduler_type=; path=/; max-age=0",document.cookie="form_data=; path=/; max-age=0",W("Found data in cookies:",{schedulerType:z,formData:J}),{formData:J,schedulerType:z,source:"cookies"}}}catch(q){W("cookie error:",q)}return null}function S(){let q={},z=new URLSearchParams(window.location.search);for(let[G,J]of z)q[G]=J;return q}function C(q,z){if(q&&q.schedulerType)return q.schedulerType;if(q&&q.formData&&q.formData.scheduler_type)return q.formData.scheduler_type;if(z&&z.scheduler_type)return z.scheduler_type;return"under_100k"}function c(){try{let q=document.cookie.match(/(?:^|; )hubspotutk=([^;]*)/);return q?decodeURIComponent(q[1]):""}catch(q){return W("HubSpot cookie lookup error:",q),""}}function p(q){if(!q)return"";let z=["email","email_address","0-1/email","0-2/email"];for(let G of z)if(q[G])return String(q[G]).trim();return""}function h(q){let z=[...q];for(let G=z.length-1;G>0;G-=1){let J=Math.floor(Math.random()*(G+1));[z[G],z[J]]=[z[J],z[G]]}return[...z,y]}function b(q){return String(q).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function g(){if(!K.formId)return"";return"https://api.hsforms.com/submissions/v3/integration/submit/"+K.portalId+"/"+K.formId}function D(q,z,G){let J=g();if(!J)return Promise.reject(Error("Missing HDYHAU HubSpot form ID"));let Z=[{name:"email",value:q},{name:K.sourcePropertyName,value:z}];if(K.fallbackSourcePropertyName&&K.fallbackSourcePropertyName!==K.sourcePropertyName)Z.push({name:K.fallbackSourcePropertyName,value:z});if(G)Z.push({name:K.otherPropertyName,value:G});let R={fields:Z,context:{pageUri:window.location.href,pageName:document.title||"Schedule Confirmation"}},$=c();if($)R.context.hutk=$;return fetch(J,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(R),keepalive:!0}).then((Y)=>{if(!Y.ok)throw Error(`HubSpot HDYHAU submission failed: ${Y.status}`);return Y})}function u(){if(document.getElementById("hdyhau-styles"))return;let q=document.createElement("style");q.id="hdyhau-styles",q.textContent=`
      .hdyhau-modal {
        align-items: center;
        background: rgba(17, 24, 39, 0.48);
        box-sizing: border-box;
        display: flex;
        inset: 0;
        justify-content: center;
        padding: 24px;
        position: fixed;
        z-index: 2147483000;
      }

      .hdyhau-modal[hidden] {
        display: none;
      }

      .hdyhau-dialog {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 24px 80px rgba(17, 24, 39, 0.24);
        box-sizing: border-box;
        max-height: min(720px, calc(100vh - 48px));
        max-width: 640px;
        overflow: auto;
        padding: 28px;
        position: relative;
        width: 100%;
      }

      .hdyhau-form {
        color: #1a1a1a;
        font-family: inherit;
        width: 100%;
      }

      .hdyhau-form[hidden] {
        display: none;
      }

      .hdyhau-close {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 8px;
        color: #4b5563;
        cursor: pointer;
        display: flex;
        font: inherit;
        font-size: 26px;
        height: 40px;
        justify-content: center;
        line-height: 1;
        padding: 0;
        position: absolute;
        right: 12px;
        top: 12px;
        width: 40px;
      }

      .hdyhau-close:hover,
      .hdyhau-close:focus {
        background: #f3f4f6;
        outline: none;
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

      @media (max-width: 640px) {
        .hdyhau-modal {
          align-items: flex-end;
          padding: 0;
        }

        .hdyhau-dialog {
          border-radius: 8px 8px 0 0;
          max-height: min(84vh, 720px);
          max-width: none;
          padding: 24px 18px calc(18px + env(safe-area-inset-bottom));
        }

        .hdyhau-label {
          font-size: 17px;
          padding-right: 40px;
        }

        .hdyhau-option {
          padding: 11px 12px;
        }
      }
    `,document.head.appendChild(q)}function v(q,z){if(I||E)return;let G=p(q);if(!G){W("Skipping HDYHAU form because no contact email was found");return}I=!0,u();let J=document.createElement("div");J.id="hdyhau-modal",J.className="hdyhau-modal",J.setAttribute("role","dialog"),J.setAttribute("aria-modal","true"),J.setAttribute("aria-labelledby","hdyhau-question-label");let Z=document.createElement("div");Z.className="hdyhau-dialog";let R=document.createElement("button");R.className="hdyhau-close",R.type="button",R.setAttribute("aria-label","Close"),R.textContent="×";let $=document.createElement("form");$.id="hdyhau-form",$.className="hdyhau-form",$.noValidate=!0;let Y=h(N).map((_,A)=>{let L=`hdyhau-option-${A}`;return`
          <label class="hdyhau-option" for="${L}">
            <input
              id="${L}"
              name="hdyhau_source"
              type="radio"
              value="${b(_.value)}"
              required
            >
            <span>${b(_.label)}</span>
          </label>
        `}).join("");$.innerHTML=`
      <input type="hidden" name="email" value="${b(G)}">
      <fieldset class="hdyhau-question">
        <legend class="hdyhau-label" id="hdyhau-question-label">How did you hear about us?</legend>
        <div class="hdyhau-options">${Y}</div>
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
    `,Z.appendChild(R),Z.appendChild($),J.appendChild(Z),document.body.appendChild(J);let X=$.querySelector(".hdyhau-submit"),j=$.querySelector(".hdyhau-other-field"),V=$.querySelector("#hdyhau-other-text"),Q=$.querySelector(".hdyhau-status"),P=document.activeElement;function F(_){if(_.key==="Escape"&&document.body.contains(J))M()}function M(){if(J.hidden=!0,J.remove(),document.removeEventListener("keydown",F),P&&typeof P.focus==="function")P.focus()}R.addEventListener("click",M),J.addEventListener("click",(_)=>{if(_.target===J)M()}),document.addEventListener("keydown",F),R.focus(),$.addEventListener("change",()=>{let _=$.querySelector('input[name="hdyhau_source"]:checked'),A=!!_,L=_&&_.value==="Other";if(X.disabled=!A||E,j.hidden=!L,!L)V.value=""}),$.addEventListener("submit",(_)=>{_.preventDefault();let A=$.querySelector('input[name="hdyhau_source"]:checked');if(!A||E)return;X.disabled=!0,Q.dataset.state="",Q.textContent="",D(G,A.value,V.value.trim()).then(()=>{E=!0,$.querySelectorAll("input, button").forEach((L)=>L.disabled=!0),Q.textContent="Thanks!",setTimeout(M,1200),W("HDYHAU response submitted")}).catch((L)=>{X.disabled=!1,Q.dataset.state="error",Q.textContent="Please try again.",W("HDYHAU submission error:",L)})}),W("HDYHAU form rendered")}function n(q){try{let z=new URL(q).hostname;return z.endsWith("hubspot.com")||z.endsWith("hsforms.com")||z.endsWith("hsforms.net")||z.endsWith("hsappstatic.net")||z.includes("hubspot")||z.includes("hsforms")}catch(z){return!1}}function i(q){let z="";try{z=typeof q==="string"?q:q?JSON.stringify(q):""}catch(J){z=String(q||"")}let G=z.toLowerCase();return G.includes("meetingbooksucceeded")||G.includes("meetingsbooksucceeded")||G.includes("hsmeetingsbooksucceeded")||G.includes("hsmeetings:meetingbooksucceeded")||G.includes("meeting_booked")||G.includes("meetings_booked")||G.includes("meetingbooked")||G.includes("meetingsbooked")||G.includes("meeting booked")||G.includes("meetings booked")||G.includes("booking confirmed")||G.includes("meeting scheduled")}function x(q){return q&&q.tagName==="IFRAME"&&q.src&&q.src.includes("meetings.hubspot.com")}function f(q,z){let G=new WeakSet;function J(Z){if(!Z||G.has(Z))return;G.add(Z);let R=0,$=Date.now();Z.addEventListener("load",()=>{if(R+=1,U)W("HubSpot Meetings iframe loaded",{loadCount:R,elapsedMs:Date.now()-$});if(R<2||Date.now()-$<3000)return;W("Detected scheduler completion via iframe navigation"),z()})}if(x(q))J(q);return q.querySelectorAll('iframe[src*="meetings.hubspot.com"]').forEach(J),J}function l(q){let z=(q.textContent||q.innerText||"").toLowerCase();return z.includes("booked")||z.includes("scheduled")||z.includes("confirmed")||z.includes("you are all set")||z.includes("you're all set")}function s(q,z){if(!z)return;let G=()=>v(q,z),J=f(z,G);if(window.addEventListener("message",(R)=>{if(!n(R.origin))return;if(i(R.data))W("Detected scheduler completion via postMessage"),G()}),typeof MutationObserver>"u")return;let Z=new MutationObserver((R)=>{for(let $ of R)for(let Y of $.addedNodes){if(Y.nodeType!==1)continue;if(x(Y))J(Y);if(Y.querySelectorAll)Y.querySelectorAll('iframe[src*="meetings.hubspot.com"]').forEach(J);if(l(Y)){W("Detected scheduler completion via DOM mutation"),G(),Z.disconnect();return}}});Z.observe(z,{childList:!0,subtree:!0})}function w(q,z){let G=O[z]||O.under_100k,J=new URL(G.url);J.searchParams.set("embed","true");let Z=q.partnerstack_click_id||q.ps_xid||q["0-1/partnerstack_click_id"]||q["0-2/partnerstack_click_id"];if(Z)J.searchParams.set("partnerstack_click_id",Z),W("Adding PartnerStack click id",Z);return Object.entries({email:["email","email_address","0-1/email","0-2/email"],firstname:["firstname","first_name","fname","0-1/firstname","0-2/firstname"],lastname:["lastname","last_name","lname","0-1/lastname","0-2/lastname"],company:["company","practice_name","business_name","0-1/company","0-2/company"],phone:["phone","phone_number","telephone","0-1/phone","0-2/phone"]}).forEach(([X,j])=>{for(let V of j)if(q[V]){J.searchParams.set(X,q[V]),W(`Mapping ${V} -> ${X}: ${q[V]}`);break}}),["is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_","what_best_describes_your_practice_","referrer","submissionGuid","uuid","partnerstack_click_id"].forEach((X)=>{if(q[X])J.searchParams.set(X,q[X]),W(`Adding additional field: ${X} = ${q[X]}`);else{let j=[`0-1/${X}`,`0-2/${X}`];for(let V of j)if(q[V]){J.searchParams.set(X,q[V]),W(`Adding prefixed field: ${V} -> ${X} = ${q[V]}`);break}}}),["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach((X)=>{if(q[X])J.searchParams.set(X,q[X])}),W("Built scheduler URL:",J.toString()),J.toString()}function T(q){try{if(window.location.hostname.includes("joinheard.com")){if(typeof rdt==="function")rdt("track","Lead");if(typeof fbq==="function")fbq("track","Lead")}if(typeof gtag<"u")gtag("event","generate_lead",{event_category:"engagement",event_label:q||"unknown"});else if(typeof ga<"u")ga("send","event","Lead","Generate",q||"unknown");if(typeof window.posthog<"u")window.posthog.capture("scheduler_lead_generated",{scheduler_type:q||"unknown",source:"webflow_complete"});if(typeof window.amplitude<"u")window.amplitude.track("scheduler_lead_generated",{scheduler_type:q||"unknown",source:"webflow_complete"});W("Lead events fired")}catch(z){W("Lead tracking error:",z)}}function k(){W("Starting scheduler setup...");let q=S(),z=B(),G={...q};if(z&&z.formData)G={...G,...z.formData},W("Merged form data from storage:",G);let J=C(z,G);if(!(G.email||G.firstname||G.first_name||G["0-1/email"]||G["0-1/firstname"]||G["0-2/email"]||G["0-2/firstname"]||Object.keys(G).some((X)=>X!=="debug"&&X!=="utm_source"&&X!=="utm_medium"&&X!=="utm_campaign"&&!X.startsWith("group[")&&G[X]))){W("No form data found, redirecting to /free-consult"),window.location.href="/free-consult";return}W("Form data found, setting up scheduler");let R=document.getElementById("scheduler-target");if(!R){let X=document.querySelector('iframe[src*="meetings.hubspot.com"]'),j=document.querySelector(".meetings-iframe-container");if(X||j){W("Found existing iframe/container, will enhance it");let V=document.createElement("div");if(V.id="scheduler-target",j)j.parentNode.insertBefore(V,j),V.appendChild(j);else if(X)X.parentNode.insertBefore(V,X),V.appendChild(X);R=V}}if(!R)W("No target found, creating scheduler-target div"),R=document.createElement("div"),R.id="scheduler-target",R.style.cssText="min-height: 600px; width: 100%;",document.body.appendChild(R);let $=w(G,J);W("Injecting scheduler into target"),W("Final URL:",$),R.innerHTML=`<div class="meetings-iframe-container" data-src="${$}"></div>`;let Y=document.createElement("script");return Y.src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js",Y.onload=function(){W("HubSpot embed script loaded successfully"),T(J)},Y.onerror=function(){console.error("[Webflow Scheduler] Failed to load HubSpot embed script")},document.head.appendChild(Y),s(G,R),!0}function d(){if(!U)return;let q=document.createElement("div");q.style.cssText=`
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
      ${C(z,S())}<br><br>
      <strong>Action:</strong><br>
      ${z||G.toString()?"✅ Loading scheduler":"❌ Will redirect to /free-consult"}
    `,document.body.appendChild(q);let J=!1,Z={x:0,y:0};q.addEventListener("mousedown",(R)=>{J=!0,Z.x=R.clientX-q.offsetLeft,Z.y=R.clientY-q.offsetTop}),document.addEventListener("mousemove",(R)=>{if(J)q.style.left=R.clientX-Z.x+"px",q.style.top=R.clientY-Z.y+"px",q.style.right="auto"}),document.addEventListener("mouseup",()=>{J=!1})}function H(){W("Webflow Scheduler Complete initializing..."),d(),k(),W("Webflow Scheduler Complete initialized")}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",H);else H();if(U)window.WebflowSchedulerComplete={getStoredFormData:B,getQueryParams:S,buildSchedulerUrl:w,handleScheduler:k,renderHdyhauForm:v,fireLeadEvents:T,resolveSchedulerType:C,init:H,config:O};W("Webflow Scheduler Complete script loaded")})();
