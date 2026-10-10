/**
 * Math Live — Compact K–5 Math Engine
 * © 2026 Rene M. Velazquez Avila · Espacio de Aprendizaje — Segundo Grado · Todos los derechos reservados.
 *
 * Architecture: CORE + cumulative REVIEW; controlled randomization;
 * GENERATE -> SOLVE -> VALIDATE -> DISPLAY.
 */
(function (global) {
"use strict";

const VERSION="0.1.0";
const LABELS=["K","1","2","3","4","5"];
const CFG={count:15,coreWeight:.75,maxAttempts:80};

const CURRICULUM={
  0:{core:["count","nextPrevious","compare","composeSmall"],review:[]},
  1:{core:["countOn","compare","addWithin20","missingPart","composeSmall"],review:["count","nextPrevious"]},
  2:{core:["placeValue","numberForms","compare","numberLine","moneyPV","addSubtract","roundTens"],review:["countOn","missingPart","addWithin20"]},
  3:{core:["equalGroups","multiplyDivide","arrays","missingFactor","wordProblemMD"],review:["placeValue","numberForms","addSubtract","numberLine"]},
  4:{core:["placeValueLarge","compareLarge","roundLarge","addSubtractLarge","numberForms"],review:["multiplyDivide","placeValue","numberLine"]},
  5:{core:["placeValueLarge","powersOfTen","multiplyDivideWhole","numberForms","compareLarge"],review:["roundLarge","addSubtractLarge","multiplyDivide"]}
};

const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[ri(0,a.length-1)];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){let j=ri(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const uniq=a=>[...new Set(a.map(String))];

function words(n){
 if(!Number.isInteger(n)||n<0||n>999999)return null;
 if(n===0)return"cero";
 const u=["","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"];
 const sp={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"dieciséis",17:"diecisiete",18:"dieciocho",19:"diecinueve",20:"veinte",21:"veintiuno",22:"veintidós",23:"veintitrés",24:"veinticuatro",25:"veinticinco",26:"veintiséis",27:"veintisiete",28:"veintiocho",29:"veintinueve"};
 const t=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"];
 const h=["","ciento","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];
 function sub(x){if(!x)return"";if(x===100)return"cien";let s="",H=Math.floor(x/100),r=x%100;if(H)s=h[H];if(r){if(s)s+=" ";if(r<10)s+=u[r];else if(sp[r])s+=sp[r];else{s+=t[Math.floor(r/10)];if(r%10)s+=" y "+u[r%10];}}return s;}
 if(n<1000)return sub(n);
 let th=Math.floor(n/1000),r=n%1000,s=th===1?"mil":sub(th)+" mil";
 return (s+(r?" "+sub(r):"")).trim();
}
function expanded(n){const s=String(n),p=[];for(let i=0;i<s.length;i++){let d=+s[i],v=d*10**(s.length-i-1);if(v)p.push(v);}return p.join(" + ")||"0";}
function unit(n){
 const names=[["unidad","unidades"],["decena","decenas"],["centena","centenas"],["unidad de millar","unidades de millar"],["decena de millar","decenas de millar"],["centena de millar","centenas de millar"]];
 return String(n).split("").map(Number).reverse().map((d,i)=>d?`${d} ${d===1?names[i][0]:names[i][1]}`:null).filter(Boolean).reverse().join(" + ");
}
function choice(grade,skill,prompt,correct,distractors,meta={}){
 const c=String(correct),options=shuffle(uniq([c,...distractors.filter(x=>x!==null&&x!==undefined).map(String)]));
 return{id:`${skill}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,grade,skill,format:"singleChoice",prompt,options,correctAnswer:c,meta};
}
function count(g){let m=g===0?10:g===1?20:100,n=ri(1,m);return choice(g,"count",`¿Qué número representa una colección de ${n} objetos?`,n,[Math.max(0,n-1),n+1,Math.max(0,n-2)],{n});}
function nextPrev(g){let m=g===0?10:g===1?50:100,n=ri(1,m-1),next=Math.random()<.5;return choice(g,"nextPrevious",next?`¿Qué número viene después de ${n}?`:`¿Qué número viene antes de ${n}?`,next?n+1:n-1,next?[n-1,n+2,n]:[n+1,n-2,n],{n});}
function compare(g){let m=g<=1?20:g===2?1000:g===3?10000:999999,a=ri(0,m),b=ri(0,m);while(a===b)b=ri(0,m);let z=a>b?">":"<";return choice(g,g>=4?"compareLarge":"compare",`Completa: ${a.toLocaleString("en-US")} __ ${b.toLocaleString("en-US")}`,z,[z===">"?"<":">","="],{a,b});}
function compose(g){let total=ri(3,g===0?10:20),a=ri(0,total),b=total-a;return choice(g,"composeSmall",`${a} y ${b} forman ¿qué total?`,total,[Math.max(0,total-1),total+1,Math.max(0,total-2)],{a,b,total});}
function add(g){let m=g<=1?10:g===2?100:g>=4?100000:1000,a=ri(0,m),b=ri(0,m),z=a+b,skill=g>=4?"addSubtractLarge":g<=1?"addWithin20":"addSubtract";return choice(g,skill,`¿Cuánto es ${a.toLocaleString("en-US")} + ${b.toLocaleString("en-US")}?`,z,[Math.max(0,z-1),z+1,Math.max(0,z-10)],{a,b,op:"+"});}
function missing(g){let total=ri(5,g===1?20:50),a=ri(0,total),z=total-a;return choice(g,"missingPart",`${a} + __ = ${total}. ¿Qué número falta?`,z,[Math.max(0,z-1),z+1,a],{a,total});}
function place(g){
 let max=g===2?999:g===3?9999:999999,min=g===2?100:1000,n=ri(min,max),s=String(n);
 let nonzero=[];for(let i=0;i<s.length;i++)if(+s[i]!==0)nonzero.push(i);
 let pos=pick(nonzero),d=+s[pos],v=d*10**(s.length-pos-1);
 return choice(g,g>=4?"placeValueLarge":"placeValue",`En ${n.toLocaleString("en-US")}, ¿cuál es el valor del dígito ${d} en esa posición?`,v,[d,d*10,d*100,d*1000].filter(x=>x!==v),{n,pos,d});
}
function forms(g){
 let max=g===2?999:g===3?9999:999999,min=g===2?100:1000,n=ri(min,max),type=pick(["expanded","words","unit"]),correct,prompt,ds;
 if(type==="expanded"){correct=expanded(n);prompt=`¿Cuál es la forma desarrollada de ${n.toLocaleString("en-US")}?`;ds=[n+10,n+1,Math.max(1,n-10)].map(expanded);}
 else if(type==="words"){correct=words(n);prompt=`¿Cuál es la forma escrita de ${n.toLocaleString("en-US")}?`;ds=[n+1,Math.max(1,n-10),Math.max(1,n-100)].map(words);}
 else{correct=unit(n);prompt=`¿Cuál es la forma unitaria de ${n.toLocaleString("en-US")}?`;ds=[n+1,Math.max(1,n-10),Math.max(1,n-100)].map(unit);}
 return choice(g,"numberForms",prompt,correct,ds,{n,type});
}
function line(g){let max=g===2?1000:10000,start=ri(0,max-100),step=pick(g===2?[1,10,100]:[10,100,1000]),z=start+step;return choice(g,"numberLine",`Comienzas en ${start.toLocaleString("en-US")} y avanzas ${step}. ¿Dónde llegas?`,z,[Math.max(0,start-step),z+1,start+Math.max(1,step/10)],{start,step});}
function money(g){let h=ri(1,9),t=ri(0,9),o=ri(0,9),z=h*100+t*10+o;return choice(g,"moneyPV",`Tienes ${h} billete(s) de $100, ${t} de $10 y ${o} de $1. ¿Cuánto dinero tienes?`,`$${z}`,[`$${z+10}`,`$${Math.max(0,z-1)}`,`$${z+100}`],{h,t,o,z});}
function round10(g){let n=ri(10,99),z=Math.round(n/10)*10;return choice(g,"roundTens",`Redondea ${n} a la decena más cercana.`,z,[Math.floor(n/10)*10,Math.ceil(n/10)*10,n].filter(x=>x!==z),{n});}
function mult(g){let fs=g===3?[2,3,4,5,10]:[2,3,4,5,6,7,8,9,10],a=pick(fs),b=ri(1,10),mul=Math.random()<.6,skill=g===5?"multiplyDivideWhole":"multiplyDivide";if(mul){let z=a*b;return choice(g,skill,`${a} × ${b} = __`,z,[z+a,Math.max(0,z-a),z+b],{a,b,op:"×"});}let p=a*b;return choice(g,skill,`${p} ÷ ${a} = __`,b,[Math.max(0,b-1),b+1,a],{p,a,op:"÷"});}
function groups(g){let a=ri(2,5),b=ri(2,10),z=a*b;return choice(g,"equalGroups",`Hay ${a} grupos con ${b} objetos en cada grupo. ¿Cuántos objetos hay?`,z,[a+b,z-a,z+a],{a,b});}
function roundLarge(g){let n=ri(1000,999999),p=pick(g===4?[10,100,1000]:[10,100,1000,10000]),z=Math.round(n/p)*p;return choice(g,"roundLarge",`Redondea ${n.toLocaleString("en-US")} al ${p.toLocaleString("en-US")} más cercano.`,z,[Math.floor(n/p)*p,Math.ceil(n/p)*p,n].filter(x=>x!==z),{n,p});}
function power10(g){let n=ri(1,99),p=pick([10,100,1000]),mul=Math.random()<.5,z=mul?n*p:n;return choice(g,"powersOfTen",mul?`${n} × ${p} = __`:`${n*p} ÷ ${p} = __`,z,[z*10,Math.max(0,z/10),z+10],{n,p});}

const GEN={
 count,nextPrevious:nextPrev,countOn:nextPrev,compare,compareLarge:compare,composeSmall:compose,
 addWithin20:add,addSubtract:add,addSubtractLarge:add,missingPart:missing,
 placeValue:place,placeValueLarge:place,numberForms:forms,numberLine:line,moneyPV:money,roundTens:round10,
 equalGroups:groups,arrays:groups,wordProblemMD:groups,multiplyDivide:mult,missingFactor:mult,multiplyDivideWhole:mult,
 roundLarge,powersOfTen:power10
};

function validate(q){
 const e=[];
 if(!q||typeof q!=="object")e.push("not-object");
 if(!q?.prompt||typeof q.prompt!=="string")e.push("missing-prompt");
 if(/undefined|NaN|null/i.test(JSON.stringify(q)))e.push("invalid-token");
 if(!Array.isArray(q?.options)||q.options.length<2)e.push("options");
 if(q?.options&&uniq(q.options).length!==q.options.length)e.push("duplicates");
 if(!q?.options?.includes(String(q.correctAnswer)))e.push("correct-not-present");
 if((q?.options?.filter(x=>String(x)===String(q.correctAnswer)).length||0)!==1)e.push("correct-count");
 if(q?.grade<0||q?.grade>5)e.push("grade");
 return{valid:e.length===0,errors:e};
}
function validGen(skill,g){let fn=GEN[skill];if(!fn)throw Error(`Missing generator: ${skill}`);for(let i=0;i<CFG.maxAttempts;i++){let q=fn(g);if(validate(q).valid)return q;}throw Error(`Could not validate ${skill}`);}
function plan(g,count=CFG.count){
 let c=CURRICULUM[g];if(!c)throw Error("Grade must be K–5.");
 let core=c.review.length?Math.round(count*CFG.coreWeight):count,rev=count-core,out=[];
 function fill(pool,n,layer){if(!pool.length)return;let a=shuffle(pool);for(let i=0;i<n;i++)out.push({skill:a[i%a.length],layer});}
 fill(c.core,core,"core");fill(c.review,rev,"review");return shuffle(out).slice(0,count);
}
function createGameSet({grade,count=CFG.count,studentSeed=null}={}){
 grade=Number(grade);return plan(grade,count).map((x,i)=>{let q=validGen(x.skill,grade);q.meta={...q.meta,layer:x.layer,challenge:i+1,studentSeed};return q;});
}
function gradeAnswer(q,a){return validate(q).valid?{correct:String(a).trim()===String(q.correctAnswer).trim()}:{correct:false,error:"invalid-question"};}
function selfTest(iterations=100){
 let report=[];
 for(let g=0;g<=5;g++){let generated=0,failures=[];for(let i=0;i<iterations;i++){try{for(let q of createGameSet({grade:g,count:15,studentSeed:`test-${g}-${i}`})){generated++;let v=validate(q);if(!v.valid)failures.push(v.errors);}}catch(e){failures.push([e.message]);}}report.push({grade:LABELS[g],generated,failures:failures.length,details:failures.slice(0,5)});}
 return report;
}

global.MathLiveEngine=Object.freeze({
 VERSION,CONFIG:CFG,CURRICULUM,createGameSet,validateQuestion:validate,gradeAnswer,selfTest,
 utilities:{numberToSpanish:words,expandedForm:expanded,unitForm:unit}
});
})(typeof window!=="undefined"?window:globalThis);
