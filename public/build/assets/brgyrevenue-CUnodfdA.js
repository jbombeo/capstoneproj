import{u as D,r as m,j as e,H as T,b as g}from"./app-D5QSazoS.js";import{A as B}from"./app-layout-BvuQLD4e.js";import{d as M}from"./index-CDy59-5j.js";import{T as C,a as A,b as n,c as s,d as H,e as a}from"./table-DdWGkZcv.js";import{B as c}from"./button-CHV5NfL8.js";import{I as b}from"./input-DB1EIm44.js";import{L as h}from"./label-R0t4oIjz.js";import{s as u}from"./index-ikzcNs2d.js";import"./app-D3Labj3k.js";import"./utils-CWJKhSfy.js";import"./clsx-B-dksMZM.js";import"./index-DdBxpzh2.js";import"./index-DsN0KlVt.js";import"./index-D4AHuzPF.js";import"./index-B1HdV33c.js";import"./x-DXvnSYwc.js";import"./createLucideIcon-Cp3Xun1Q.js";import"./index-B2jBiQ_B.js";import"./chevron-down-Chw5u0Za.js";import"./index-Cdq71Mab.js";import"./log-out-h8hjAnQZ.js";import"./users-B1alu9Tv.js";import"./map-pin-DSIHRW63.js";import"./file-text-KyAsM3U-.js";import"./clipboard-list-CoGPVvzg.js";import"./settings-BBcYwnFq.js";import"./index-CMWG4mbA.js";const L=[{title:"Barangay Revenues",href:M().url}];function ne(){const{revenues:l,minDate:y,maxDate:f}=D().props,[o,x]=m.useState(y||""),[i,p]=m.useState(f||""),d=m.useRef(null),_=()=>{g.get(u("report.revenues"),{min_date:o,max_date:i},{preserveState:!0,preserveScroll:!0})},j=()=>{x(""),p(""),g.get(u("report.revenues"))},v=()=>{if(!d.current)return;const r="/images/logo.png",t=o||i?`Date Range: ${o||"Any"} to ${i||"Any"}`:"All Records",w=d.current.innerHTML,R=document.body.innerHTML;document.body.innerHTML=`
      <html>
        <head>
          <title>Barangay Revenues</title>
          <style>
            @media print {
              body { font-family: Arial, sans-serif; margin: 0; padding: 30px; }
              .header { text-align: center; margin-bottom: 20px; }
              .header img { width: 80px; height: 80px; margin-bottom: 10px; }
              h1 { font-size: 24px; margin-bottom: 5px; }
              h2 { font-size: 18px; margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #000; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; }
              th { background-color: #f3f3f3; }
              .footer { margin-top: 50px; display: flex; justify-content: space-between; }
              .signature { text-align: center; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${r}" alt="Barangay Logo" />
            <h1>Barangay Official Revenues Report</h1>
            <h2>${t}</h2>
          </div>
          ${w}
          <div class="footer">
            <div class="signature">
              <p>_____________________</p>
              <p>Barangay Captain</p>
            </div>
            <div class="signature">
              <p>_____________________</p>
              <p>Secretary</p>
            </div>
          </div>
        </body>
      </html>
    `,window.print(),document.body.innerHTML=R,window.location.reload()},N=l.reduce((r,t)=>r+t.amount,0);return e.jsxs(B,{breadcrumbs:L,children:[e.jsx(T,{title:"Barangay Revenues"}),e.jsx("div",{className:"flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6 border-0 border-blue-700",children:e.jsx("h1",{className:"text-3xl font-bold",children:"Barangay Revenues"})}),e.jsxs("div",{className:"flex flex-col md:flex-row items-end gap-4 mb-6 border border-gray-300 rounded-lg p-4 bg-gray-50",children:[e.jsxs("div",{className:"flex flex-col md:flex-row items-end gap-4 flex-1",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx(h,{htmlFor:"minDate",className:"mb-1 text-gray-700 font-medium",children:"Minimum Date"}),e.jsx(b,{type:"date",id:"minDate",value:o,onChange:r=>x(r.target.value)})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx(h,{htmlFor:"maxDate",className:"mb-1 text-gray-700 font-medium",children:"Maximum Date"}),e.jsx(b,{type:"date",id:"maxDate",value:i,onChange:r=>p(r.target.value)})]}),e.jsx(c,{variant:"outline",onClick:_,children:"Filter"}),e.jsx(c,{variant:"outline",onClick:j,children:"Reset"})]}),e.jsx("div",{className:"mt-2 md:mt-0",children:e.jsx(c,{onClick:v,variant:"outline",className:"border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors",children:"Print Document"})})]}),e.jsx("div",{ref:d,className:"overflow-x-auto rounded-lg border border-gray-300 shadow-md p-4 bg-white",children:e.jsxs(C,{className:"min-w-full divide-y divide-gray-200 border border-gray-300",children:[e.jsx(A,{className:"bg-gray-50 sticky top-0 z-10 border-b border-gray-300",children:e.jsxs(n,{children:[e.jsx(s,{className:"text-gray-700 border-r border-gray-300",children:"Date"}),e.jsx(s,{className:"text-gray-700 border-r border-gray-300",children:"Recipient"}),e.jsx(s,{className:"text-gray-700 border-r border-gray-300",children:"Details"}),e.jsx(s,{className:"text-gray-700 border-r border-gray-300",children:"Amount"}),e.jsx(s,{className:"text-gray-700",children:"User"})]})}),e.jsx(H,{children:l.length>0?e.jsxs(e.Fragment,{children:[l.map((r,t)=>e.jsxs(n,{className:`transition-shadow hover:shadow-md border-b border-gray-200 ${t%2===0?"bg-gray-50":"bg-white"}`,children:[e.jsx(a,{className:"py-2 border-r border-gray-200",children:r.date}),e.jsx(a,{className:"py-2 border-r border-gray-200",children:r.recipient}),e.jsx(a,{className:"py-2 border-r border-gray-200",children:r.details}),e.jsxs(a,{className:"py-2 font-medium border-r border-gray-200",children:["₱ ",r.amount.toFixed(2)]}),e.jsx(a,{className:"py-2",children:r.user})]},r.id)),e.jsxs(n,{className:"bg-gray-200 font-semibold border-t border-gray-300",children:[e.jsx(a,{colSpan:3}),e.jsxs(a,{children:["₱ ",N.toFixed(2)]}),e.jsx(a,{children:"Total"})]})]}):e.jsx(n,{children:e.jsx(a,{colSpan:5,className:"text-center py-4 text-gray-500 border-t border-gray-300",children:"No records found"})})})]})})]})}export{ne as default};
