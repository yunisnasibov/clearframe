export function parseCSV(text) {
 text=text.replace(/^\uFEFF/,'');
 const first=text.split(/\r?\n/)[0];
 const counts={',':0,';':0,'\t':0};let inQuotes=false;
 for(let i=0;i<first.length;i++){if(first[i]==='"'){if(inQuotes&&first[i+1]==='"')i++;else inQuotes=!inQuotes;}else if(!inQuotes&&first[i] in counts)counts[first[i]]++;}
 const delimiter=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
 let rows=[],row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++) {let c=text[i]; if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(quoted||cell==='')quoted=!quoted;else cell+=c;}else if(c===delimiter&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw Error('A quoted field is not closed. Please check the CSV file.');
 if(cell!==''||row.length){row.push(cell);rows.push(row);}
 if(!rows.length)throw Error('This file is empty.');
 return normalize(rows);
}
export function normalize(rows){
 if(!rows.length)throw Error('No rows found in this sheet.');
 const width=Math.max(...rows.map(r=>r.length));
 if(width>200)throw Error('Please use a file with 200 columns or fewer.');
 if(rows.length>20001)throw Error('Please use a file with 20,000 data rows or fewer.');
 const used=new Set();
 const headers=Array.from({length:width},(_,i)=>{let base=String(rows[0][i]??'').trim()||`Column ${i+1}`,h=base,n=2;while(used.has(h))h=`${base} (${n++})`;used.add(h);return h;});
 return {headers,rows:rows.slice(1).map(r=>Array.from({length:width},(_,i)=>String(r[i]??'')))};
}
export const blank=v=>v.trim()==='';
export function profile(data){const {headers,rows}=data;let seen=new Set(),duplicates=0;for(const r of rows){const key=JSON.stringify(r);if(seen.has(key))duplicates++;seen.add(key);}return {rows:rows.length,columns:headers.length,missing:rows.flat().filter(blank).length,duplicates,emptyRows:rows.filter(r=>r.every(blank)).length,whitespace:rows.flat().filter(v=>v!==v.trim()).length,byColumn:headers.map((name,i)=>({name,missing:rows.filter(r=>blank(r[i])).length,unique:new Set(rows.map(r=>r[i]).filter(v=>!blank(v))).size}))};}
export function clean(data,options){let rows=data.rows.map(r=>r.slice()),changes=[],changedCells=0;
 if(options.trim){rows=rows.map((r,ri)=>r.map((v,ci)=>{const next=v.trim();if(next!==v){changedCells++;changes.push({row:ri+2,column:data.headers[ci],action:'Trim whitespace',before:v,after:next});}return next;}));}
 let indexed=rows.map((r,i)=>({r,original:i+2}));
 if(options.empty)indexed=indexed.filter(({r,original})=>{if(r.every(blank)){changes.push({row:original,action:'Remove empty row'});return false;}return true;});
 if(options.duplicates){let seen=new Set();indexed=indexed.filter(({r,original})=>{let key=JSON.stringify(r);if(seen.has(key)){changes.push({row:original,action:'Remove duplicate row'});return false;}seen.add(key);return true;});}
 return {data:{headers:data.headers.slice(),rows:indexed.map(x=>x.r)},changes,changedCells,removedRows:rows.length-indexed.length};
}
export function csv(data,safe=true){return '\uFEFF'+[data.headers,...data.rows].map(r=>r.map(value=>{let v=String(value);if(safe&&/^[\s]*[=+@-]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"';}).join(',')).join('\r\n');}
export const sample={headers:['order_id','customer','email','country','amount','status'],rows:[['ORD-1001',' Maya Chen ','maya@example.com','Canada','120.00','Paid'],['ORD-1002','Alex Morgan','alex@example.com','United States','85.50','Pending'],['ORD-1003','Sam Rivera','','Spain','210.00','Paid'],['ORD-1002','Alex Morgan','alex@example.com','United States','85.50','Pending'],['ORD-1004','  Deniz Kaya','deniz@example.com','Turkey','64.00','Paid '],['','','','','',''],['ORD-1005','Jules Martin','jules@example.com','France','','Pending'],['ORD-1006','Noor Ali ','noor@example.com','United Kingdom','145.00','Paid'],['ORD-1007','Eva Silva','eva@example.com','','99.00','Paid'],['ORD-1008','Luca Rossi','luca@example.com','Italy','180.00','Paid'],['ORD-1001',' Maya Chen ','maya@example.com','Canada','120.00','Paid'],['ORD-1009','Sofia Costa','sofia@example.com','Portugal','72.50',' Pending']]};
