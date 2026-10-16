/* © 2026 Rene M. Velazquez Avila — Math Training RVA */
(()=>{'use strict';
const KEY='mathTrainingEvidenceV40';
function getEvidence(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function download(){const data=getEvidence();if(!data.length){alert('No hay evidencias guardadas en este navegador. / No saved evidence.');return}const payload={schema:'math-training-rva-evidence-v1',exportedAt:new Date().toISOString(),source:'Math Training RVA V6.7.0',records:data};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='math-training-evidencias-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function add(){if(document.getElementById('rva-export'))return;const b=document.createElement('button');b.id='rva-export';b.type='button';b.textContent='⬇ Exportar evidencias / Export evidence';b.style.cssText='display:block;margin:12px auto;padding:11px 15px;border-radius:10px;background:#14557c;color:white;font-size:14px';b.onclick=download;const footer=document.querySelector('footer');(footer||document.body).before(b)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();