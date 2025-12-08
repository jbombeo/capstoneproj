import{u as F,r as n,j as e,H as M,b as u}from"./app-CHrjJv7C.js";import{A as B}from"./app-layout-DCiK010d.js";import{d as E}from"./index-CDy59-5j.js";import{T as H,a as $,b as d,c as l,d as z,e as r}from"./table-CESz-7Pl.js";import{B as g}from"./button-B2odc3Mr.js";import{I as f}from"./input-CCRLN5kg.js";import{L as j}from"./label-BH76Topx.js";import"./app-B1aFYef8.js";import"./utils-DpkqiH3w.js";import"./clsx-B-dksMZM.js";import"./index-4up-H-0J.js";import"./index-DCA_c2uc.js";import"./index-C-wBWVm_.js";import"./index-5g6cmtIN.js";import"./x-6MjSoi9b.js";import"./createLucideIcon-r-04NXR0.js";import"./index-BmrMFvkv.js";import"./chevron-down-Dus9dkDx.js";import"./index-BBMhhFRK.js";import"./log-out-yjwyG8Ps.js";import"./users-sN_XFzBw.js";import"./map-pin-BOfusBn5.js";import"./file-text-Dy-rehNU.js";import"./clipboard-list-CeYPJHW-.js";import"./settings-DA-kq5U4.js";import"./index-CMWG4mbA.js";const I=[{title:"Revenues Report",href:E().url}];function me(){const{revenues:c,minDate:v,maxDate:R,sort:y,direction:w}=F().props,[a,_]=n.useState(v||""),[i,b]=n.useState(R||""),[p,D]=n.useState(y||"date"),[m,S]=n.useState(w||"asc"),x=n.useRef(null),h="/report/revenues",N=t=>{const s=p===t&&m==="asc"?"desc":"asc";D(t),S(s),u.get(h,{min_date:a,max_date:i,sort:t,direction:s},{preserveScroll:!0,preserveState:!1})},T=()=>{u.get(h,{min_date:a,max_date:i,sort:p,direction:m},{preserveScroll:!0,preserveState:!1})},C=()=>{_(""),b(""),u.get(h,{},{preserveState:!1})},k=()=>{if(!x.current)return;const t="/images/logo.png",s=a||i?`Date Range: ${a||"Any"} to ${i||"Any"}`:"All Records",o=window.open("","_blank");o&&(o.document.write(`
      <html>
      <head>
          <title>Revenue Report</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  color: #000;
              }
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .header img {
                  width: 90px;
                  height: 90px;
                  margin-bottom: 10px;
              }
              h1 {
                  margin: 0;
                  font-size: 22px;
              }
              h2 {
                  margin-top: 5px;
                  font-size: 16px;
                  color: #444;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
              }
              th, td {
                  border: 1px solid #000;
                  padding: 8px;
                  font-size: 14px;
              }
              th {
                  background: #f0f0f0;
                  font-weight: bold;
              }
              .footer-section {
                  margin-top: 50px;
                  display: flex;
                  justify-content: space-between;
                  padding: 0 40px;
              }
              .signature-block {
                  text-align: center;
              }
              .certified {
                  margin-top: 40px;
                  text-align: left;
                  font-size: 14px;
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <img src="${t}" />
              <h1>Barangay Official Revenues Report</h1>
              <h2>${s}</h2>
          </div>

          ${x.current.innerHTML}

          <p class="certified">CERTIFIED CORRECT:</p>

          <div class="footer-section">
              <div class="signature-block">
                  <p>______________________</p>
                  <p>Barangay Captain</p>
              </div>
              <div class="signature-block">
                  <p>______________________</p>
                  <p>Secretary</p>
              </div>
          </div>
      </body>
      </html>
    `),o.document.close(),o.focus(),o.print())},A=c.reduce((t,s)=>t+Number(s.amount||0),0);return e.jsxs(B,{breadcrumbs:I,children:[e.jsx(M,{title:"Revenues Report"}),e.jsx("div",{className:"mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl",children:e.jsx("h1",{className:"text-3xl font-bold",children:"Barangay Revenues Report"})}),e.jsxs("div",{className:"flex flex-col md:flex-row items-end gap-4 mb-6 border p-4 bg-gray-50 rounded-lg",children:[e.jsxs("div",{className:"flex gap-4 flex-1",children:[e.jsxs("div",{children:[e.jsx(j,{children:"Minimum Date"}),e.jsx(f,{type:"date",value:a,onChange:t=>_(t.target.value)})]}),e.jsxs("div",{children:[e.jsx(j,{children:"Maximum Date"}),e.jsx(f,{type:"date",value:i,onChange:t=>b(t.target.value)})]}),e.jsx(g,{variant:"outline",onClick:T,children:"Filter"}),e.jsx(g,{variant:"outline",onClick:C,children:"Reset"})]}),e.jsx(g,{onClick:k,variant:"outline",className:"border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",children:"Print Document"})]}),e.jsx("div",{ref:x,className:"overflow-x-auto rounded-lg border p-4 bg-white shadow-md",children:e.jsxs(H,{children:[e.jsx($,{children:e.jsxs(d,{children:[e.jsxs(l,{className:"cursor-pointer select-none",onClick:()=>N("date"),children:["Date ",p==="date"?m==="asc"?"▲":"▼":""]}),e.jsx(l,{children:"Recipient"}),e.jsx(l,{children:"Details"}),e.jsx(l,{children:"Amount"}),e.jsx(l,{children:"Payment Method"})]})}),e.jsx(z,{children:c.length?e.jsxs(e.Fragment,{children:[c.map(t=>e.jsxs(d,{children:[e.jsx(r,{children:t.date}),e.jsx(r,{children:t.recipient}),e.jsx(r,{children:t.details}),e.jsxs(r,{children:["₱ ",Number(t.amount).toFixed(2)]}),e.jsx(r,{children:t.payment_method})]},t.id)),e.jsxs(d,{className:"bg-gray-200 font-semibold",children:[e.jsx(r,{colSpan:3}),e.jsxs(r,{children:["₱ ",Number(A).toFixed(2)]}),e.jsx(r,{children:"Total"})]})]}):e.jsx(d,{children:e.jsx(r,{colSpan:5,className:"text-center py-4 text-gray-500",children:"No records found"})})})]})})]})}export{me as default};
