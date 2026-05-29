(function(){let M=window.location.search.includes("debug=true");function W(...q){if(M)console.log("[Webflow Scheduler]",...q)}let O={over_100k:{url:"https://meetings.hubspot.com/bz/consultation",name:"Consultation Scheduler",description:"Revenue over $100k"},under_100k:{url:"https://meetings.hubspot.com/bz/consultations",name:"Consultations Scheduler",description:"Revenue under $100k or not provided"}},L={portalId:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.portalId||"7507639",formId:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.formId||window.HDYHAU_FORM_ID||"2abfe31d-49b3-433d-9776-4ff663f8c0b9",sourcePropertyName:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.sourcePropertyName||"how_did_you_hear_about_us",otherPropertyName:window.HDYHAU_CONFIG&&window.HDYHAU_CONFIG.otherPropertyName||"hdyhau_other_text"},F=["Search engine","Social media","Reddit","AI research","Podcast","Blog, article, or news","Influencer or content creator","Postcard or mailer","Professional association","Therapy platform or tools","Friend, family, or colleague","Billboard"],b=!1,U=!1;function w(){try{let q=sessionStorage.getItem("scheduler_router_data");if(q){let z=JSON.parse(q);return W("Found router data in sessionStorage:",z),sessionStorage.removeItem("scheduler_router_data"),{formData:z.formData,schedulerType:z.scheduler_type,source:"sessionStorage"}}}catch(q){W("sessionStorage error:",q)}try{let q=localStorage.getItem("hubspot_form_data");if(q){let z=JSON.parse(q);return W("Found form data in localStorage:",z),{formData:z,source:"localStorage"}}}catch(q){W("localStorage error:",q)}try{let q=(J)=>{let X=`; ${document.cookie}`.split(`; ${J}=`);if(X.length===2)return X.pop().split(";").shift()},z=q("scheduler_type"),G=q("form_data");if(z||G){let J=G?JSON.parse(atob(G)):{};return document.cookie="scheduler_type=; path=/; max-age=0",document.cookie="form_data=; path=/; max-age=0",W("Found data in cookies:",{schedulerType:z,formData:J}),{formData:J,schedulerType:z,source:"cookies"}}}catch(q){W("cookie error:",q)}return null}function B(){let q={},z=new URLSearchParams(window.location.search);for(let[G,J]of z)q[G]=J;return q}function C(q,z){if(q&&q.schedulerType)return q.schedulerType;if(q&&q.formData&&q.formData.scheduler_type)return q.formData.scheduler_type;if(z&&z.scheduler_type)return z.scheduler_type;return"under_100k"}function N(){try{let q=document.cookie.match(/(?:^|; )hubspotutk=([^;]*)/);return q?decodeURIComponent(q[1]):""}catch(q){return W("HubSpot cookie lookup error:",q),""}}function y(q){if(!q)return"";let z=["email","email_address","0-1/email","0-2/email"];for(let G of z)if(q[G])return String(q[G]).trim();return""}function c(q){let z=[...q];for(let G=z.length-1;G>0;G-=1){let J=Math.floor(Math.random()*(G+1));[z[G],z[J]]=[z[J],z[G]]}return[...z,"Other"]}function I(q){return String(q).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function h(){if(!L.formId)return"";return"https://api.hsforms.com/submissions/v3/integration/submit/"+L.portalId+"/"+L.formId}function g(q,z,G){let J=h();if(!J)return Promise.reject(Error("Missing HDYHAU HubSpot form ID"));let $=[{name:"email",value:q},{name:L.sourcePropertyName,value:z}];if(G)$.push({name:L.otherPropertyName,value:G});let X={fields:$,context:{pageUri:window.location.href,pageName:document.title||"Schedule Confirmation"}},Z=N();if(Z)X.context.hutk=Z;return fetch(J,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(X),keepalive:!0}).then((Y)=>{if(!Y.ok)throw Error(`HubSpot HDYHAU submission failed: ${Y.status}`);return Y})}function p(){if(document.getElementById("hdyhau-styles"))return;let q=document.createElement("style");q.id="hdyhau-styles",q.textContent=`
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
    `,document.head.appendChild(q)}function P(q,z){if(b||U)return;let G=y(q);if(!G){W("Skipping HDYHAU form because no contact email was found");return}b=!0,p();let J=document.createElement("div");J.id="hdyhau-modal",J.className="hdyhau-modal",J.setAttribute("role","dialog"),J.setAttribute("aria-modal","true"),J.setAttribute("aria-labelledby","hdyhau-question-label");let $=document.createElement("div");$.className="hdyhau-dialog";let X=document.createElement("button");X.className="hdyhau-close",X.type="button",X.setAttribute("aria-label","Close"),X.textContent="×";let Z=document.createElement("form");Z.id="hdyhau-form",Z.className="hdyhau-form",Z.noValidate=!0;let Y=c(F).map((V,K)=>{let j=`hdyhau-option-${K}`;return`
          <label class="hdyhau-option" for="${j}">
            <input
              id="${j}"
              name="hdyhau_source"
              type="radio"
              value="${I(V)}"
              required
            >
            <span>${I(V)}</span>
          </label>
        `}).join("");Z.innerHTML=`
      <input type="hidden" name="email" value="${I(G)}">
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
    `,$.appendChild(X),$.appendChild(Z),J.appendChild($),document.body.appendChild(J);let R=Z.querySelector(".hdyhau-submit"),_=Z.querySelector(".hdyhau-other-field"),A=Z.querySelector("#hdyhau-other-text"),Q=Z.querySelector(".hdyhau-status"),H=document.activeElement;function k(V){if(V.key==="Escape"&&document.body.contains(J))E()}function E(){if(J.hidden=!0,J.remove(),document.removeEventListener("keydown",k),H&&typeof H.focus==="function")H.focus()}X.addEventListener("click",E),J.addEventListener("click",(V)=>{if(V.target===J)E()}),document.addEventListener("keydown",k),X.focus(),Z.addEventListener("change",()=>{let V=Z.querySelector('input[name="hdyhau_source"]:checked'),K=!!V,j=V&&V.value==="Other";if(R.disabled=!K||U,_.hidden=!j,!j)A.value=""}),Z.addEventListener("submit",(V)=>{V.preventDefault();let K=Z.querySelector('input[name="hdyhau_source"]:checked');if(!K||U)return;R.disabled=!0,Q.dataset.state="",Q.textContent="",g(G,K.value,A.value.trim()).then(()=>{U=!0,Z.querySelectorAll("input, button").forEach((j)=>j.disabled=!0),Q.textContent="Thanks!",setTimeout(E,1200),W("HDYHAU response submitted")}).catch((j)=>{R.disabled=!1,Q.dataset.state="error",Q.textContent="Please try again.",W("HDYHAU submission error:",j)})}),W("HDYHAU form rendered")}function u(q){try{let z=new URL(q).hostname;return z.endsWith("hubspot.com")||z.endsWith("hsforms.com")||z.endsWith("hsforms.net")||z.endsWith("hsappstatic.net")||z.includes("hubspot")||z.includes("hsforms")}catch(z){return!1}}function D(q){let G=(typeof q==="string"?q:q?JSON.stringify(q):"").toLowerCase();return G.includes("meetingbooksucceeded")||G.includes("hsmeetingsbooksucceeded")||G.includes("meeting_booked")||G.includes("meetingbooked")||G.includes("meeting booked")||G.includes("booking confirmed")||G.includes("meeting scheduled")}function n(q){let z=(q.textContent||q.innerText||"").toLowerCase();return z.includes("booked")||z.includes("scheduled")||z.includes("confirmed")||z.includes("you are all set")||z.includes("you're all set")}function i(q,z){if(!z)return;let G=()=>P(q,z);if(window.addEventListener("message",($)=>{if(!u($.origin))return;if(D($.data))W("Detected scheduler completion via postMessage"),G()}),typeof MutationObserver>"u")return;let J=new MutationObserver(($)=>{for(let X of $)for(let Z of X.addedNodes){if(Z.nodeType!==1)continue;if(n(Z)){W("Detected scheduler completion via DOM mutation"),G(),J.disconnect();return}}});J.observe(z,{childList:!0,subtree:!0})}function v(q,z){let G=O[z]||O.under_100k,J=new URL(G.url);J.searchParams.set("embed","true");let $=q.partnerstack_click_id||q.ps_xid||q["0-1/partnerstack_click_id"]||q["0-2/partnerstack_click_id"];if($)J.searchParams.set("partnerstack_click_id",$),W("Adding PartnerStack click id",$);return Object.entries({email:["email","email_address","0-1/email","0-2/email"],firstname:["firstname","first_name","fname","0-1/firstname","0-2/firstname"],lastname:["lastname","last_name","lname","0-1/lastname","0-2/lastname"],company:["company","practice_name","business_name","0-1/company","0-2/company"],phone:["phone","phone_number","telephone","0-1/phone","0-2/phone"]}).forEach(([R,_])=>{for(let A of _)if(q[A]){J.searchParams.set(R,q[A]),W(`Mapping ${A} -> ${R}: ${q[A]}`);break}}),["is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_","what_best_describes_your_practice_","referrer","submissionGuid","uuid","partnerstack_click_id"].forEach((R)=>{if(q[R])J.searchParams.set(R,q[R]),W(`Adding additional field: ${R} = ${q[R]}`);else{let _=[`0-1/${R}`,`0-2/${R}`];for(let A of _)if(q[A]){J.searchParams.set(R,q[A]),W(`Adding prefixed field: ${A} -> ${R} = ${q[A]}`);break}}}),["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach((R)=>{if(q[R])J.searchParams.set(R,q[R])}),W("Built scheduler URL:",J.toString()),J.toString()}function x(q){try{if(window.location.hostname.includes("joinheard.com")){if(typeof rdt==="function")rdt("track","Lead");if(typeof fbq==="function")fbq("track","Lead")}if(typeof gtag<"u")gtag("event","generate_lead",{event_category:"engagement",event_label:q||"unknown"});else if(typeof ga<"u")ga("send","event","Lead","Generate",q||"unknown");if(typeof window.posthog<"u")window.posthog.capture("scheduler_lead_generated",{scheduler_type:q||"unknown",source:"webflow_complete"});if(typeof window.amplitude<"u")window.amplitude.track("scheduler_lead_generated",{scheduler_type:q||"unknown",source:"webflow_complete"});W("Lead events fired")}catch(z){W("Lead tracking error:",z)}}function T(){W("Starting scheduler setup...");let q=B(),z=w(),G={...q};if(z&&z.formData)G={...G,...z.formData},W("Merged form data from storage:",G);let J=C(z,G);if(!(G.email||G.firstname||G.first_name||G["0-1/email"]||G["0-1/firstname"]||G["0-2/email"]||G["0-2/firstname"]||Object.keys(G).some((R)=>R!=="debug"&&R!=="utm_source"&&R!=="utm_medium"&&R!=="utm_campaign"&&!R.startsWith("group[")&&G[R]))){W("No form data found, redirecting to /free-consult"),window.location.href="/free-consult";return}W("Form data found, setting up scheduler");let X=document.getElementById("scheduler-target");if(!X){let R=document.querySelector('iframe[src*="meetings.hubspot.com"]'),_=document.querySelector(".meetings-iframe-container");if(R||_){W("Found existing iframe/container, will enhance it");let A=document.createElement("div");if(A.id="scheduler-target",_)_.parentNode.insertBefore(A,_),A.appendChild(_);else if(R)R.parentNode.insertBefore(A,R),A.appendChild(R);X=A}}if(!X)W("No target found, creating scheduler-target div"),X=document.createElement("div"),X.id="scheduler-target",X.style.cssText="min-height: 600px; width: 100%;",document.body.appendChild(X);let Z=v(G,J);W("Injecting scheduler into target"),W("Final URL:",Z),X.innerHTML=`<div class="meetings-iframe-container" data-src="${Z}"></div>`;let Y=document.createElement("script");return Y.src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js",Y.onload=function(){W("HubSpot embed script loaded successfully"),x(J)},Y.onerror=function(){console.error("[Webflow Scheduler] Failed to load HubSpot embed script")},document.head.appendChild(Y),i(G,X),!0}function f(){if(!M)return;let q=document.createElement("div");q.style.cssText=`
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
    `;let z=w(),G=new URLSearchParams(window.location.search);q.innerHTML=`
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
      ${C(z,B())}<br><br>
      <strong>Action:</strong><br>
      ${z||G.toString()?"✅ Loading scheduler":"❌ Will redirect to /free-consult"}
    `,document.body.appendChild(q);let J=!1,$={x:0,y:0};q.addEventListener("mousedown",(X)=>{J=!0,$.x=X.clientX-q.offsetLeft,$.y=X.clientY-q.offsetTop}),document.addEventListener("mousemove",(X)=>{if(J)q.style.left=X.clientX-$.x+"px",q.style.top=X.clientY-$.y+"px",q.style.right="auto"}),document.addEventListener("mouseup",()=>{J=!1})}function S(){W("Webflow Scheduler Complete initializing..."),f(),T(),W("Webflow Scheduler Complete initialized")}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",S);else S();if(M)window.WebflowSchedulerComplete={getStoredFormData:w,getQueryParams:B,buildSchedulerUrl:v,handleScheduler:T,renderHdyhauForm:P,fireLeadEvents:x,resolveSchedulerType:C,init:S,config:O};W("Webflow Scheduler Complete script loaded")})();
