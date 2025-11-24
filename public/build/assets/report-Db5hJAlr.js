import{u as F,r as o,j as e,H as M,b as u}from"./app-_wj1wiEc.js";import{A as B}from"./app-layout-BSN3Q_UY.js";import{d as E}from"./index-CDy59-5j.js";import{T as H,a as $,b as d,c as l,d as z,e as r}from"./table-55CpEnKH.js";import{B as g}from"./button-HZSfloRH.js";import{I as b}from"./input-CaSbsQoB.js";import{L as j}from"./label-DuuBaXdl.js";import"./app-DgE45SX0.js";import"./utils-csTuJWuA.js";import"./clsx-B-dksMZM.js";import"./index-DVkLe2dy.js";import"./index-DlLLoGOC.js";import"./index-Dl6FYVux.js";import"./index-CObx42Nt.js";import"./x-cF_pgnf8.js";import"./createLucideIcon-Dk2zpREm.js";import"./index-BRMnPjnz.js";import"./chevron-down-Ciywszaj.js";import"./index-CRvzyME4.js";import"./log-out-CytyyNiJ.js";import"./users-CzPkGoWA.js";import"./map-pin-K0z2MPXY.js";import"./file-text-ZNTU_lRQ.js";import"./clipboard-list-iHk9S1ba.js";import"./settings-B87Gxw1-.js";import"./index-CMWG4mbA.js";const I=[{title:"Revenues Report",href:E().url}];function me(){const{revenues:c,minDate:v,maxDate:y,sort:R,direction:w}=F().props,[i,_]=o.useState(v||""),[a,f]=o.useState(y||""),[p,D]=o.useState(R||"date"),[m,S]=o.useState(w||"asc"),x=o.useRef(null),h="/report/revenues",N=t=>{const s=p===t&&m==="asc"?"desc":"asc";D(t),S(s),u.get(h,{min_date:i,max_date:a,sort:t,direction:s},{preserveScroll:!0,preserveState:!1})},T=()=>{u.get(h,{min_date:i,max_date:a,sort:p,direction:m},{preserveScroll:!0,preserveState:!1})},C=()=>{_(""),f(""),u.get(h,{},{preserveState:!1})},k=()=>{if(!x.current)return;const t="/images/logo.png",s=i||a?`Date Range: ${i||"Any"} to ${a||"Any"}`:"All Records",n=window.open("","_blank");n&&(n.document.write(`
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
    `),n.document.close(),n.focus(),n.print())},A=c.reduce((t,s)=>t+Number(s.amount||0),0);return e.jsxs(B,{breadcrumbs:I,children:[e.jsx(M,{title:"Revenues Report"}),e.jsx("div",{className:"flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6",children:e.jsx("h1",{className:"text-3xl font-bold",children:"Barangay Revenues Report"})}),e.jsxs("div",{className:"flex flex-col md:flex-row items-end gap-4 mb-6 border p-4 bg-gray-50 rounded-lg",children:[e.jsxs("div",{className:"flex gap-4 flex-1",children:[e.jsxs("div",{children:[e.jsx(j,{children:"Minimum Date"}),e.jsx(b,{type:"date",value:i,onChange:t=>_(t.target.value)})]}),e.jsxs("div",{children:[e.jsx(j,{children:"Maximum Date"}),e.jsx(b,{type:"date",value:a,onChange:t=>f(t.target.value)})]}),e.jsx(g,{variant:"outline",onClick:T,children:"Filter"}),e.jsx(g,{variant:"outline",onClick:C,children:"Reset"})]}),e.jsx(g,{onClick:k,variant:"outline",className:"border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",children:"Print Document"})]}),e.jsx("div",{ref:x,className:"overflow-x-auto rounded-lg border p-4 bg-white shadow-md",children:e.jsxs(H,{children:[e.jsx($,{children:e.jsxs(d,{children:[e.jsxs(l,{className:"cursor-pointer select-none",onClick:()=>N("date"),children:["Date ",p==="date"?m==="asc"?"▲":"▼":""]}),e.jsx(l,{children:"Recipient"}),e.jsx(l,{children:"Details"}),e.jsx(l,{children:"Amount"}),e.jsx(l,{children:"Payment Method"})]})}),e.jsx(z,{children:c.length?e.jsxs(e.Fragment,{children:[c.map(t=>e.jsxs(d,{children:[e.jsx(r,{children:t.date}),e.jsx(r,{children:t.recipient}),e.jsx(r,{children:t.details}),e.jsxs(r,{children:["₱ ",Number(t.amount).toFixed(2)]}),e.jsx(r,{children:t.payment_method})]},t.id)),e.jsxs(d,{className:"bg-gray-200 font-semibold",children:[e.jsx(r,{colSpan:3}),e.jsxs(r,{children:["₱ ",Number(A).toFixed(2)]}),e.jsx(r,{children:"Total"})]})]}):e.jsx(d,{children:e.jsx(r,{colSpan:5,className:"text-center py-4 text-gray-500",children:"No records found"})})})]})})]})}export{me as default};
