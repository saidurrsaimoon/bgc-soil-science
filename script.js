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
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
moon:'<path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z"/>',
book:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19a2 2 0 012-2h13"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
down:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>',
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
const YR=["1st Year","2nd Year","3rd Year","4th Year","Masters"];
const SS=["2020-2021","2021-2022","2022-2023","2023-2024","2024-2025","2025-2026","2026-2027"];
const TH=[["slate","Slate Mist","#3f5b7a"],["black","Black Night","#2dd4bf"]];
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const PH=/^(\+?88)?01[3-9]\d{8}$/;
const okUrl=u=>/^https?:\/\//i.test(u||"");
const secs=p=>(p.createdAt&&p.createdAt.seconds)||0;
const byNew=(a,b)=>secs(b)-secs(a);
const byPin=(a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||byNew(a,b);
const isoDay=p=>p.createdAt&&p.createdAt.toDate?p.createdAt.toDate().toISOString().slice(0,10):"";
function fd(p){const d=p.noticeDate?new Date(p.noticeDate+"T00:00:00"):(p.createdAt&&p.createdAt.toDate?p.createdAt.toDate():null);return d&&!isNaN(d)?d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):""}
function toast(t){try{navigator.vibrate&&navigator.vibrate(12)}catch(x){}const e=$("toast");e.textContent=T(t);e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("show"),5000)}
function err(e){return T(err0(e))}
function err0(e){const c=(e&&e.code)||"";const m={"auth/email-already-in-use":"This email is already registered. Try logging in.","auth/invalid-credential":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/invalid-email":"Please enter a valid email.","auth/weak-password":"Password must be at least 8 characters.","auth/too-many-requests":"Too many attempts. Please wait a while and try again.","auth/network-request-failed":"Network problem. Check your internet connection."};
 if(m[c])return m[c];if(c.indexOf("permission")>-1)return "Not allowed. Log in with a verified email, or check the Firestore rules.";return "Something went wrong. "+((e&&e.message)||"")}

document.querySelectorAll(".yr").forEach(s=>s.innerHTML=YR.map(y=>"<option>"+y+"</option>").join(""));
document.querySelectorAll(".ss").forEach(s=>{s.innerHTML=SS.map(y=>"<option>"+y+"</option>").join("");s.value="2025-2026"});

// themes
function setTheme(k){document.documentElement.dataset.theme=k=="auto"?(matchMedia("(prefers-color-scheme:dark)").matches?"emerald":"forest"):k;try{localStorage.setItem("bgc-theme",k)}catch(e){}$("sw").classList.toggle("night",k=="black");if(typeof fx=="function")fx()}
$("sw").innerHTML='<button class="tgb" type="button" aria-label="Switch theme"><span class="sun">'+ico("sun")+'</span><span class="moon">'+ico("moon")+'</span><i class="knob"></i></button>';
$("sw").onclick=e=>{const k=document.documentElement.dataset.theme=="slate"?"black":"slate";setTheme(k);wipe(e)};
let st="slate";try{st=localStorage.getItem("bgc-theme")||st}catch(e){}
setTheme(TH.some(t=>t[0]==st)?st:"slate");

// state
let HASPOLL=false,PG="",FS=1,DIP=null,LAST=0;try{FS=+localStorage.getItem("bgc-fs")||1;LAST=+localStorage.getItem("bgc-last")||0}catch(e){}
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
 const r=PUB.filter(p=>p.category!="Resource"&&(cat=="All"||p.category==cat||(cat=="Saved"&&SAV.indexOf(p.id)>-1))&&(!q||[p.title,p.description,p.authorName].join(" ").toLowerCase().indexOf(q)>-1)).sort(byPin);
 $("list").innerHTML=r.length?r.map(card).join(""):'<div class="empty" style="grid-column:1/-1">No notices found for this category yet.</div>'}
async function loadPub(){try{const s=await getDocs(query(collection(db,"notices"),where("status","==","published")));PUB=s.docs.map(d=>Object.assign({id:d.id},d.data()))}catch(e){PUB=[];toast(err(e))}render();stats();newBadge()}
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
 B.className=(u?"a-in ":"")+(u&&u.emailVerified?"a-ver ":"")+(prof?"a-apr ":"")+(adm?"a-adm ":"")+(PG?"pg pg-"+PG+" ":"")+(HASPOLL?"":"no-polls");
 if(PG=="st")loadDir();if(PG=="rou")loadRoutine();loadPolls();loadPub();loadAnn();
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
 catch(x){m.textContent=err(x),shake(m)}};
$("lf").onsubmit=async e=>{e.preventDefault();const f=e.target,m=f.querySelector(".msg");m.textContent="Logging in…";
 try{await signInWithEmailAndPassword(auth,f.elements.e.value.trim(),f.elements.p.value);f.reset();m.textContent="";$("login").close()}catch(x){m.textContent=err(x),shake(m)}};
$("forgot").onclick=async()=>{const m=$("lf").querySelector(".msg"),em=$("lf").elements.e.value.trim();
 if(!em){m.textContent="Type your email above first.";return}
 try{await sendPasswordResetEmail(auth,em);m.textContent="Password reset email sent (check Spam)."}catch(x){m.textContent=err(x),shake(m)}};
$("resend").onclick=async()=>{try{await sendEmailVerification(auth.currentUser);toast("Verification email sent. Check inbox and Spam.")}catch(x){toast(err(x))}};
$("logout").onclick=()=>signOut(auth);
$("mf").onsubmit=async e=>{e.preventDefault();const f=e.target,m=f.querySelector(".msg");
 const v={name:f.elements.n.value.trim(),roll:f.elements.r.value.trim(),year:f.elements.y.value,session:f.elements.s.value};
 const ph=f.elements.ph.value.trim();if(!PH.test(ph)){m.textContent="A valid Bangladeshi phone number is required (like 01XXXXXXXXX).";return}
 try{const b=writeBatch(db);b.update(doc(db,"users",me.uid),Object.assign({},v,{phone:ph}));b.update(doc(db,"publicProfiles",me.uid),v);await b.commit();prof=v;m.textContent="";$("prd").close();toast("Profile updated.");loadDir()}catch(x){m.textContent=err(x),shake(m)}};

// new post
const pf=$("pf"),pc=$("pcat");
const sync=()=>{pf.querySelectorAll("[data-for]").forEach(d=>d.hidden=d.dataset.for.split(" ").indexOf(pc.value)<0);$("dl").textContent=pc.value=="Exam"?"Exam date":pc.value=="Assignment"?"Assignment date (optional)":pc.value=="Resource"?"Date (optional)":"Notice date"};
pc.onchange=sync;sync();
pf.onsubmit=async e=>{e.preventDefault();const m=pf.querySelector(".msg"),g=k=>pf.elements[k].value.trim();
 if(!(me&&me.emailVerified&&prof)){m.textContent="A verified account with a profile is required.";return}
 const d={category:pc.value,title:g("title"),description:g("description"),authorUid:me.uid,authorName:prof.name,status:"pending",createdAt:serverTimestamp()};
 pf.querySelectorAll("[data-for]").forEach(w=>{if(w.hidden)return;w.querySelectorAll("input").forEach(i=>{if(i.value.trim())d[i.name]=i.value.trim()})});
 if(d.category=="Resource"&&!d.attachmentUrl){m.textContent="Add the Drive link for the material.";shake(m);return}
 if(d.attachmentUrl&&!okUrl(d.attachmentUrl)){m.textContent="Attachment link must start with http:// or https://";return}
 m.textContent="Submitting…";
 try{await addDoc(collection(db,"notices"),d);pf.reset();sync();m.textContent="";$("post").close();toast("Submitted! It will appear after admin approval.");burst()}catch(x){m.textContent=err(x),shake(m)}};

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
 if(a=="radd"){const v=k=>$(k).value.trim(),r={day:$("rd").value,time:v("rt"),subject:v("rs"),teacher:v("rth"),room:v("rr")};
  if(!r.time||!r.subject){toast("Add the time and the subject.");return}RR.push(r);drawRou();return}
 if(a=="rdel"){RR.splice(+b.dataset.i,1);drawRou();return}
 if(a=="rsave"){try{await setDoc(doc(db,"routines",RY),{rows:RR,updatedAt:serverTimestamp()});toast("Routine saved.");okTick()}catch(x){toast(err(x))}return}
 if(a=="asave"||a=="aclear"){try{await setDoc(doc(db,"settings","announcement"),{text:a=="asave"?$("at").value.trim().slice(0,200):"",updatedAt:serverTimestamp()});toast("Announcement saved.");loadAnn();if(a=="aclear")$("at").value=""}catch(x){toast(err(x))}return}
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
  if(a=="approve"||a=="reject")await updateDoc(doc(db,"notices",id),{status:a=="approve"?"published":"rejected"}).then(()=>{if(a=="approve")okTick()});
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
 $("mlist").innerHTML=MINE.length?MINE.map(p=>'<div class="card"><div class="row"><span class="tag '+esc(p.category)+'">'+esc(p.category)+'</span><span class="tag">'+esc(p.status)+'</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+"</p>"+'<div class="acts">'+(p.status=="pending"?'<button class="btn" data-m="edit" data-id="'+p.id+'">Edit</button>':"")+'<button class="btn" data-m="del" data-id="'+p.id+'">Delete</button></div>'+"</div>").join(""):'<div class="empty">You have not posted anything yet.</div>'}
 catch(x){$("mlist").innerHTML='<div class="empty">'+esc(err(x))+"</div>"}}
$("mlist").onclick=async e=>{const b=e.target.closest("button[data-m]");if(!b)return;const id=b.dataset.id,p=MINE.find(x=>x.id==id);if(!p)return;
 try{if(b.dataset.m=="del"){if(!confirm("Delete this post? This cannot be undone."))return;await deleteDoc(doc(db,"notices",id))}
 else{const t=prompt("Title",p.title);if(t===null)return;const d=prompt("Details",p.description);if(d===null)return;if(!t.trim()||!d.trim()){toast("Title and details are required.");return}await updateDoc(doc(db,"notices",id),{title:t.trim(),description:d.trim()})}
 loadMine();loadPub()}catch(x){toast(err(x))}};

// polls
function pollCard(p){const show=p.mine>=0||!p.open;
 return '<div class="card"><div class="row"><span class="tag">Poll</span><span>'+(p.open?"Open":"Closed")+" · "+p.total+' votes</span></div><h3>'+esc(p.question)+"</h3>"+p.options.map((o,i)=>show?'<div class="bar2"><div style="width:'+(p.total?Math.round(p.cnt[i]*100/p.total):0)+'%"></div><span>'+esc(o)+" — "+p.cnt[i]+(p.mine==i?" "+ico("check"):"")+"</span></div>":'<button class="btn" style="text-align:left" data-vote="'+i+'" data-id="'+p.id+'">'+esc(o)+"</button>").join("")+"</div>"}
async function loadPolls(){const el=$("pl");
 if(!(me&&me.emailVerified&&(prof||adm))){el.innerHTML='<div class="empty" style="grid-column:1/-1">'+ico("lock")+'Polls are visible to approved students.</div>';HASPOLL=false;B.classList.add("no-polls");return}
 try{const ps=await getDocs(collection(db,"polls")),L=[];
  for(const d of ps.docs){const o=d.data(),v=await getDocs(collection(db,"polls",d.id,"votes")),cnt=o.options.map(()=>0);let mine=-1;
   v.docs.forEach(x=>{const c=x.data().choice;if(cnt[c]!==undefined)cnt[c]++;if(x.id==me.uid)mine=c});
   L.push(Object.assign({id:d.id,cnt,mine,total:v.size},o))}
  L.sort(byNew);HASPOLL=L.length>0;B.classList.toggle("no-polls",!HASPOLL);el.innerHTML=L.length?L.map(pollCard).join(""):'<div class="empty" style="grid-column:1/-1">No polls right now.</div>'}
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
 const ps=e.target.closest("[data-poster]");if(ps){const p=PUB.find(x=>x.id==ps.dataset.poster);if(p)poster(p);return}
 const dl=e.target.closest("[data-del]");if(dl){const id=dl.dataset.del;if(!confirm("Delete this post? This cannot be undone."))return;
  deleteDoc(doc(db,"notices",id)).then(()=>{$("nd").close();toast("Post deleted.");loadPub()}).catch(x=>toast(err(x)));return}
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
 if(p.category=="Assignment"&&p.deadline){const d=dd(p.deadline);h+=(d>=0?ring(d):"")+(d<0?'<span class="chip late">Overdue</span>':d==0?'<span class="chip hot">Due today</span>':'<span class="chip '+(d<=2?"hot":"ok")+'">'+d+" day"+(d>1?"s":"")+" left</span>")}
 if(p.category=="Exam"&&p.noticeDate){const d=dd(p.noticeDate);if(d>=0)h+='<span class="chip '+(d<=2?"hot":"ok")+'">'+(d==0?"Today":d==1?"Tomorrow":d+" days")+"</span>"}
 return h}
function countUp(el,to){const from=+el.textContent||0,t0=performance.now(),f=t=>{const k=Math.min(1,(t-t0)/700);el.textContent=Math.round(from+(to-from)*k);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function stats(){const c=k=>PUB.filter(p=>p.category==k).length;
 countUp($("sN"),c("Notice"));countUp($("sA"),c("Assignment"));countUp($("sE"),c("Exam"));
 const L=PUB.slice().sort(byNew).slice(0,3);$("tick").innerHTML=L.length?L.map(p=>"<i>"+esc(p.title)+"</i>").join(""):"<i>No updates yet</i>"}
const pg=document.createElement("div");pg.id="prog";B.appendChild(pg);
const tp=document.createElement("button");tp.id="top2";tp.innerHTML=ico("up");tp.setAttribute("aria-label","Back to top");tp.onclick=()=>scrollTo({top:0,behavior:"smooth"});B.appendChild(tp);
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

function burst(){try{navigator.vibrate&&navigator.vibrate([20,30,20])}catch(x){}okTick();if(calm)return;for(let i=0;i<18;i++){const s=document.createElement("span");s.className="bu";s.innerHTML=shp(["leaf","spark","petal","dust"][i%4]);s.style.color=i%2?"var(--a2)":"var(--ac)";const a=Math.random()*6.28,d=90+Math.random()*130;s.style.setProperty("--x",Math.cos(a)*d+"px");s.style.setProperty("--y",Math.sin(a)*d+"px");B.appendChild(s);setTimeout(()=>s.remove(),1000)}}

// ---- full notice view ----
const linkify=t=>esc(t).replace(/(https?:\/\/[^\s<]+)/g,u=>'<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+u+"</a>");
function openNotice(id){const p=PUB.find(x=>x.id==id);if(!p)return;
 const rows=[["Subject",p.subject],["Teacher",p.teacher],["Department",p.department],["Class",p.classYear],["Issued",p.issuedDate],["Deadline",p.deadline],["Exam time",p.examTime]].filter(x=>x[1]),src=imgSrc(p.attachmentUrl),u=esc(p.attachmentUrl||"");
 $("ndb").innerHTML='<div class="row"><span class="tag '+esc(p.category)+'">'+esc(p.category)+"</span>"+chips(p)+"<span>"+ico("cal")+esc(fd(p))+"</span></div><h2"+bn(p.title)+">"+esc(p.title)+"</h2>"
 +(rows.length?'<div class="facts">'+rows.map(r=>"<div><small>"+r[0]+"</small><b>"+esc(r[1])+"</b></div>").join("")+"</div>":"")
 +'<div class="nbody'+(bn(p.description)?" bn":"")+'">'+linkify(p.description)+"</div>"
 +(src?'<a href="'+u+'" target="_blank" rel="noopener noreferrer"><img class="pimg big" src="'+esc(src)+'" alt="Attachment" onerror="this.parentNode.style.display=\'none\'"></a>':"")
 +(okUrl(p.attachmentUrl)?'<p><a class="btn pri" style="text-decoration:none;display:inline-block" href="'+u+'" target="_blank" rel="noopener noreferrer">'+ico("clip")+'Open attachment</a></p>':"")
 +'<div class="acts"><button class="btn" data-share="'+esc(p.id)+'">'+ico("share")+L("share")+'</button><button class="btn" data-save="'+esc(p.id)+'">'+saveBtn(SAV.indexOf(p.id)>-1)+'</button><button class="btn" data-poster="'+esc(p.id)+'">'+ico("image")+T("Share as image")+'</button>'+calBtn(p)+((adm||(me&&p.authorUid==me.uid))?'<button class="btn" data-del="'+esc(p.id)+'">'+ico("x")+'Delete</button>':"")+'</div><div class="meta" style="margin-top:12px">Posted by <button class="au" data-u="'+esc(p.authorUid)+'">'+esc(p.authorName)+"</button></div>";
 $("nd").showModal()}

// ---- language, admin summary, offline, extras ----
const TR={nNot:["Notices","নোটিশ"],nStu:["Students","শিক্ষার্থী"],nAdm:["Admin Info","অ্যাডমিন তথ্য"],nGrp:["Notice Group","নোটিশ গ্রুপ"],nLog:["Log in","লগইন"],nReg:["Register","রেজিস্টার"],nNew:["New post","নতুন পোস্ট"],nPrf:["My profile","আমার প্রোফাইল"],nMine:["My posts","আমার পোস্ট"],nAdmP:["Admin panel","অ্যাডমিন প্যানেল"],nOut:["Log out","লগআউট"],browse:["Browse notices","নোটিশ দেখুন"],stay:["Stay updated with","আপডেট পান:"],sub:["Shared by students, approved by the admin.","শিক্ষার্থীরা শেয়ার করে, অ্যাডমিন অনুমোদন করেন।"],hLat:["LATEST UPDATES","সর্বশেষ আপডেট"],hBoard:["Notice Board","নোটিশ বোর্ড"],srch:["Search title, details or author…","শিরোনাম, বিবরণ বা লেখক খুঁজুন…"],cAll:["All","সব"],cNot:["Notice","নোটিশ"],cAss:["Assignment","অ্যাসাইনমেন্ট"],cExa:["Exam","পরীক্ষা"],cSav:["Saved","সংরক্ষিত"],sN:["Notices","নোটিশ"],sA:["Assignments","অ্যাসাইনমেন্ট"],sE:["Exams","পরীক্ষা"],hPoll:["CLASS POLLS","ক্লাস পোল"],hPollT:["Polls","পোল"],hStu:["STUDENT DIRECTORY","শিক্ষার্থী তালিকা"],hStuT:["Our Students","আমাদের শিক্ষার্থী"],tHome:["Home","হোম"],tNot:["Notices","নোটিশ"],tPoll:["Polls","পোল"],tStu:["Students","শিক্ষার্থী"],tLog:["Log in","লগইন"],tPrf:["Profile","প্রোফাইল"],more:["Read full notice →","পুরো নোটিশ পড়ুন →"],share:["Share","শেয়ার"],save:["Save","সেভ"],saved:["Saved","সেভ করা"],by:["By","লেখক:"],new:["NEW","নতুন"],pin:["URGENT","জরুরি"],ref:["Refreshed","রিফ্রেশ হয়েছে"],back:["Back","পেছনে"],nLib:["Library","লাইব্রেরি"],nRou:["Routine","ক্লাস রুটিন"],nInst:["Install app","অ্যাপ ইনস্টল করুন"],hLibS:["STUDY MATERIAL","পড়ার উপকরণ"],hLib:["Library","লাইব্রেরি"],hRouS:["CLASS ROUTINE","ক্লাস রুটিন"],hRou:["Class Routine","ক্লাস রুটিন"],srch2:["Search material…","উপকরণ খুঁজুন…"],cTheme:["Theme","থিম"],cFx:["Effects","ইফেক্ট"],cText:["Text size","লেখার আকার"],qLib:["Lecture notes, questions, suggestions","লেকচার নোট, প্রশ্ন, সাজেশন"],qRou:["See the weekly class schedule","সাপ্তাহিক ক্লাসের সময়সূচি দেখুন"],wTitle:["Welcome! Log in or create an account","স্বাগতম! লগইন করুন বা অ্যাকাউন্ট খুলুন"],wText:["Log in or register to post notices, vote in polls and see your classmates. You can read all notices without an account.","নোটিশ পোস্ট করতে, পোলে ভোট দিতে ও সহপাঠীদের দেখতে লগইন বা রেজিস্টার করুন। নোটিশ পড়তে কোনো অ্যাকাউন্ট লাগে না।"],copied:["Number copied","নম্বর কপি হয়েছে"],off:["You are offline","আপনি অফলাইনে আছেন"],on:["Back online","আবার অনলাইনে"]};
const L=k=>(TR[k]||[k,k])[LG=="bn"?1:0];
function applyLang(){document.documentElement.lang=LG;
 document.querySelectorAll("[data-t]").forEach(e=>{const t=L(e.dataset.t);e.innerHTML=(e.dataset.ic?ico(e.dataset.ic):"")+esc(t)});
 document.querySelectorAll("[data-tp]").forEach(e=>{e.placeholder=L(e.dataset.tp)});
 $("lgEN").classList.toggle("on",LG=="en");$("lgBN").classList.toggle("on",LG=="bn");render();walk(document.body);document.querySelectorAll("nav [data-t]").forEach(e=>{e.title=e.textContent})}
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
var FXC={slate:[["cloud","bubble","cloud"],"drift"],black:[["spark","moon","spark"],"twinkle"]};
function fx(){const t=document.documentElement.dataset.theme,c=FXC&&FXC[t];if(!c)return;
 let f=$("fx");if(!f){f=document.createElement("div");f.id="fx";B.appendChild(f)}
 f.className="fx "+c[1];f.innerHTML="";const r=Math.random,still=c[1]=="drift"||c[1]=="twinkle";
 for(let i=0;i<7;i++){const p=document.createElement("i");p.className="fxp "+(i%2?"a":"b");p.innerHTML=shp(c[0][i%c[0].length]);
  p.style.cssText="left:"+r()*100+"%;top:"+(still?r()*100+"%":"0")+";font-size:"+(12+r()*20)+"px;animation-duration:"+(8+r()*10)+"s;animation-delay:"+(-r()*14)+"s;--dx:"+((r()-.5)*160)+"px;--dy:"+((r()-.5)*120)+"px";f.appendChild(p)}
 if(t=="slate")for(let i=0;i<2;i++){const m=document.createElement("div");m.className="mist m"+i;f.appendChild(m)}
 if(t=="black")for(let i=0;i<2;i++){const s=document.createElement("div");s.className="shoot s"+i;f.appendChild(s)}
 const h=document.querySelector(".hero");h.querySelectorAll(".pt").forEach(x=>x.remove());
 for(let i=0;i<4;i++){const p=document.createElement("i");p.className="pt";p.innerHTML=shp(c[0][i%c[0].length]);p.style.left=(10+i*24)+"%";p.style.fontSize=(14+r()*10)+"px";p.style.animationDuration=(9+r()*8)+"s";p.style.animationDelay=(-r()*9)+"s";h.appendChild(p)}}
function wipe(e){const w=document.createElement("div");w.className="wipe";w.style.left=e.clientX+"px";w.style.top=e.clientY+"px";B.appendChild(w);setTimeout(()=>w.remove(),950)}
document.addEventListener("pointerdown",e=>{const t=e.target.closest(".btn,.ct,.chips button,.tabbar a,.tabbar button,nav>a");if(!t)return;
 const r=t.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement("span");s.className="rp";
 s.style.cssText="width:"+d+"px;height:"+d+"px;left:"+(e.clientX-r.left-d/2)+"px;top:"+(e.clientY-r.top-d/2)+"px";t.appendChild(s);setTimeout(()=>s.remove(),650)});
fx();

// ---- admin photo: put a square admin.jpg (or admin.png) next to index.html in GitHub ----
{const i=$("admImg"),F=["admin.jpg","admin.png","logo.png"];let k=0;i.onerror=()=>{k++;if(k<F.length){i.classList.toggle("ph",k<2);i.src=F[k]}};i.src=F[0]}

// ================= big update =================
var BN={"Log in":"লগইন","Register":"রেজিস্টার","Create account":"অ্যাকাউন্ট খুলুন","Use your email and password. Your email must be verified first.":"আপনার ইমেইল ও পাসওয়ার্ড দিন। আগে ইমেইল ভেরিফাই করা থাকতে হবে।","Email":"ইমেইল","Password":"পাসওয়ার্ড","Forgot password?":"পাসওয়ার্ড ভুলে গেছেন?","We will email you a verification link (this is not an SMS code). Your email and phone number stay private (only the admin can see them). The admin must approve your account before it appears in the student list.":"আমরা আপনার ইমেইলে একটি ভেরিফিকেশন লিংক পাঠাবো (এটি SMS কোড নয়)। আপনার ইমেইল ও ফোন নম্বর গোপন থাকবে (শুধু অ্যাডমিন দেখতে পারবেন)। শিক্ষার্থী তালিকায় আসার আগে অ্যাডমিনকে আপনার অ্যাকাউন্ট অনুমোদন করতে হবে।","Full name":"পুরো নাম","Roll number":"রোল নম্বর","Phone number * (private, only the admin can see)":"ফোন নম্বর * (গোপন, শুধু অ্যাডমিন দেখবেন)","Department":"বিভাগ","Year":"বর্ষ","Session":"সেশন","Password (min 8 characters)":"পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)","Confirm password":"পাসওয়ার্ড আবার দিন","My profile":"আমার প্রোফাইল","Name, roll, year and session are visible to verified students. Your email is private.":"নাম, রোল, বর্ষ ও সেশন ভেরিফাইড শিক্ষার্থীরা দেখতে পারবে। আপনার ইমেইল গোপন থাকবে।","Save":"সেভ","New post":"নতুন পোস্ট","Posts are reviewed by the admin before they appear publicly. Optional fields can stay blank.":"পোস্ট প্রকাশের আগে অ্যাডমিন যাচাই করবেন। ঐচ্ছিক ঘর ফাঁকা রাখা যাবে।","Category":"ক্যাটাগরি","Title *":"শিরোনাম *","Subject / course":"বিষয় / কোর্স","Year / class":"বর্ষ / ক্লাস","Date":"তারিখ","Notice date":"নোটিশের তারিখ","Exam date":"পরীক্ষার তারিখ","Assignment date (optional)":"অ্যাসাইনমেন্টের তারিখ (ঐচ্ছিক)","Date (optional)":"তারিখ (ঐচ্ছিক)","Issued date":"দেওয়ার তারিখ","Submission deadline":"জমার শেষ তারিখ","Teacher (Sir/Madam)":"শিক্ষক (স্যার/ম্যাডাম)","Exam time":"পরীক্ষার সময়","Details *":"বিস্তারিত *","Attachment link (PDF/image, optional)":"সংযুক্তির লিংক (PDF/ছবি, ঐচ্ছিক)","Submit for approval":"অনুমোদনের জন্য জমা দিন","Notice":"নোটিশ","Assignment":"অ্যাসাইনমেন্ট","Exam":"পরীক্ষা","Resource":"শেখার উপকরণ","My posts":"আমার পোস্ট","You can delete your posts at any time. Pending posts can also be edited.":"আপনি যেকোনো সময় নিজের পোস্ট মুছতে পারবেন। অপেক্ষমাণ পোস্ট এডিটও করা যাবে।","Edit":"এডিট","Delete":"মুছুন","Admin panel":"অ্যাডমিন প্যানেল","Posts":"পোস্ট","Students":"শিক্ষার্থী","Polls":"পোল","Routine":"রুটিন","Announcement":"ঘোষণা","⬇ Students CSV":"⬇ শিক্ষার্থী CSV","Pending":"অপেক্ষমাণ","Published":"প্রকাশিত","Rejected":"বাতিল","All":"সব","Approve":"অনুমোদন","Reject":"বাতিল করুন","Pin":"পিন","Unpin":"পিন খুলুন","Approved":"অনুমোদিত","Waiting":"অপেক্ষায়","Remove from list":"তালিকা থেকে সরান","Delete record":"রেকর্ড মুছুন","Open":"চালু","Closed":"বন্ধ","Close":"বন্ধ করুন","Reopen":"আবার চালু করুন","New poll":"নতুন পোল","Create poll":"পোল বানান","Poll":"পোল","Website Admin":"ওয়েবসাইট অ্যাডমিন","Government Barishal College, Barishal":"সরকারি বরিশাল কলেজ, বরিশাল","Government Barishal College":"সরকারি বরিশাল কলেজ","WhatsApp":"হোয়াটসঅ্যাপ","Messenger":"মেসেঞ্জার","Facebook":"ফেসবুক","Copy number":"নম্বর কপি করুন","Send a message":"মেসেজ পাঠান","Visit profile":"প্রোফাইল দেখুন","Tap to copy the WhatsApp number":"হোয়াটসঅ্যাপ নম্বর কপি করতে চাপুন","Roll 253321":"রোল ২৫৩৩২১","1st Year Honours":"১ম বর্ষ (সম্মান)","Soil Science":"মৃত্তিকা বিজ্ঞান","Session 2025-2026":"সেশন ২০২৫-২০২৬","Soil Science Department":"মৃত্তিকা বিজ্ঞান বিভাগ","Student Notice Board":"শিক্ষার্থী নোটিশ বোর্ড","BGC Soil Science — Student Notice Board":"বিজিসি মৃত্তিকা বিজ্ঞান — শিক্ষার্থী নোটিশ বোর্ড","Department of Soil Science, Government Barishal College, Barishal, Bangladesh.":"মৃত্তিকা বিজ্ঞান বিভাগ, সরকারি বরিশাল কলেজ, বরিশাল, বাংলাদেশ।","Soil Science 2025-2026 Notice Group (Messenger)":"মৃত্তিকা বিজ্ঞান ২০২৫-২০২৬ নোটিশ গ্রুপ (মেসেঞ্জার)","Unofficial student-run website. Posts are shared by students and approved by the admin.":"শিক্ষার্থীদের পরিচালিত অনানুষ্ঠানিক ওয়েবসাইট। পোস্ট শিক্ষার্থীরা দেয়, অ্যাডমিন অনুমোদন করেন।","This email is already registered. Try logging in.":"এই ইমেইল আগেই রেজিস্টার করা আছে। লগইন করে দেখুন।","Wrong email or password.":"ইমেইল বা পাসওয়ার্ড ভুল।","Please enter a valid email.":"সঠিক ইমেইল দিন।","Password must be at least 8 characters.":"পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।","Too many attempts. Please wait a while and try again.":"অনেকবার চেষ্টা হয়েছে। একটু পরে আবার চেষ্টা করুন।","Network problem. Check your internet connection.":"নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ দেখুন।","Not allowed. Log in with a verified email, or check the Firestore rules.":"অনুমতি নেই। ভেরিফাইড ইমেইল দিয়ে লগইন করুন।","Submitted! It will appear after admin approval.":"জমা হয়েছে! অ্যাডমিন অনুমোদনের পর দেখা যাবে।","Account created. Verify your email (check Spam). The admin will then confirm your account.":"অ্যাকাউন্ট খোলা হয়েছে। ইমেইল ভেরিফাই করুন (Spam দেখুন)। এরপর অ্যাডমিন আপনার অ্যাকাউন্ট নিশ্চিত করবেন।","Passwords do not match.":"পাসওয়ার্ড মেলেনি।","Vote saved.":"ভোট জমা হয়েছে।","Post deleted.":"পোস্ট মুছে ফেলা হয়েছে।","Profile updated.":"প্রোফাইল আপডেট হয়েছে।","Delete this post? This cannot be undone.":"এই পোস্ট মুছবেন? এটা ফেরানো যাবে না।","Share as image":"ছবি করে শেয়ার","Add to calendar":"ক্যালেন্ডারে যোগ করুন","Saturday":"শনিবার","Sunday":"রবিবার","Monday":"সোমবার","Tuesday":"মঙ্গলবার","Wednesday":"বুধবার","Thursday":"বৃহস্পতিবার","Friday":"শুক্রবার","Today":"আজ","No routine has been added yet.":"এখনো কোনো রুটিন দেওয়া হয়নি।","Overdue":"সময় শেষ","Due today":"আজ শেষ","Poster saved.":"ছবি সেভ হয়েছে।","Routine saved.":"রুটিন সেভ হয়েছে।","Add class":"ক্লাস যোগ করুন","Save routine":"রুটিন সেভ করুন","Announcement saved.":"ঘোষণা সেভ হয়েছে।","Clear":"মুছে ফেলুন","No study material yet.":"এখনো কোনো শেখার উপকরণ নেই।","Add the Drive link for the material.":"উপকরণের ড্রাইভ লিংক দিন।","Add the time and the subject.":"সময় ও বিষয় লিখুন।","Class routine":"ক্লাস রুটিন"};
function T(s){return(LG=="bn"&&BN&&BN[s])||s}
function walk(root){if(!BN)return;if(LG!="bn"&&!walk.did)return;if(LG=="bn")walk.did=1;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const p=n.parentNode;if(!p||/^(SCRIPT|STYLE|TEXTAREA|OPTION)$/.test(p.nodeName)||(p.closest&&p.closest(".nbody,[data-keep]")))continue;
  if(n.__en===undefined){const t=n.nodeValue.replace(/\s+/g," ").trim();if(!BN[t])continue;n.__en=n.nodeValue;n.__k=t}
  n.nodeValue=LG=="bn"?n.__en.match(/^\s*/)[0]+BN[n.__k]+n.__en.match(/\s*$/)[0]:n.__en}
 root.querySelectorAll&&root.querySelectorAll("[placeholder]").forEach(e=>{if(e.__p===undefined)e.__p=e.placeholder;const t=BN[e.__p];if(t)e.placeholder=LG=="bn"?t:e.__p})}
["list","alist","mlist","pl","ll","rl","dir","ndb","pbody","pf"].forEach(i=>{const e=$(i);if(!e)return;let q=0;new MutationObserver(()=>{if(q||LG!="bn")return;q=requestAnimationFrame(()=>{q=0;walk(e)})}).observe(e,{childList:true,subtree:true})});
walk(document.body);

function shake(el){const d=el&&el.closest&&el.closest("dialog");if(!d)return;d.classList.remove("shk");void d.offsetWidth;d.classList.add("shk")}
function okTick(){const d=document.createElement("div");d.className="okt";d.innerHTML='<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="23"/><path d="M14 27l8 8 16-17"/></svg>';B.appendChild(d);setTimeout(()=>d.remove(),1500)}
function ring(d){const f=Math.max(0,Math.min(d,14))/14,c=2*Math.PI*7;return '<span class="dring'+(d<=2?" hot":"")+'"><svg viewBox="0 0 20 20"><circle class="bg" cx="10" cy="10" r="7"/><circle class="fg" cx="10" cy="10" r="7" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+(c*(1-f)).toFixed(1)+'"/></svg></span>'}
function calBtn(p){const d=p.category=="Exam"?p.noticeDate:p.category=="Assignment"?p.deadline:"";if(!d||!/^\d{4}-\d{2}-\d{2}$/.test(d))return"";
 const nx=new Date(d+"T00:00:00");nx.setDate(nx.getDate()+1);const b=nx.getFullYear()+String(nx.getMonth()+1).padStart(2,"0")+String(nx.getDate()).padStart(2,"0");
 const u="https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(p.title)+"&details="+encodeURIComponent((p.description||"").slice(0,500))+"&dates="+d.replace(/-/g,"")+"/"+b;
 return '<a class="btn" href="'+esc(u)+'" target="_blank" rel="noopener">'+ico("cal")+T("Add to calendar")+"</a>"}
async function poster(p){try{await Promise.all([document.fonts.load('700 56px "Noto Sans Bengali"'),document.fonts.load('400 38px "Noto Sans Bengali"'),document.fonts.load('700 56px "Playfair Display"')])}catch(e){}
 const W=1080,H=1350,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d"),cs=getComputedStyle(document.documentElement),g=v=>cs.getPropertyValue(v).trim(),FN="'Noto Sans Bengali','Playfair Display',sans-serif";
 const bg=x.createLinearGradient(0,0,W,H);bg.addColorStop(0,g("--ac"));bg.addColorStop(1,g("--a2"));x.fillStyle=bg;x.fillRect(0,0,W,H);
 x.fillStyle=g("--s");x.beginPath();if(x.roundRect)x.roundRect(50,50,W-100,H-100,48);else x.rect(50,50,W-100,H-100);x.fill();
 const wrap=(t,f,w,mx)=>{x.font=f;const o=[];let l="";for(const wd of String(t).replace(/\s*\n\s*/g," \n ").split(/ +/)){if(wd=="\n"){o.push(l);l="";continue}const tr=l?l+" "+wd:wd;if(x.measureText(tr).width>w&&l){o.push(l);l=wd}else l=tr}if(l)o.push(l);return o.slice(0,mx)};
 let y=150;x.fillStyle=g("--ac");x.font="700 40px "+FN;x.fillText(T(p.category),110,y);
 x.fillStyle=g("--mu");x.font="400 34px "+FN;x.textAlign="right";x.fillText(fd(p),W-110,y);x.textAlign="left";y+=80;
 x.fillStyle=g("--tx");wrap(p.title,"700 62px "+FN,W-220,4).forEach(l=>{x.font="700 62px "+FN;x.fillText(l,110,y);y+=84});y+=16;
 const meta=[p.subject,p.teacher,p.deadline&&"Deadline: "+p.deadline,p.examTime].filter(Boolean).join("  •  ");
 if(meta){x.fillStyle=g("--ac");x.font="600 34px "+FN;x.fillText(wrap(meta,"600 34px "+FN,W-220,1)[0],110,y);y+=64}
 x.fillStyle=g("--tx");x.globalAlpha=.88;wrap(p.description,"400 40px "+FN,W-220,11).forEach(l=>{x.font="400 40px "+FN;x.fillText(l,110,y);y+=62});x.globalAlpha=1;
 x.fillStyle=g("--ln");x.fillRect(110,H-290,W-220,3);
 const im=await new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src="logo.png"});
 if(im){x.save();x.beginPath();x.arc(165,H-195,55,0,6.283);x.clip();x.fillStyle="#fff";x.fillRect(110,H-250,110,110);x.drawImage(im,115,H-245,100,100);x.restore()}
 x.fillStyle=g("--tx");x.font="700 36px "+FN;x.fillText("Soil Science, Government Barishal College",250,H-195);
 x.fillStyle=g("--mu");x.font="400 30px "+FN;x.fillText(location.host+location.pathname,250,H-150);
 c.toBlob(async b=>{if(!b)return;const f=new File([b],"notice.png",{type:"image/png"});
  try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:p.title});return}}catch(e){if(e&&e.name=="AbortError")return}
  const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="notice.png";B.appendChild(a);a.click();a.remove();toast("Poster saved.")},"image/png")}

async function loadAnn(){try{const d=await getDoc(doc(db,"settings","announcement")),t=d.exists()?String(d.data().text||"").trim():"";let hid="";try{hid=sessionStorage.getItem("bgc-ann")}catch(e){}$("annT").textContent=t;$("ann").hidden=!t||hid==t}catch(e){}}
$("annX").onclick=()=>{try{sessionStorage.setItem("bgc-ann",$("annT").textContent)}catch(e){}$("ann").hidden=true};
async function adminAnn(){let cur="";try{const d=await getDoc(doc(db,"settings","announcement"));if(d.exists())cur=d.data().text||""}catch(e){}
 $("alist").innerHTML='<div class="card"><h3>Announcement</h3><div class="meta">Shown at the very top for everyone. Leave empty and press Clear to remove it.</div><textarea id="at" maxlength="200" style="min-height:80px">'+esc(cur)+'</textarea><div class="acts"><button class="btn pri" data-act="asave">Save</button><button class="btn" data-act="aclear">Clear</button></div></div>'}
$("aann").onclick=adminAnn;


async function loadRoutine(){const el=$("rl"),y=$("ry").value;
 try{const d=await getDoc(doc(db,"routines",y)),R=d.exists()?(d.data().rows||[]):[];
  const D=["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"],today=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
  el.innerHTML=R.length?D.filter(x=>R.some(r=>r.day==x)).map((x,i)=>'<div class="card rday'+(x==today?" today":"")+'" style="animation-delay:'+i*70+'ms"><div class="row"><h3>'+x+"</h3>"+(x==today?'<span class="chip new">Today</span>':"")+"</div>"+R.filter(r=>r.day==x).map(r=>'<div class="rrow"><span class="rt">'+esc(r.time)+"</span><span><b>"+esc(r.subject)+"</b><small>"+esc([r.teacher,r.room].filter(Boolean).join(" · "))+"</small></span></div>").join("")+"</div>").join(""):'<div class="empty" style="grid-column:1/-1">No routine has been added yet.</div>'}
 catch(e){el.innerHTML='<div class="empty" style="grid-column:1/-1">'+esc(err(e))+"</div>"}}
$("ry").onchange=loadRoutine;
let RR=[],RY="1st Year";
async function adminRou(y){RY=y||RY;try{const d=await getDoc(doc(db,"routines",RY));RR=d.exists()?(d.data().rows||[]):[]}catch(e){RR=[]}drawRou()}
function drawRou(){const D=["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];
 $("alist").innerHTML='<div class="card"><h3>Class routine</h3><select id="rry">'+YR.map(v=>"<option"+(v==RY?" selected":"")+">"+v+"</option>").join("")+'</select><select id="rd">'+D.map(v=>"<option>"+v+"</option>").join("")+'</select><input id="rt" maxlength="30" placeholder="Time, e.g. 9:00 - 10:00"><input id="rs" maxlength="80" placeholder="Subject"><input id="rth" maxlength="60" placeholder="Teacher"><input id="rr" maxlength="30" placeholder="Room"><div class="acts"><button class="btn pri" data-act="radd">Add class</button><button class="btn" data-act="rsave">Save routine</button></div></div>'+RR.map((r,i)=>'<div class="card"><b>'+esc(r.day)+" · "+esc(r.time)+"</b><div>"+esc(r.subject)+'</div><div class="meta">'+esc([r.teacher,r.room].filter(Boolean).join(" · "))+'</div><div class="acts"><button class="btn" data-act="rdel" data-i="'+i+'">Delete</button></div></div>').join("")}
$("alist").onchange=e=>{if(e.target.id=="rry")adminRou(e.target.value)};
$("arou").onclick=()=>adminRou();

function newBadge(){const n=LAST?PUB.filter(p=>p.category!="Resource"&&secs(p)*1000>LAST).length:0,b=$("nb");b.hidden=!n;b.textContent=n>9?"9+":n}
const saveLast=()=>{try{localStorage.setItem("bgc-last",Date.now())}catch(e){}};
addEventListener("pagehide",saveLast);document.addEventListener("visibilitychange",()=>{if(document.hidden)saveLast()});if(!LAST)saveLast();
{const a=document.querySelector('.tabbar a[href="#board"]');if(a)a.addEventListener("click",()=>{$("nb").hidden=true})}

function setFS(v){FS=Math.max(.85,Math.min(1.4,v));document.documentElement.style.setProperty("--fs",FS);try{localStorage.setItem("bgc-fs",FS)}catch(e){}}
$("fsm").onclick=()=>setFS(FS-.1);$("fsp").onclick=()=>setFS(FS+.1);setFS(FS);

addEventListener("beforeinstallprompt",e=>{e.preventDefault();DIP=e;$("inst").hidden=false});
$("inst").onclick=async()=>{if(!DIP)return;DIP.prompt();try{await DIP.userChoice}catch(e){}DIP=null;$("inst").hidden=true};
addEventListener("appinstalled",()=>{$("inst").hidden=true});

{const n=$("nd");let y0=null;
 n.addEventListener("touchstart",e=>{y0=n.scrollTop<=0?e.touches[0].clientY:null},{passive:true});
 n.addEventListener("touchmove",e=>{if(y0==null||innerWidth>760)return;const dy=e.touches[0].clientY-y0;if(dy>0)n.style.transform="translateY("+dy+"px)"},{passive:true});
 n.addEventListener("touchend",e=>{if(y0==null)return;const dy=e.changedTouches[0].clientY-y0;n.style.transform="";if(dy>110&&innerWidth<=760)n.close();y0=null})}
{const O=["All","Notice","Assignment","Exam","Saved"],ls=$("list");let x0=0,y1=0;
 ls.addEventListener("touchstart",e=>{x0=e.touches[0].clientX;y1=e.touches[0].clientY},{passive:true});
 ls.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y1;if(Math.abs(dx)<70||Math.abs(dy)>45)return;
  const i=O.indexOf(cat),j=Math.max(0,Math.min(O.length-1,i+(dx<0?1:-1)));if(j!=i){const b=[].find.call($("chips").children,c=>c.dataset.c==O[j]);if(b)b.click()}})}
{const sb=document.createElement("div");sb.id="soilbar";sb.innerHTML='<i class="sf"></i><span class="sp">'+shp("sprout")+"</span>";B.appendChild(sb);
 const sf=sb.querySelector(".sf"),sp=sb.querySelector(".sp");let tk=false;
 const up=()=>{const h=document.documentElement,m=h.scrollHeight-h.clientHeight,p=m>0?h.scrollTop/m:0;pg.style.transform="scaleX("+p+")";tp.classList.toggle("show",h.scrollTop>500);sf.style.transform="scaleY("+p+")";sp.style.transform="translateY("+(p*(innerHeight-60))+"px) scale("+(.7+p*.8)+")";tk=false};
 addEventListener("scroll",()=>{if(!tk){tk=true;requestAnimationFrame(up)}},{passive:true});up()}

// ---- pages: #/students  #/library  #/routine ----
let lastPG="";
function route(){const m={"#/students":"st","#/routine":"rou"};PG=m[location.hash]||"";
 B.classList.remove("pg","pg-st","pg-lib","pg-rou");if(PG)B.classList.add("pg","pg-"+PG);
 [].forEach.call(document.querySelectorAll(".tabbar a"),a=>{if(PG)a.classList.toggle("on",PG=="st"&&a.getAttribute("href")=="#/students")});
 if(PG=="st")loadDir();
 if(PG=="rou"){const s=$("ry");if(prof&&prof.year&&!s.dataset.set){s.value=prof.year;s.dataset.set=1}loadRoutine()}
 if(PG!==lastPG){lastPG=PG;if(PG)scrollTo(0,0);else{const t=location.hash.length>2?$(location.hash.slice(1)):null;requestAnimationFrame(()=>t?t.scrollIntoView():scrollTo(0,0))}}}
addEventListener("hashchange",route);route();

// ---- smooth mode: effects Auto / Full / Lite ----
const HTML=document.documentElement;
let EFX="auto";try{EFX=localStorage.getItem("bgc-efx")||"auto"}catch(e){}
function paintEfx(){$("efx").textContent=EFX=="auto"?"Effects: Auto":EFX=="full"?"Effects: Full":"Effects: Lite"}
function watchFps(){let n=0,t0=0;const f=t=>{if(!t0)t0=t;n++;if(t-t0<2200){requestAnimationFrame(f);return}
  if(n/((t-t0)/1000)<40&&EFX=="auto"){HTML.classList.add("lite");try{localStorage.setItem("bgc-lite",Date.now())}catch(e){}toast("Smooth mode is on: some effects are reduced for your phone.")}};
 setTimeout(()=>requestAnimationFrame(f),2800)}
function applyEfx(first){paintEfx();
 if(EFX=="lite")HTML.classList.add("lite");
 else if(EFX=="full")HTML.classList.remove("lite");
 else{let ls=0;try{ls=+localStorage.getItem("bgc-lite")||0}catch(e){}
  if(Date.now()-ls<6048e5)HTML.classList.add("lite");else{HTML.classList.remove("lite");if(first)watchFps()}}}
$("efx").onclick=()=>{EFX=EFX=="auto"?"full":EFX=="full"?"lite":"auto";try{localStorage.setItem("bgc-efx",EFX);if(EFX!="auto")localStorage.removeItem("bgc-lite")}catch(e){}applyEfx(false);if(EFX=="auto")watchFps()};
applyEfx(true);
