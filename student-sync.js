/* Math Training RVA — student aggregate synchronization. © 2026 Rene M. Velazquez Avila. */
import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getAuth,signInAnonymously} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import {getFirestore,collection,addDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';
const app=getApps().length?getApp():initializeApp(firebaseConfig);
const auth=getAuth(app),db=getFirestore(app);
function num(x,max){return Math.min(max,Math.max(0,Math.trunc(Number(x)||0)))}
async function send(detail){
 const rows=Array.isArray(detail.records)?detail.records.slice(0,80):[];
 if(!rows.length)return;
 const user=auth.currentUser?.isAnonymous?auth.currentUser:(await signInAnonymously(auth)).user;
 const correct=rows.filter(x=>x.correct).length;
 const first=rows.filter(x=>x.correct&&x.firstAttempt).length;
 const omitted=rows.filter(x=>x.disposition==='unanswered').length;
 const payload={ownerUid:user.uid,block:num(detail.block,7),mode:detail.mode==='solo'?'solo':'guided',total:rows.length,correct,firstAttempt:first,omitted,attempts:rows.reduce((a,x)=>a+num(x.attempts,100),0),helps:rows.reduce((a,x)=>a+num(x.helps,100),0),seconds:num(detail.elapsedSeconds,86400),source:'student-auto',createdAt:serverTimestamp()};
 if(payload.block<1)return;
 await addDoc(collection(db,'studentSessions'),payload);
}
function showStatus(message){
 let node=document.getElementById('rvaCloudStatus');
 if(!node){node=document.createElement('p');node.id='rvaCloudStatus';node.setAttribute('role','status');node.style.cssText='font-size:13px;color:#16436a;text-align:center;margin:10px auto;max-width:650px';
 const anchor=document.getElementById('result');(anchor||document.body).appendChild(node)}
 node.textContent=message;
}
window.addEventListener('rva:session-complete',event=>{
 showStatus('☁️ Guardando resumen anónimo de la sesión…');
 send(event.detail).then(()=>{showStatus('✓ Resumen de la sesión enviado a Firebase.');window.dispatchEvent(new CustomEvent('rva:sync-status',{detail:{ok:true}}))}).catch(error=>{
 console.warn('Math Training RVA: no se pudo sincronizar la sesión.',error.code||error.message);showStatus('⚠ No se pudo guardar el resumen en línea. Avise al maestro.');
 window.dispatchEvent(new CustomEvent('rva:sync-status',{detail:{ok:false,code:error.code||'sync-error'}}));
 });
});
