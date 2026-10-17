/* Math Training RVA — S2B access leases and student session sync.
   © 2026 Rene M. Velazquez Avila. */
import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getAuth,signInAnonymously,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import {getFirestore,doc,runTransaction,getDoc,updateDoc,deleteDoc,collection,addDoc,serverTimestamp,Timestamp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';
const app=getApps().length?getApp():initializeApp(firebaseConfig);
const auth=getAuth(app),db=getFirestore(app);
export const S2B_CODES=Object.freeze(['YA01','WI02','AD03','EV04','MI05','HA06','AU07','AX08','RM09','RA10','AS11','ST12','LU13','NO14','CH15','LA16','CO17','AM18','BE19']);
const LEASE_MS=180000,RENEW_MS=45000,SESSION_KEY='rvaS2bSessionV1';
let active=null,heartbeat=null,busy=false;
function readSaved(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch{return null}}
function save(){try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(active))}catch{}}
function clear(){active=null;try{sessionStorage.removeItem(SESSION_KEY)}catch{}if(heartbeat){clearInterval(heartbeat);heartbeat=null}}
function errorText(err){return err?.code==='permission-denied'?'Acceso denegado por las reglas de Firebase. Avise al maestro.':(err?.message||'No se pudo conectar. Avise al maestro.')}
async function anonymous(){await auth.authStateReady();if(auth.currentUser?.isAnonymous)return auth.currentUser;return (await signInAnonymously(auth)).user}
function notifyLost(){clear();window.dispatchEvent(new CustomEvent('rva:access-lost'));}
async function renew(){if(!active||busy)return;busy=true;try{const u=await anonymous(),ref=doc(db,'activeCodes',active.code),snap=await getDoc(ref),data=snap.data();if(!snap.exists()||data.ownerUid!==u.uid||data.sessionId!==active.sessionId){notifyLost();return}await updateDoc(ref,{expiresAt:Timestamp.fromMillis(Date.now()+LEASE_MS),updatedAt:serverTimestamp()});window.dispatchEvent(new CustomEvent('rva:access-online'))}catch(e){console.warn('RVA: renewal pending',e.code||e.message);window.dispatchEvent(new CustomEvent('rva:access-offline'))}finally{busy=false}}
function startHeartbeat(){if(heartbeat)clearInterval(heartbeat);heartbeat=setInterval(renew,RENEW_MS)}
async function acquire(code){code=String(code||'').trim().toUpperCase();if(!S2B_CODES.includes(code))throw Error('Código no asignado a S2B. Revisa tu tarjeta.');const user=await anonymous();const prior=readSaved();const sessionId=(prior?.code===code&&prior?.uid===user.uid&&prior?.sessionId)?prior.sessionId:crypto.randomUUID();const ref=doc(db,'activeCodes',code);
 await runTransaction(db,async tx=>{const snap=await tx.get(ref),old=snap.data(),now=Date.now();if(snap.exists()&&old.expiresAt?.toMillis()>now&&!(old.ownerUid===user.uid&&old.sessionId===sessionId)){throw Error('Este código ya está registrado en otro equipo. Revisa tu código o pide al maestro que libere el acceso.')}const value={ownerUid:user.uid,sessionId,expiresAt:Timestamp.fromMillis(now+LEASE_MS),updatedAt:serverTimestamp()};if(snap.exists())tx.update(ref,value);else tx.set(ref,value)});
 active={code,uid:user.uid,sessionId};save();startHeartbeat();return code;
}
async function release(){if(!active)return;const a=active;clear();try{const ref=doc(db,'activeCodes',a.code),snap=await getDoc(ref);if(snap.exists()&&snap.data().ownerUid===a.uid&&snap.data().sessionId===a.sessionId)await deleteDoc(ref)}catch(e){console.warn('RVA: lease expires automatically',e.code||e.message)}}
function num(x,max){return Math.min(max,Math.max(0,Math.trunc(Number(x)||0)))}
async function send(detail){if(!active)throw Error('No hay código de estudiante activo.');const a=active;const rows=Array.isArray(detail.records)?detail.records.slice(0,80):[];if(!rows.length)return;await renew();if(!active||active.sessionId!==a.sessionId)throw Error('La sesión fue liberada por el maestro.');const user=await anonymous();const correct=rows.filter(x=>x.correct).length,first=rows.filter(x=>x.correct&&x.firstAttempt).length,omitted=rows.filter(x=>x.disposition==='unanswered').length;
 const payload={ownerUid:user.uid,studentCode:a.code,sessionId:a.sessionId,block:num(detail.block,7),mode:detail.mode==='solo'?'solo':'guided',total:rows.length,correct,firstAttempt:first,omitted,attempts:rows.reduce((n,x)=>n+num(x.attempts,100),0),helps:rows.reduce((n,x)=>n+num(x.helps,100),0),seconds:num(detail.elapsedSeconds,86400),source:'student-auto',createdAt:serverTimestamp()};if(payload.block<1)return;await addDoc(collection(db,'studentSessions'),payload)}
function showStatus(message){let node=document.getElementById('rvaCloudStatus');if(!node){node=document.createElement('p');node.id='rvaCloudStatus';node.setAttribute('role','status');node.style.cssText='font-size:13px;color:#16436a;text-align:center;margin:10px auto;max-width:650px';(document.getElementById('result')||document.body).appendChild(node)}node.textContent=message}
window.RVAStudentAccess={acquire,release,get code(){return active?.code||null},get validCodes(){return S2B_CODES}};
window.dispatchEvent(new Event('rva:access-ready'));
window.addEventListener('rva:session-complete',event=>{showStatus('☁️ Guardando resultados de '+(active?.code||'la sesión')+'…');send(event.detail).then(()=>showStatus('✓ Resultados enviados a Firebase.')).catch(error=>{console.warn('RVA sync:',error);showStatus('⚠ No se pudieron guardar los resultados: '+errorText(error))})});
window.addEventListener('rva:access-lost',()=>{const w=document.getElementById('rvaWelcome');if(w)w.hidden=false;alert('Tu código fue liberado o se abrió en otro equipo. Consulta con tu maestro y vuelve a entrar.');});
window.addEventListener('online',()=>{if(active)renew()});
