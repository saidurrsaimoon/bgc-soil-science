import {initializeApp} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,sendEmailVerification,sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import {getFirestore,collection,doc,getDoc,getDocs,query,where,writeBatch,setDoc,addDoc,updateDoc,deleteDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// Public web config (not secret). Security comes from firestore.rules.
const cfg={
  apiKey:"AIzaSyCHRcDYPgyxRCr13aQmolakzWbWKHQH1Jc",
  authDomain:"bgc-soil-science.firebaseapp.com",
  projectId:"bgc-soil-science",
  storageBucket:"bgc-soil-science.firebasestorage.app",
  messagingSenderId:"876986624931",
  appId:"1:876986624931:web:1ecc605e1d880fe1ca8816"
};
const app=initializeApp(cfg),auth=getAuth(app),db=getFirestore(app);
const $=i=>document.getElementById(i),B=document.body;
const YR=["1st Year","2nd Year","3rd Year","4th Year","Masters"];
const SS=["2020-2021","2021-2022","2022-2023","2023-2024","2024-2025","2025-2026","2026-2027"];
const TH=[["auto","Auto","#888"],["forest","Forest Sage","#2f5d3f"],["midnight","Midnight Lilac","#9d8bd6"],["graphite","Graphite Gold","#c9a64a"],["burgundy","Burgundy Blush","#7a1f33"],["slate","Slate Mist","#3f5b7a"],["rose","Rose Dusk","#d18ba0"],["olive","Olive Earth","#5f6b2c"],["paper","Warm Paper","#8a5a2b"],["ocean","Ocean Mist","#1f7a7a"],["clay","Terra Clay","#a8522d"],["emerald","Obsidian Emerald","#3fbf8f"],["aurora","Aurora Night","#6fd0c2"]];
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const PH=/^(\+?88)?01[3-9]\d{8}$/;
const okUrl=u=>/^https?:\/\//i.test(u||"");
const secs=p=>(p.createdAt&&p.createdAt.seconds)||0;
const byNew=(a,b)=>secs(b)-secs(a);
const byPin=(a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||byNew(a,b);
const isoDay=p=>p.createdAt&&p.createdAt.toDate?p.createdAt.toDate().toISOString().slice(0,10):"";
function fd(p){const d=p.noticeDate?new Date(p.noticeDate+"T00:00:00"):(p.createdAt&&p.createdAt.toDate?p.createdAt.toDate():null);return d&&!isNaN(d)?d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):""}
function toast(t){try{navigator.vibrate&&navigator.vibrate(12)}catch(x){}const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("show"),5000)}
function err(e){const c=(e&&e.code)||"";const m={"auth/email-already-in-use":"This email is already registered. Try logging in.","auth/invalid-credential":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/invalid-email":"Please enter a valid email.","auth/weak-password":"Password must be at least 8 characters.","auth/too-many-requests":"Too many attempts. Please wait a while and try again.","auth/network-request-failed":"Network problem. Check your internet connection."};
 if(m[c])return m[c];if(c.indexOf("permission")>-1)return "Not allowed. Log in with a verified email, or check the Firestore rules.";return "Something went wrong. "+((e&&e.message)||"")}

document.querySelectorAll(".yr").forEach(s=>s.innerHTML=YR.map(y=>"<option>"+y+"</option>").join(""));
document.querySelectorAll(".ss").forEach(s=>{s.innerHTML=SS.map(y=>"<option>"+y+"</option>").join("");s.value="2025-2026"});

// themes
function setTheme(k){document.documentElement.dataset.theme=k=="auto"?(matchMedia("(prefers-color-scheme:dark)").matches?"emerald":"forest"):k;try{localStorage.setItem("bgc-theme",k)}catch(e){}[].forEach.call($("sw").children,b=>b.classList.toggle("on",b.dataset.k==k));if(typeof fx=="function")fx()}
$("sw").innerHTML=TH.map(t=>'<button data-k="'+t[0]+'"><span class="dot" style="background:'+t[2]+'"></span>'+t[1]+'</button>').join("");
$("sw").onclick=e=>{const b=e.target.closest("button");if(b){setTheme(b.dataset.k);wipe(e)}};
let st="forest";try{st=localStorage.getItem("bgc-theme")||st}catch(e){}
setTheme(TH.some(t=>t[0]==st)?st:"forest");

// state
const ICN={
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6M17 5a3.5 3.5 0 010 7M22 20c0-3-2-5-4-5.5"/>',
chat:'<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
news:'<path d="M5 3h14v18H5zM9 8h6M9 12h6M9 16h4"/>',
key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
sparkle:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
pencil:'<path d="M4 20l1-5L16 4l4 4L9 19z"/>',
logout:'<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.7A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
heartf:'<path fill="currentColor" d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.7A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
clip:'<path d="M20 11l-8 8a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
pin:'<path d="M9 3h6l-1 6 3 3H7l3-3zM12 12v9"/>',
share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.7 10.7l6.6-4M8.7 13.3l6.6 4"/>',
check:'<path d="M5 12l5 5 9-10"/>',
camera:'<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
wa:'<path d="M21 12a9 9 0 01-13.3 7.9L3 21l1.2-4.5A9 9 0 1121 12z"/><path d="M9 9c0 3 3 6 6 6l1.5-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/>',
msg:'<path d="M21 3L3 11l7 3 3 7z"/><path d="M10 14l11-11"/>',
fb:'<path fill="currentColor" stroke="none" d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>',
left:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
up:'<path d="M12 19V5M6 11l6-6 6 6"/>',
palette:'<path d="M12 3a9 9 0 100 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 004-4c0-4.5-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>'};
const SHP={leaf:'<path d="M20 4C10 4 4 10 4 18c0 1 .2 2 .5 3 1-.4 2-1 3-2 8 0 12.5-6 12.5-15z"/>',
sprout:'<path d="M12 22v-9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 13C12 7 7 4 3 4c0 5 3 9 9 9zM12 11c0-4 3-7 8-7 0 4-3 7-8 7z"/>',
petal:'<path d="M12 2c4 4 6 8 6 12a6 6 0 01-12 0c0-4 2-8 6-12z"/>',
drop:'<path d="M12 2s7 7.5 7 13a7 7 0 01-14 0c0-5.5 7-13 7-13z"/>',
bubble:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="8.5" cy="8.5" r="2" opacity=".6"/>',
spark:'<path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>',
dust:'<circle cx="12" cy="12" r="4.5"/>',
grain:'<path d="M12 22V9M12 9C9 8 8 5 8 2c3 1 4 4 4 7zm0 0c3-1 4-4 4-7-3 1-4 4-4 7zm0 6c-3-1-4-4-4-7 3 1 4 4 4 7zm0 0c3-1 4-4 4-7-3 1-4 4-4 7z"/>',
cloud:'<path d="M7 18a4 4 0 010-8 5 5 0 019.6-1A4.5 4.5 0 0117 18z"/>',
flower:'<circle cx="12" cy="5.5" r="4"/><circle cx="18.5" cy="10" r="4"/><circle cx="16" cy="17.5" r="4"/><circle cx="8" cy="17.5" r="4"/><circle cx="5.5" cy="10" r="4"/>',
moon:'<path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z"/>'};
const ico=n=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+(ICN[n]||"")+"</svg>";
const shp=n=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(SHP[n]||"")+"</svg>";
const bn=t=>/[\u0980-\u09FF]/.test(t||"")?' class="bn"':"";
const saveBtn=on=>ico(on?"heartf":"heart")+L(on?"saved":"save");
let LG="en";try{LG=localStorage.getItem("bgc-lang")||"en"}catch(e){}
let me=null,prof=null,adm=false,PUB=[],ALL=[],cat="All";

function extras(p){const L=[["Subject",p.subject],["Teacher",p.teacher],["Department",p.department],["Class",p.classYear],["Issued",p.issuedDate],["Deadline",p.deadline],["Time",p.examTime]].filter(x=>x[1]).map(x=>x[0]+": "+esc(x[1]));
 let h=L.length?'<div class="meta">'+L.join(" · ")+"</div>":"";
 if(okUrl(p.attachmentUrl)){const src=imgSrc(p.attachmentUrl),u=esc(p.attachmentUrl);
  if(src)h+='<a href="'+u+'" target="_blank" rel="noopener noreferrer"><img class="pimg" src="'+esc(src)+'" loading="lazy" alt="Attachment preview" onerror="this.parentNode.style.display=\'none\'"></a>';
  h+='<div class="meta"><a class="au" href="'+u+'" target="_blank" rel="noopener noreferrer">'+ico("clip")+'Open attachment</a></div>'}
 return h}
function imgSrc(u){if(!okUrl(u))return "";const m=u.match(/drive\.google\.com\/file\/d\/([\w-]+)/)||u.match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([\w-]+)/);
 if(m)return "https://drive.google.com/thumbnail?id="+m[1]+"&sz=w1000";
 return /\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(u)?u:""}
function card(p,i){return '<article class="card" data-n="'+esc(p.id)+'" style="animation-delay:'+Math.min(i,8)*50+'ms"><div class="row"><span class="tag '+esc(p.category)+'">'+esc(p.category)+'</span>'+chips(p)+'<span>'+ico("cal")+esc(fd(p))+'</span></div><h3'+bn(p.title)+'>'+esc(p.title)+'</h3><p'+bn(p.description)+'>'+esc(p.description)+'</p><span class="more">'+L("more")+'</span>'+extras(p)+'<div class="row" style="margin-top:auto"><span><button class="au" data-share="'+esc(p.id)+'">'+ico("share")+L("share")+'</button> &nbsp; <button class="au" data-save="'+esc(p.id)+'">'+saveBtn(SAV.indexOf(p.id)>-1)+'</button></span><span>'+L("by")+' <button class="au" data-u="'+esc(p.authorUid)+'">'+esc(p.authorName)+'</button></span></div></article>'}
function render(){const q=$("q").value.trim().toLowerCase();
 const r=PUB.filter(p=>(cat=="All"||p.category==cat||(cat=="Saved"&&SAV.indexOf(p.id)>-1))&&(!q||[p.title,p.description,p.authorName].join(" ").toLowerCase().indexOf(q)>-1)).sort(byPin);
 $("list").innerHTML=r.length?r.map(card).join(""):'<div class="empty" style="grid-column:1/-1">No notices found for this category yet.</div>'}
async function loadPub(){try{const s=await getDocs(query(collection(db,"notices"),where("status","==","published")));PUB=s.docs.map(d=>Object.assign({id:d.id},d.data()))}catch(e){PUB=[];toast(err(e))}render();stats()}
async function loadDir(){const el=$("dir");
 if(!(me&&me.emailVerified&&(prof||adm))){el.innerHTML='<div class="empty">'+ico("lock")+(me&&me.emailVerified?"The student list is visible after admin approval.":"Log in with a verified email to see all students.")+"</div>";return}
 try{const s=await getDocs(collection(db,"publicProfiles"));const a=s.docs.map(d=>Object.assign({id:d.id},d.data())).sort((x,y)=>x.name.localeCompare(y.name));
 el.innerHTML=a.length?'<div class="grid">'+a.map(p=>'<div class="card"><h3><button class="au" data-u="'+esc(p.id)+'">'+esc(p.name)+'</button></h3><div class="meta">Roll '+esc(p.roll)+' · Soil Science · '+esc(p.year)+' · Session '+esc(p.session)+'</div></div>').join("")+"</div>":'<div class="empty">No students yet.</div>'}
 catch(e){el.innerHTML='<div class="empty">'+esc(err(e))+"</div>"}}
async function openProfile(uid){
 if(!(me&&me.emailVerified&&(prof||adm))){toast("Student profiles are visible to approved students only.");if(!me)$("login").showModal();return}
 try{const p=await getDoc(doc(db,"publicProfiles",uid));if(!p.exists()){toast("Profile not found.");return}
 const a=p.data(),s=await getDocs(query(collection(db,"notices"),where("authorUid","==",uid),where("status","==","published")));
 const L=s.docs.map(d=>d.data()).sort(byNew);
 $("pbody").innerHTML="<h2>"+esc(a.name)+'</h2><div class="meta">Roll '+esc(a.roll)+" · Soil Science · "+esc(a.year)+" · Session "+esc(a.session)+'</div><h3 style="margin:14px 0 6px;font-size:1rem">Published posts</h3>'+(L.length?L.map(x=>'<div class="meta" style="padding:6px 0;border-bottom:1px solid var(--ln)"><span class="tag '+esc(x.category)+'">'+esc(x.category)+"</span> "+esc(x.title)+" · "+esc(fd(x))+"</div>").join(""):'<p class="meta">No published posts yet.</p>');
 $("prof").showModal()}catch(e){toast(err(e))}}

// auth state
onAuthStateChanged(auth,async u=>{
 prof=null;adm=false;
 if(u){try{await u.reload();await u.getIdToken(true)}catch(e){}u=auth.currentUser}
 me=u;
 if(u&&u.emailVerified){
  try{const p=await getDoc(doc(db,"publicProfiles",u.uid));prof=p.exists()?p.data():null}catch(e){}
  try{adm=(await getDoc(doc(db,"admins",u.uid))).exists()}catch(e){}
 }
 B.className=(u?"a-in ":"")+(u&&u.emailVerified?"a-ver ":"")+(prof?"a-apr ":"")+(adm?"a-adm ":"")+(B.classList.contains("pg-st")?"pg-st":"");
 if(B.classList.contains("pg-st"))loadDir();loadPolls();loadPub();
});

// forms
$("rf").onsubmit=async e=>{e.preventDefault();const f=e.target,m=f.querySelector(".msg"),g=k=>f.elements[k].value.trim();
 if(f.elements.p.value!==f.elements.p2.value){m.textContent="Passwords do not match.";return}
 const ph=g("ph");if(!PH.test(ph)){m.textContent="A valid Bangladeshi phone number is required (like 01XXXXXXXXX).";return}
 m.textContent="Creating account…";
 const v={name:g("n"),roll:g("r"),year:f.elements.y.value,session:f.elements.s.value};
 try{const c=await createUserWithEmailAndPassword(auth,g("e"),f.elements.p.value);
  const b=writeBatch(db);
  b.set(doc(db,"users",c.user.uid),Object.assign({},v,{phone:ph},{email:c.user.email,createdAt:serverTimestamp()}));
  await b.commit();await sendEmailVerification(c.user);
  f.reset();m.textContent="";$("reg").close();toast("Account created. Verify your email (check Spam). The admin will then confirm your account.")}
 catch(x){m.textContent=err(x)}};
$("lf").onsubmit=async e=>{e.preventDefault();const f=e.target,m=f.querySelector(".msg");m.textContent="Logging in…";
 try{await signInWithEmailAndPassword(auth,f.elements.e.value.trim(),f.elements.p.value);f.reset();m.textContent="";$("login").close()}catch(x){m.textContent=err(x)}};
$("forgot").onclick=async()=>{const m=$("lf").querySelector(".msg"),em=$("lf").elements.e.value.trim();
 if(!em){m.textContent="Type your email above first.";return}
 try{await sendPasswordResetEmail(auth,em);m.textContent="Password reset email sent (check Spam)."}catch(x){m.textContent=err(x)}};
$("resend").onclick=async()=>{try{await sendEmailVerification(auth.currentUser);toast("Verification email sent. Check inbox and Spam.")}catch(x){toast(err(x))}};
$("logout").onclick=()=>signOut(auth);
$("mf").onsubmit=async e=>{e.preventDefault();const f=e.target,m=f.querySelector(".msg");
 const v={name:f.elements.n.value.trim(),roll:f.elements.r.value.trim(),year:f.elements.y.value,session:f.elements.s.value};
 const ph=f.elements.ph.value.trim();if(!PH.test(ph)){m.textContent="A valid Bangladeshi phone number is required (like 01XXXXXXXXX).";return}
 try{const b=writeBatch(db);b.update(doc(db,"users",me.uid),Object.assign({},v,{phone:ph}));b.update(doc(db,"publicProfiles",me.uid),v);await b.commit();prof=v;m.textContent="";$("prd").close();toast("Profile updated.");loadDir()}catch(x){m.textContent=err(x)}};

// new post
const pf=$("pf"),pc=$("pcat");
const sync=()=>{pf.querySelectorAll("[data-for]").forEach(d=>d.hidden=d.dataset.for.split(" ").indexOf(pc.value)<0);$("dl").textContent=pc.value=="Exam"?"Exam date":pc.value=="Assignment"?"Assignment date (optional)":"Notice date"};
pc.onchange=sync;sync();
pf.onsubmit=async e=>{e.preventDefault();const m=pf.querySelector(".msg"),g=k=>pf.elements[k].value.trim();
 if(!(me&&me.emailVerified&&prof)){m.textContent="A verified account with a profile is required.";return}
 const d={category:pc.value,title:g("title"),description:g("description"),authorUid:me.uid,authorName:prof.name,status:"pending",createdAt:serverTimestamp()};
 pf.querySelectorAll("[data-for]").forEach(w=>{if(w.hidden)return;w.querySelectorAll("input").forEach(i=>{if(i.value.trim())d[i.name]=i.value.trim()})});
 if(d.attachmentUrl&&!okUrl(d.attachmentUrl)){m.textContent="Attachment link must start with http:// or https://";return}
 m.textContent="Submitting…";
 try{await addDoc(collection(db,"notices"),d);pf.reset();sync();m.textContent="";$("post").close();toast("Submitted! It will appear after admin approval.");burst()}catch(x){m.textContent=err(x)}};

// admin panel
const iso=p=>p.noticeDate||isoDay(p);
function drawAdmin(){const s=$("afs").value,c=$("afc").value,q=$("afq").value.toLowerCase(),dt=$("afd").value;
 const r=ALL.filter(p=>(s=="all"||p.status==s)&&(c=="All"||p.category==c)&&(!dt||p.noticeDate==dt||isoDay(p)==dt)&&(!q||(p.title+" "+p.description+" "+p.authorName).toLowerCase().indexOf(q)>-1)).sort(byNew);
 $("alist").innerHTML=summary()+(r.length?r.map(p=>'<div class="card"><div class="row"><span class="tag '+esc(p.category)+'">'+esc(p.category)+'</span><span class="tag">'+esc(p.status)+'</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+"</p>"+extras(p)+'<div class="meta">By '+esc(p.authorName)+" · "+esc(fd(p))+'</div><div class="acts"><button class="btn pri" data-act="approve" data-id="'+p.id+'">Approve</button><button class="btn" data-act="reject" data-id="'+p.id+'">Reject</button>'+(p.status=="published"?'<button class="btn" data-act="pin" data-o="'+(p.pinned?1:0)+'" data-id="'+p.id+'">'+(p.pinned?"Unpin":"Pin")+'</button>':"")+'<button class="btn" data-act="edit" data-id="'+p.id+'">Edit</button><button class="btn" data-act="del" data-id="'+p.id+'">Delete</button></div></div>').join(""):'<div class="empty">Nothing here.</div>')}
async function loadAll(){try{const s=await getDocs(collection(db,"notices"));ALL=s.docs.map(d=>Object.assign({id:d.id},d.data()));drawAdmin()}catch(x){$("alist").innerHTML='<div class="empty">'+esc(err(x))+"</div>"}}
["afs","afc","afd","afq"].forEach(i=>{$(i).oninput=drawAdmin});
$("aposts").onclick=loadAll;
let SU=[];
$("astu").onclick=async()=>{try{const [s,p]=await Promise.all([getDocs(collection(db,"users")),getDocs(collection(db,"publicProfiles"))]);const ok=new Set(p.docs.map(d=>d.id));
 SU=s.docs.map(d=>Object.assign({id:d.id},d.data())).sort((x,y)=>x.name.localeCompare(y.name));
 $("alist").innerHTML=SU.map(u=>{const v=ok.has(u.id);return '<div class="card"><div class="row"><h3>'+esc(u.name)+'</h3><span class="tag">'+(v?"Approved":"Waiting")+'</span></div><div class="meta">Roll '+esc(u.roll)+" · "+esc(u.year)+" · Session "+esc(u.session)+"<br>"+esc(u.email)+(u.phone?"<br>Phone: "+esc(u.phone):"")+'</div><div class="acts">'+(v?'<button class="btn" data-act="unapprove" data-id="'+u.id+'">Remove from list</button>':'<button class="btn pri" data-act="approve" data-id="'+u.id+'">Approve</button><button class="btn" data-act="deluser" data-id="'+u.id+'">Delete record</button>')+"</div></div>"}).join("")||'<div class="empty">No students.</div>'}catch(x){toast(err(x))}};
$("alist").onclick=async e=>{const b=e.target.closest("button[data-act]");if(!b)return;const id=b.dataset.id,a=b.dataset.act,p=ALL.find(x=>x.id==id);
 if(a=="pin"){try{await updateDoc(doc(db,"notices",id),{pinned:b.dataset.o!="1"});await loadAll();loadPub()}catch(x){toast(err(x))}return}
 if(a=="approveall"){const P=ALL.filter(x=>x.status=="pending").slice(0,400);if(!P.length||!confirm("Approve all "+P.length+" pending posts?"))return;
  try{const wb=writeBatch(db);P.forEach(x=>wb.update(doc(db,"notices",x.id),{status:"published"}));await wb.commit();await loadAll();loadPub();toast("Approved "+P.length+" posts.")}catch(x){toast(err(x))}return}
 if(a=="pcreate"){const q=$("pq").value.trim(),o=$("po").value.split("\n").map(x=>x.trim().slice(0,100)).filter(Boolean);
  if(!q||o.length<2||o.length>6){toast("Add a question and 2 to 6 options.");return}
  try{await addDoc(collection(db,"polls"),{question:q,options:o,open:true,createdAt:serverTimestamp()});toast("Poll created.");adminPolls();loadPolls()}catch(x){toast(err(x))}return}
 if(a=="ptoggle"){try{await updateDoc(doc(db,"polls",id),{open:b.dataset.o!="1"});adminPolls();loadPolls()}catch(x){toast(err(x))}return}
 if(a=="pdel"){if(!confirm("Delete this poll and all its votes?"))return;
  try{const v=await getDocs(collection(db,"polls",id,"votes"));await Promise.all(v.docs.map(x=>deleteDoc(x.ref)));await deleteDoc(doc(db,"polls",id));adminPolls();loadPolls()}catch(x){toast(err(x))}return}
 if(a=="approve"||a=="unapprove"){const u=SU.find(x=>x.id==id);if(!u)return;
  try{if(a=="approve")await setDoc(doc(db,"publicProfiles",id),{name:u.name,roll:u.roll,year:u.year,session:u.session});
  else{if(!confirm("Remove this student from the public list?"))return;await deleteDoc(doc(db,"publicProfiles",id))}
  toast(a=="approve"?"Approved.":"Removed.");$("astu").click()}catch(x){toast(err(x))}return}
 if(a=="deluser"){if(!confirm("Delete this unverified student record? (Delete the login in Firebase → Authentication → Users too.)"))return;try{await deleteDoc(doc(db,"users",id));toast("Record deleted.");$("astu").click()}catch(x){toast(err(x))}return}
 if(!p)return;
 try{
  if(a=="approve"||a=="reject")await updateDoc(doc(db,"notices",id),{status:a=="approve"?"published":"rejected"});
  else if(a=="del"){if(!confirm("Delete this post permanently? This cannot be undone."))return;await deleteDoc(doc(db,"notices",id))}
  else if(a=="edit"){const t=prompt("Title",p.title);if(t===null)return;const d=prompt("Details",p.description);if(d===null)return;if(!t.trim()||!d.trim()){toast("Title and details are required.");return}await updateDoc(doc(db,"notices",id),{title:t.trim(),description:d.trim()})}
  await loadAll();loadPub()}catch(x){toast(err(x))}};
$("admbtn").onclick=()=>{menu(false);$("ap").showModal();loadAll()};

// share
async function share(p){const url=location.href.split("#")[0],x=p.category+": "+p.title+"\n"+p.description.slice(0,150)+(p.description.length>150?"…":"")+"\n"+url;
 try{if(navigator.share){await navigator.share({title:p.title,text:x});return}await navigator.clipboard.writeText(x);toast("Copied. Paste it in your group.")}
 catch(e){if(e&&e.name=="AbortError")return;toast("Could not share. Copy the text manually.")}}

// my posts
let MINE=[];
async function loadMine(){try{const s=await getDocs(query(collection(db,"notices"),where("authorUid","==",me.uid)));MINE=s.docs.map(d=>Object.assign({id:d.id},d.data())).sort(byNew);
 $("mlist").innerHTML=MINE.length?MINE.map(p=>'<div class="card"><div class="row"><span class="tag '+esc(p.category)+'">'+esc(p.category)+'</span><span class="tag">'+esc(p.status)+'</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+"</p>"+(p.status=="pending"?'<div class="acts"><button class="btn" data-m="edit" data-id="'+p.id+'">Edit</button><button class="btn" data-m="del" data-id="'+p.id+'">Delete</button></div>':"")+"</div>").join(""):'<div class="empty">You have not posted anything yet.</div>'}
 catch(x){$("mlist").innerHTML='<div class="empty">'+esc(err(x))+"</div>"}}
$("mlist").onclick=async e=>{const b=e.target.closest("button[data-m]");if(!b)return;const id=b.dataset.id,p=MINE.find(x=>x.id==id);if(!p)return;
 try{if(b.dataset.m=="del"){if(!confirm("Delete this pending post?"))return;await deleteDoc(doc(db,"notices",id))}
 else{const t=prompt("Title",p.title);if(t===null)return;const d=prompt("Details",p.description);if(d===null)return;if(!t.trim()||!d.trim()){toast("Title and details are required.");return}await updateDoc(doc(db,"notices",id),{title:t.trim(),description:d.trim()})}
 loadMine()}catch(x){toast(err(x))}};

// polls
function pollCard(p){const show=p.mine>=0||!p.open;
 return '<div class="card"><div class="row"><span class="tag">Poll</span><span>'+(p.open?"Open":"Closed")+" · "+p.total+' votes</span></div><h3>'+esc(p.question)+"</h3>"+p.options.map((o,i)=>show?'<div class="bar2"><div style="width:'+(p.total?Math.round(p.cnt[i]*100/p.total):0)+'%"></div><span>'+esc(o)+" — "+p.cnt[i]+(p.mine==i?" "+ico("check"):"")+"</span></div>":'<button class="btn" style="text-align:left" data-vote="'+i+'" data-id="'+p.id+'">'+esc(o)+"</button>").join("")+"</div>"}
async function loadPolls(){const el=$("pl");
 if(!(me&&me.emailVerified&&(prof||adm))){el.innerHTML='<div class="empty" style="grid-column:1/-1">'+ico("lock")+'Polls are visible to approved students.</div>';return}
 try{const ps=await getDocs(collection(db,"polls")),L=[];
  for(const d of ps.docs){const o=d.data(),v=await getDocs(collection(db,"polls",d.id,"votes")),cnt=o.options.map(()=>0);let mine=-1;
   v.docs.forEach(x=>{const c=x.data().choice;if(cnt[c]!==undefined)cnt[c]++;if(x.id==me.uid)mine=c});
   L.push(Object.assign({id:d.id,cnt,mine,total:v.size},o))}
  L.sort(byNew);el.innerHTML=L.length?L.map(pollCard).join(""):'<div class="empty" style="grid-column:1/-1">No polls right now.</div>'}
 catch(x){el.innerHTML='<div class="empty" style="grid-column:1/-1">'+esc(err(x))+"</div>"}}
async function vote(pid,i){try{await setDoc(doc(db,"polls",pid,"votes",me.uid),{choice:i});toast("Vote saved.");burst();loadPolls()}catch(x){toast(err(x))}}
async function adminPolls(){try{const ps=await getDocs(collection(db,"polls")),L=ps.docs.map(d=>Object.assign({id:d.id},d.data())).sort(byNew);
 $("alist").innerHTML='<div class="card"><h3>New poll</h3><input id="pq" maxlength="200" placeholder="Question"><textarea id="po" placeholder="One option per line (2 to 6)"></textarea><div class="acts"><button class="btn pri" data-act="pcreate">Create poll</button></div></div>'+L.map(p=>'<div class="card"><div class="row"><span class="tag">'+(p.open?"Open":"Closed")+"</span></div><h3>"+esc(p.question)+'</h3><div class="meta">'+p.options.map(esc).join(" · ")+'</div><div class="acts"><button class="btn" data-act="ptoggle" data-o="'+(p.open?1:0)+'" data-id="'+p.id+'">'+(p.open?"Close":"Reopen")+'</button><button class="btn" data-act="pdel" data-id="'+p.id+'">Delete</button></div></div>').join("")}catch(x){toast(err(x))}}
$("apolls").onclick=adminPolls;

// CSV
$("acsv").onclick=async()=>{try{const [s,p]=await Promise.all([getDocs(collection(db,"users")),getDocs(collection(db,"publicProfiles"))]);const ok=new Set(p.docs.map(d=>d.id));
 const L=s.docs.map(d=>Object.assign({id:d.id},d.data())).sort((x,y)=>x.name.localeCompare(y.name));
 const c=v=>{v=String(v==null?"":v);if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
 const rows=[["Name","Roll","Year","Session","Phone","Email","Status"]].concat(L.map(u=>[u.name,u.roll,u.year,u.session,u.phone,u.email,ok.has(u.id)?"Approved":"Waiting"]));
 const blob=new Blob(["\ufeff"+rows.map(r=>r.map(c).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="students.csv";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}catch(x){toast(err(x))}};

// ui
$("chips").onclick=e=>{const b=e.target.closest("button");if(!b)return;cat=b.dataset.c;[].forEach.call($("chips").children,c=>c.classList.toggle("on",c==b));render()};
$("q").oninput=render;
function menu(o){const n=$("nav");n.classList.toggle("open",o);$("mbk").classList.toggle("on",o);$("bg").classList.toggle("open",o);$("bg").innerHTML=o?ico("x"):ico("menu");
 if(o)[].forEach.call(n.children,(c,i)=>c.style.setProperty("--i",i))}
$("bg").onclick=()=>menu(!$("nav").classList.contains("open"));
$("mbk").onclick=()=>menu(false);
addEventListener("keydown",e=>{if(e.key=="Escape")menu(false)});
$("cpnum").onclick=async()=>{try{await navigator.clipboard.writeText("+8801610426493");toast(L("copied"))}catch(e){toast("+8801610426493")}};
document.addEventListener("click",e=>{
 const sv=e.target.closest("[data-save]");if(sv){const k=sv.dataset.save,i=SAV.indexOf(k);if(i>-1)SAV.splice(i,1);else SAV.push(k);try{localStorage.setItem("bgc-saved",JSON.stringify(SAV))}catch(x){}render();sv.innerHTML=saveBtn(SAV.indexOf(k)>-1);return}
 const sh=e.target.closest("[data-share]");if(sh){const p=PUB.find(x=>x.id==sh.dataset.share);if(p)share(p);return}
 const vt=e.target.closest("[data-vote]");if(vt){vote(vt.dataset.id,+vt.dataset.vote);return}
 const u=e.target.closest("[data-u]");if(u){openProfile(u.dataset.u);return}
 const cd=e.target.closest("article[data-n]");if(cd&&!e.target.closest("a,button")){openNotice(cd.dataset.n);return}
 const o=e.target.closest("[data-open]");
 if(o){menu(false);const k=o.dataset.open;
  if((k=="post"||k=="prd"||k=="mine")&&!prof){toast("Your profile could not be loaded. Log out, log in again, and make sure your email is verified.");return}
  if(k=="prd"){const f=$("mf").elements;f.n.value=prof.name;f.r.value=prof.roll;f.y.value=prof.year;f.s.value=prof.session;f.ph.value="";getDoc(doc(db,"users",me.uid)).then(d=>{if(d.exists())f.ph.value=d.data().phone||""}).catch(()=>{})}
  if(k=="mine")loadMine();$(k).showModal()}
 if(e.target.closest("[data-close]"))e.target.closest("dialog").close();
 if(e.target.tagName=="DIALOG")e.target.close();
 if(e.target.closest("nav a"))menu(false)});

// ---- design extras ----
function chips(p){let h=p.pinned?'<span class="chip hot">'+ico("pin")+L("pin")+"</span>":"";const now=Date.now(),dd=s=>Math.ceil((new Date(s+"T23:59:59")-now)/864e5);
 if(p.createdAt&&p.createdAt.seconds&&now-p.createdAt.seconds*1000<3*864e5)h+='<span class="chip new">'+L("new")+"</span>";
 if(p.category=="Assignment"&&p.deadline){const d=dd(p.deadline);h+=d<0?'<span class="chip late">Overdue</span>':d==0?'<span class="chip hot">Due today</span>':'<span class="chip '+(d<=2?"hot":"ok")+'">'+d+" day"+(d>1?"s":"")+" left</span>"}
 if(p.category=="Exam"&&p.noticeDate){const d=dd(p.noticeDate);if(d>=0)h+='<span class="chip '+(d<=2?"hot":"ok")+'">'+(d==0?"Today":d==1?"Tomorrow":d+" days")+"</span>"}
 return h}
function countUp(el,to){const from=+el.textContent||0,t0=performance.now(),f=t=>{const k=Math.min(1,(t-t0)/700);el.textContent=Math.round(from+(to-from)*k);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function stats(){const c=k=>PUB.filter(p=>p.category==k).length;
 countUp($("sN"),c("Notice"));countUp($("sA"),c("Assignment"));countUp($("sE"),c("Exam"));
 const L=PUB.slice().sort(byNew).slice(0,3);$("tick").innerHTML=L.length?L.map(p=>"<i>"+esc(p.title)+"</i>").join(""):"<i>No updates yet</i>"}
const pg=document.createElement("div");pg.id="prog";B.appendChild(pg);
const tp=document.createElement("button");tp.id="top2";tp.innerHTML=ico("up");tp.setAttribute("aria-label","Back to top");tp.onclick=()=>scrollTo({top:0,behavior:"smooth"});B.appendChild(tp);
addEventListener("scroll",()=>{const h=document.documentElement,m=h.scrollHeight-h.clientHeight;pg.style.width=(m>0?h.scrollTop/m*100:0)+"%";tp.classList.toggle("show",h.scrollTop>500)},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("vis");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".hd,.stat,.themes").forEach(x=>{x.classList.add("rv");io.observe(x)});

// ---- bigger design updates ----
let SAV=[];try{SAV=JSON.parse(localStorage.getItem("bgc-saved")||"[]")}catch(e){}
const calm=false;
(function(){const el=$("ty"),WS={en:["notices","assignments","exam updates","class polls","everything Soil Science"],bn:["নোটিশ","অ্যাসাইনমেন্ট","পরীক্ষার খবর","ক্লাস পোল","সয়েল সায়েন্সের সবকিছু"]};let w=0,i=0,del=false;
 if(calm){el.textContent=WS.en[0];return}
 (function t(){const W=WS[LG]||WS.en,s=W[w%W.length];el.textContent=s.slice(0,i);
  if(!del&&i<s.length){i++;setTimeout(t,85)}else if(!del){del=true;setTimeout(t,1400)}
  else if(i>0){i--;setTimeout(t,40)}else{del=false;w=(w+1)%W.length;setTimeout(t,300)}})()})();

function burst(){try{navigator.vibrate&&navigator.vibrate([20,30,20])}catch(x){}if(calm)return;for(let i=0;i<18;i++){const s=document.createElement("span");s.className="bu";s.innerHTML=shp(["leaf","spark","petal","dust"][i%4]);s.style.color=i%2?"var(--a2)":"var(--ac)";const a=Math.random()*6.28,d=90+Math.random()*130;s.style.setProperty("--x",Math.cos(a)*d+"px");s.style.setProperty("--y",Math.sin(a)*d+"px");B.appendChild(s);setTimeout(()=>s.remove(),1000)}}

// ---- full notice view ----
const linkify=t=>esc(t).replace(/(https?:\/\/[^\s<]+)/g,u=>'<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+u+"</a>");
function openNotice(id){const p=PUB.find(x=>x.id==id);if(!p)return;
 const rows=[["Subject",p.subject],["Teacher",p.teacher],["Department",p.department],["Class",p.classYear],["Issued",p.issuedDate],["Deadline",p.deadline],["Exam time",p.examTime]].filter(x=>x[1]),src=imgSrc(p.attachmentUrl),u=esc(p.attachmentUrl||"");
 $("ndb").innerHTML='<div class="row"><span class="tag '+esc(p.category)+'">'+esc(p.category)+"</span>"+chips(p)+"<span>"+ico("cal")+esc(fd(p))+"</span></div><h2"+bn(p.title)+">"+esc(p.title)+"</h2>"
 +(rows.length?'<div class="facts">'+rows.map(r=>"<div><small>"+r[0]+"</small><b>"+esc(r[1])+"</b></div>").join("")+"</div>":"")
 +'<div class="nbody'+(bn(p.description)?" bn":"")+'">'+linkify(p.description)+"</div>"
 +(src?'<a href="'+u+'" target="_blank" rel="noopener noreferrer"><img class="pimg big" src="'+esc(src)+'" alt="Attachment" onerror="this.parentNode.style.display=\'none\'"></a>':"")
 +(okUrl(p.attachmentUrl)?'<p><a class="btn pri" style="text-decoration:none;display:inline-block" href="'+u+'" target="_blank" rel="noopener noreferrer">'+ico("clip")+'Open attachment</a></p>':"")
 +'<div class="acts"><button class="btn" data-share="'+esc(p.id)+'">'+ico("share")+L("share")+'</button><button class="btn" data-save="'+esc(p.id)+'">'+saveBtn(SAV.indexOf(p.id)>-1)+'</button></div><div class="meta" style="margin-top:12px">Posted by <button class="au" data-u="'+esc(p.authorUid)+'">'+esc(p.authorName)+"</button></div>";
 $("nd").showModal()}

// ---- language, admin summary, offline, extras ----
const TR={nNot:["Notices","নোটিশ"],nStu:["Students","শিক্ষার্থী"],nAdm:["Admin Info","অ্যাডমিন তথ্য"],nGrp:["Notice Group","নোটিশ গ্রুপ"],nLog:["Log in","লগইন"],nReg:["Register","রেজিস্টার"],nNew:["New post","নতুন পোস্ট"],nPrf:["My profile","আমার প্রোফাইল"],nMine:["My posts","আমার পোস্ট"],nAdmP:["Admin panel","অ্যাডমিন প্যানেল"],nOut:["Log out","লগআউট"],browse:["Browse notices","নোটিশ দেখুন"],stay:["Stay updated with","আপডেট পান:"],sub:["Shared by students, approved by the admin.","শিক্ষার্থীরা শেয়ার করে, অ্যাডমিন অনুমোদন করেন।"],hLat:["LATEST UPDATES","সর্বশেষ আপডেট"],hBoard:["Notice Board","নোটিশ বোর্ড"],srch:["Search title, details or author…","শিরোনাম, বিবরণ বা লেখক খুঁজুন…"],cAll:["All","সব"],cNot:["Notice","নোটিশ"],cAss:["Assignment","অ্যাসাইনমেন্ট"],cExa:["Exam","পরীক্ষা"],cSav:["Saved","সংরক্ষিত"],sN:["Notices","নোটিশ"],sA:["Assignments","অ্যাসাইনমেন্ট"],sE:["Exams","পরীক্ষা"],hPoll:["CLASS POLLS","ক্লাস পোল"],hPollT:["Polls","পোল"],hStu:["STUDENT DIRECTORY","শিক্ষার্থী তালিকা"],hStuT:["Our Students","আমাদের শিক্ষার্থী"],tHome:["Home","হোম"],tNot:["Notices","নোটিশ"],tPoll:["Polls","পোল"],tStu:["Students","শিক্ষার্থী"],tLog:["Log in","লগইন"],tPrf:["Profile","প্রোফাইল"],more:["Read full notice →","পুরো নোটিশ পড়ুন →"],share:["Share","শেয়ার"],save:["Save","সেভ"],saved:["Saved","সেভ করা"],by:["By","লেখক:"],new:["NEW","নতুন"],pin:["URGENT","জরুরি"],ref:["Refreshed","রিফ্রেশ হয়েছে"],back:["Back","পেছনে"],wTitle:["Welcome! Log in or create an account","স্বাগতম! লগইন করুন বা অ্যাকাউন্ট খুলুন"],wText:["Log in or register to post notices, vote in polls and see your classmates. You can read all notices without an account.","নোটিশ পোস্ট করতে, পোলে ভোট দিতে ও সহপাঠীদের দেখতে লগইন বা রেজিস্টার করুন। নোটিশ পড়তে কোনো অ্যাকাউন্ট লাগে না।"],copied:["Number copied","নম্বর কপি হয়েছে"],off:["You are offline","আপনি অফলাইনে আছেন"],on:["Back online","আবার অনলাইনে"]};
const L=k=>(TR[k]||[k,k])[LG=="bn"?1:0];
function applyLang(){document.documentElement.lang=LG;
 document.querySelectorAll("[data-t]").forEach(e=>{const t=L(e.dataset.t);e.innerHTML=(e.dataset.ic?ico(e.dataset.ic):"")+esc(t)});
 document.querySelectorAll("[data-tp]").forEach(e=>{e.placeholder=L(e.dataset.tp)});
 $("lgEN").classList.toggle("on",LG=="en");$("lgBN").classList.toggle("on",LG=="bn");render()}
const setLang=l=>{LG=l;try{localStorage.setItem("bgc-lang",l)}catch(e){}applyLang()};
$("lgEN").onclick=()=>setLang("en");$("lgBN").onclick=()=>setLang("bn");
document.querySelectorAll("[data-ic]:not([data-t])").forEach(e=>e.insertAdjacentHTML("afterbegin",ico(e.dataset.ic)));
applyLang();
function summary(){const c=k=>ALL.filter(p=>p.status==k).length;
 return '<div class="facts"><div><small>Pending</small><b>'+c("pending")+'</b></div><div><small>Published</small><b>'+c("published")+'</b></div><div><small>Rejected</small><b>'+c("rejected")+"</b></div></div>"+(c("pending")?'<div class="acts"><button class="btn pri" data-act="approveall">Approve all pending ('+c("pending")+")</button></div>":"")}
matchMedia("(prefers-color-scheme:dark)").addEventListener("change",()=>{let s="";try{s=localStorage.getItem("bgc-theme")}catch(e){}if(s=="auto")setTheme("auto")});
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
addEventListener("offline",()=>toast(L("off")));addEventListener("online",()=>{toast(L("on"));loadPub()});
let ty0=null;addEventListener("touchstart",e=>{ty0=scrollY<=0?e.touches[0].clientY:null},{passive:true});
addEventListener("touchend",e=>{if(ty0!=null&&e.changedTouches[0].clientY-ty0>120){loadPub();loadPolls();toast(L("ref"))}ty0=null},{passive:true});
if(!calm&&matchMedia("(hover:hover)").matches){const ls=$("list");
 ls.addEventListener("pointermove",e=>{const c=e.target.closest(".card");if(!c||c.classList.contains("sk"))return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform="perspective(700px) rotateY("+x*6+"deg) rotateX("+(-y*6)+"deg) translateY(-3px)"});
 ls.addEventListener("pointerout",e=>{const c=e.target.closest(".card");if(c)c.style.transform=""})}
{const tabs=[].slice.call(document.querySelectorAll(".tabbar a")),so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)tabs.forEach(a=>a.classList.toggle("on",a.getAttribute("href")=="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
 ["top","board","polls","students"].forEach(i=>{const s=$(i);if(s)so.observe(s)})}


// ---- always-on animations, theme by theme ----
var FXC={forest:[["leaf","sprout","leaf"],"fall"],ocean:[["bubble","drop","bubble"],"rise"],midnight:[["spark","moon","spark"],"twinkle"],graphite:[["spark","dust","dust"],"rise"],burgundy:[["petal","flower","petal"],"fall"],slate:[["cloud","bubble","cloud"],"drift"],rose:[["petal","flower","petal"],"fall"],olive:[["grain","leaf","grain"],"fall"],paper:[["dust","spark","dust"],"drift"],clay:[["leaf","dust","dust"],"drift"],emerald:[["dust","leaf","spark"],"rise"],aurora:[["spark","dust","spark"],"twinkle"]};
function fx(){const t=document.documentElement.dataset.theme,c=FXC&&FXC[t];if(!c)return;
 let f=$("fx");if(!f){f=document.createElement("div");f.id="fx";B.appendChild(f)}
 f.className="fx "+c[1];f.innerHTML="";const r=Math.random,still=c[1]=="drift"||c[1]=="twinkle";
 for(let i=0;i<9;i++){const p=document.createElement("i");p.className="fxp "+(i%2?"a":"b");p.innerHTML=shp(c[0][i%c[0].length]);
  p.style.cssText="left:"+r()*100+"%;top:"+(still?r()*100+"%":"0")+";font-size:"+(12+r()*20)+"px;animation-duration:"+(8+r()*10)+"s;animation-delay:"+(-r()*14)+"s;--dx:"+((r()-.5)*160)+"px;--dy:"+((r()-.5)*120)+"px";f.appendChild(p)}
 const h=document.querySelector(".hero");h.querySelectorAll(".pt").forEach(x=>x.remove());
 for(let i=0;i<6;i++){const p=document.createElement("i");p.className="pt";p.innerHTML=shp(c[0][i%c[0].length]);p.style.left=(6+i*16)+"%";p.style.fontSize=(14+r()*10)+"px";p.style.animationDuration=(9+r()*8)+"s";p.style.animationDelay=(-r()*9)+"s";h.appendChild(p)}}
function wipe(e){const w=document.createElement("div");w.className="wipe";w.style.left=e.clientX+"px";w.style.top=e.clientY+"px";B.appendChild(w);setTimeout(()=>w.remove(),950)}
document.addEventListener("pointerdown",e=>{const t=e.target.closest(".btn,.ct,.chips button,.tabbar a,.tabbar button,nav>a");if(!t)return;
 const r=t.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement("span");s.className="rp";
 s.style.cssText="width:"+d+"px;height:"+d+"px;left:"+(e.clientX-r.left-d/2)+"px;top:"+(e.clientY-r.top-d/2)+"px";t.appendChild(s);setTimeout(()=>s.remove(),650)});
fx();

// ---- admin photo: put a square admin.jpg (or admin.png) next to index.html in GitHub ----
{const i=$("admImg"),F=["admin.jpg","admin.png","logo.png"];let k=0;i.onerror=()=>{k++;if(k<F.length){i.classList.toggle("ph",k<2);i.src=F[k]}};i.src=F[0]}
// ---- students page (#/students) ----
let wasSt=false;
function route(){const s=location.hash=="#/students";B.classList.toggle("pg-st",s);
 if(s)[].forEach.call(document.querySelectorAll(".tabbar a"),a=>a.classList.toggle("on",a.getAttribute("href")=="#/students"));
 if(s)loadDir();
 if(s!==wasSt){wasSt=s;if(s)scrollTo(0,0);else{const t=location.hash.length>2?$(location.hash.slice(1)):null;requestAnimationFrame(()=>t?t.scrollIntoView():scrollTo(0,0))}}}
addEventListener("hashchange",route);route();
