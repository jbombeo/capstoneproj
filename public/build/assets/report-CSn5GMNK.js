import{u as D,r as p,j as e,H as N,b as u}from"./app-D5QSazoS.js";import{A as T}from"./app-layout-BvuQLD4e.js";import{d as C}from"./index-CDy59-5j.js";import{T as k,a as A,b as o,c as a,d as M,e as r}from"./table-DdWGkZcv.js";import{B as m}from"./button-CHV5NfL8.js";import{I as g}from"./input-DB1EIm44.js";import{L as f}from"./label-R0t4oIjz.js";import{s as _}from"./index-ikzcNs2d.js";import"./app-D3Labj3k.js";import"./utils-CWJKhSfy.js";import"./clsx-B-dksMZM.js";import"./index-DdBxpzh2.js";import"./index-DsN0KlVt.js";import"./index-D4AHuzPF.js";import"./index-B1HdV33c.js";import"./x-DXvnSYwc.js";import"./createLucideIcon-Cp3Xun1Q.js";import"./index-B2jBiQ_B.js";import"./chevron-down-Chw5u0Za.js";import"./index-Cdq71Mab.js";import"./log-out-h8hjAnQZ.js";import"./users-B1alu9Tv.js";import"./map-pin-DSIHRW63.js";import"./file-text-KyAsM3U-.js";import"./clipboard-list-CoGPVvzg.js";import"./settings-BBcYwnFq.js";import"./index-CMWG4mbA.js";const S=[{title:"Revenues Report",href:C().url}];function ne(){const{revenues:l,minDate:b,maxDate:j}=D().props,[s,x]=p.useState(b||""),[n,h]=p.useState(j||""),d=p.useRef(null),v=()=>{u.get(_("report.revenues"),{min_date:s,max_date:n},{preserveState:!0,preserveScroll:!0})},R=()=>{x(""),h(""),u.get(_("report.revenues"))},y=()=>{if(!d.current)return;const t="/images/logo.png",c=s||n?`Date Range: ${s||"Any"} to ${n||"Any"}`:"All Records",i=window.open("","_blank");i&&(i.document.write(`
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
              <h2>${c}</h2>
          </div>

          ${d.current.innerHTML}

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
    `),i.document.close(),i.focus(),i.print())},w=l.reduce((t,c)=>t+Number(c.amount||0),0);return e.jsxs(T,{breadcrumbs:S,children:[e.jsx(N,{title:"Revenues Report"}),e.jsx("div",{className:"flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6",children:e.jsx("h1",{className:"text-3xl font-bold",children:"Barangay Revenues Report"})}),e.jsxs("div",{className:"flex flex-col md:flex-row items-end gap-4 mb-6 border p-4 bg-gray-50 rounded-lg",children:[e.jsxs("div",{className:"flex gap-4 flex-1",children:[e.jsxs("div",{children:[e.jsx(f,{children:"Minimum Date"}),e.jsx(g,{type:"date",value:s,onChange:t=>x(t.target.value)})]}),e.jsxs("div",{children:[e.jsx(f,{children:"Maximum Date"}),e.jsx(g,{type:"date",value:n,onChange:t=>h(t.target.value)})]}),e.jsx(m,{variant:"outline",onClick:v,children:"Filter"}),e.jsx(m,{variant:"outline",onClick:R,children:"Reset"})]}),e.jsx(m,{onClick:y,variant:"outline",className:"border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",children:"Print Document"})]}),e.jsx("div",{ref:d,className:"overflow-x-auto rounded-lg border p-4 bg-white shadow-md",children:e.jsxs(k,{children:[e.jsx(A,{children:e.jsxs(o,{children:[e.jsx(a,{children:"Date"}),e.jsx(a,{children:"Recipient"}),e.jsx(a,{children:"Details"}),e.jsx(a,{children:"Amount"}),e.jsx(a,{children:"User"})]})}),e.jsx(M,{children:l.length?e.jsxs(e.Fragment,{children:[l.map(t=>e.jsxs(o,{children:[e.jsx(r,{children:t.date}),e.jsx(r,{children:t.recipient}),e.jsx(r,{children:t.details}),e.jsxs(r,{children:["₱ ",Number(t.amount).toFixed(2)]}),e.jsx(r,{children:t.user})]},t.id)),e.jsxs(o,{className:"bg-gray-200 font-semibold",children:[e.jsx(r,{colSpan:3}),e.jsxs(r,{children:["₱ ",Number(w).toFixed(2)]}),e.jsx(r,{children:"Total"})]})]}):e.jsx(o,{children:e.jsx(r,{colSpan:5,className:"text-center py-4 text-gray-500",children:"No records found"})})})]})})]})}export{ne as default};
