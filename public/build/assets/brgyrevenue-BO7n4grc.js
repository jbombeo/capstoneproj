import{r as l,j as e,H as j}from"./app-BYDD7jqK.js";import{A as N}from"./app-layout-DwJpk70a.js";import{d as v}from"./index-DwhOcVGB.js";import{T as w,a as D,b as c,c as n,d as R,e as a}from"./table-DLidGIvn.js";import{B as p}from"./button-Dr-gN8dc.js";import{I as u}from"./input-iCoYWyDm.js";import{L as h}from"./label-CHedX6Vx.js";/* empty css            */import"./app-sidebar-header-p_ZutQgq.js";import"./createLucideIcon-DdLpzc9k.js";import"./index-B2jg6ky-.js";import"./index-CoyH5QwD.js";import"./index-WOlHJoPy.js";import"./log-out-Be8tPfcd.js";import"./x-JC7lT9T1.js";import"./index-fql2wrXq.js";import"./settings-D0VBnQjg.js";import"./file-text-BVrqHHw0.js";const T=[{title:"Barangay Revenues",href:v().url}];function G(){const[y]=l.useState([{id:1,date:"2025-09-01",recipient:"Juan Dela Cruz",details:"Certificate of Indigency",amount:50,user:"Admin"},{id:2,date:"2025-08-28",recipient:"Maria Santos",details:"Barangay Clearance",amount:100,user:"Staff 1"}]),[s,x]=l.useState(""),[o,b]=l.useState(""),m=l.useRef(null),g=y.filter(r=>{const t=new Date(r.date),i=s?new Date(s):null,d=o?new Date(o):null;return!(i&&t<i||d&&t>d)}),f=g.reduce((r,t)=>r+t.amount,0),_=()=>{if(!m.current)return;const r="/images/logo.png",t=s||o?`Date Range: ${s||"Any"} to ${o||"Any"}`:"All Records",i=m.current.innerHTML,d=document.body.innerHTML;document.body.innerHTML=`
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
              .total-row { font-weight: bold; }
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
          ${i}
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
    `,window.print(),document.body.innerHTML=d,window.location.reload()};return e.jsxs(N,{breadcrumbs:T,children:[e.jsx(j,{title:"Barangay Revenues"}),e.jsx("div",{className:"flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6 border-0 border-blue-700",children:e.jsx("h1",{className:"text-3xl font-bold",children:"Barangay Revenues"})}),e.jsxs("div",{className:"flex flex-col md:flex-row items-end gap-4 mb-6 border border-gray-300 rounded-lg p-4 bg-gray-50",children:[e.jsxs("div",{className:"flex flex-col md:flex-row items-end gap-4 flex-1",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx(h,{htmlFor:"minDate",className:"mb-1 text-gray-700 font-medium",children:"Minimum Date"}),e.jsx(u,{type:"date",id:"minDate",value:s,onChange:r=>x(r.target.value),className:"border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx(h,{htmlFor:"maxDate",className:"mb-1 text-gray-700 font-medium",children:"Maximum Date"}),e.jsx(u,{type:"date",id:"maxDate",value:o,onChange:r=>b(r.target.value),className:"border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"})]}),e.jsx(p,{variant:"outline",className:"h-10 mt-2 md:mt-0",onClick:()=>{x(""),b("")},children:"Reset"})]}),e.jsx("div",{className:"mt-2 md:mt-0",children:e.jsx(p,{onClick:_,variant:"outline",className:"border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors",children:"Print Document"})})]}),e.jsx("div",{ref:m,className:"overflow-x-auto rounded-lg border border-gray-300 shadow-md p-4 bg-white",children:e.jsxs(w,{className:"min-w-full divide-y divide-gray-200 border border-gray-300",children:[e.jsx(D,{className:"bg-gray-50 sticky top-0 z-10 border-b border-gray-300",children:e.jsxs(c,{children:[e.jsx(n,{className:"text-gray-700 border-r border-gray-300",children:"Date"}),e.jsx(n,{className:"text-gray-700 border-r border-gray-300",children:"Recipient"}),e.jsx(n,{className:"text-gray-700 border-r border-gray-300",children:"Details"}),e.jsx(n,{className:"text-gray-700 border-r border-gray-300",children:"Amount"}),e.jsx(n,{className:"text-gray-700",children:"User"})]})}),e.jsx(R,{children:g.length>0?e.jsxs(e.Fragment,{children:[g.map((r,t)=>e.jsxs(c,{className:`transition-shadow hover:shadow-md border-b border-gray-200 ${t%2===0?"bg-gray-50":"bg-white"}`,children:[e.jsx(a,{className:"py-2 border-r border-gray-200",children:r.date}),e.jsx(a,{className:"py-2 border-r border-gray-200",children:r.recipient}),e.jsx(a,{className:"py-2 border-r border-gray-200",children:r.details}),e.jsxs(a,{className:"py-2 font-medium border-r border-gray-200",children:["₱ ",r.amount]}),e.jsx(a,{className:"py-2",children:r.user})]},r.id)),e.jsxs(c,{className:"bg-gray-200 font-semibold border-t border-gray-300",children:[e.jsx(a,{colSpan:3,className:"border-r border-gray-300"}),e.jsxs(a,{className:"border-r border-gray-300",children:["₱ ",f]}),e.jsx(a,{children:"Total"})]})]}):e.jsx(c,{children:e.jsx(a,{colSpan:5,className:"text-center py-4 text-gray-500 border-t border-gray-300",children:"No records found"})})})]})})]})}export{G as default};
