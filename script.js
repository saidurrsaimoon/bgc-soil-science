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
const TH=[["forest","Forest Sage","#2f5d3f"],["midnight","Midnight Lilac","#9d8bd6"],["graphite","Graphite Gold","#c9a64a"],["burgundy","Burgundy Blush","#7a1f33"],["slate","Slate Mist","#3f5b7a"],["rose","Rose Dusk","#d18ba0"],["olive","Olive Earth","#5f6b2c"],["paper","Warm Paper","#8a5a2b"]];
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const PH=/^(\+?88)?01[3-9]\d{8}$/;
const okUrl=u=>/^https?:\/\//i.test(u||"");
const secs=p=>(p.createdAt&&p.createdAt.seconds)||0;
const byNew=(a,b)=>secs(b)-secs(a);
const isoDay=p=>p.createdAt&&p.createdAt.toDate?p.createdAt.toDate().toISOString().slice(0,10):"";
function fd(p){const d=p.noticeDate?new Date(p.noticeDate+"T00:00:00"):(p.createdAt&&p.createdAt.toDate?p.createdAt.toDate():null);return d&&!isNaN(d)?d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):""}
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("show"),5000)}
function err(e){const c=(e&&e.code)||"";const m={"auth/email-already-in-use":"This email is already registered. Try logging in.","auth/invalid-credential":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/invalid-email":"Please enter a valid email.","auth/weak-password":"Password must be at least 8 characters.","auth/too-many-requests":"Too many attempts. Please wait a while and try again.","auth/network-request-failed":"Network problem. Check your internet connection."};
 if(m[c])return m[c];if(c.indexOf("permission")>-1)return "Not allowed. Log in with a verified email, or check the Firestore rules.";return "Something went wrong. "+((e&&e.message)||"")}

document.querySelectorAll(".yr").forEach(s=>s.innerHTML=YR.map(y=>"<option>"+y+"</option>").join(""));
document.querySelectorAll(".ss").forEach(s=>{s.innerHTML=SS.map(y=>"<option>"+y+"</option>").join("");s.value="2025-2026"});

// themes
function setTheme(k){document.documentElement.dataset.theme=k;try{localStorage.setItem("bgc-theme",k)}catch(e){}[].forEach.call($("sw").children,b=>b.classList.toggle("on",b.dataset.k==k))}
$("sw").innerHTML=TH.map(t=>'<button data-k="'+t[0]+'"><span class="dot" style="background:'+t[2]+'"></span>'+t[1]+'</button>').join("");
$("sw").onclick=e=>{const b=e.target.closest("button");if(b)setTheme(b.dataset.k)};
let st="forest";try{st=localStorage.getItem("bgc-theme")||st}catch(e){}
setTheme(TH.some(t=>t[0]==st)?st:"forest");

// state
let me=null,prof=null,adm=false,PUB=[],ALL=[],cat="All",savedOnly=false;

function extras(p){const L=[["Subject",p.subject],["Teacher",p.teacher],["Department",p.department],["Class",p.classYear],["Issued",p.issuedDate],["Deadline",p.deadline],["Time",p.examTime]].filter(x=>x[1]).map(x=>x[0]+": "+esc(x[1]));
 let h=L.length?'<div class="meta">'+L.join(" · ")+"</div>":"";
 if(okUrl(p.attachmentUrl)){const src=imgSrc(p.attachmentUrl),u=esc(p.attachmentUrl);
  if(src)h+='<a href="'+u+'" target="_blank" rel="noopener noreferrer"><img class="pimg" src="'+esc(src)+'" loading="lazy" alt="Attachment preview" onerror="this.parentNode.style.display=\'none\'"></a>';
  h+='<div class="meta"><a class="au" href="'+u+'" target="_blank" rel="noopener noreferrer">📎 Open attachment</a></div>'}
 return h}
function imgSrc(u){if(!okUrl(u))return "";const m=u.match(/drive\.google\.com\/file\/d\/([\w-]+)/)||u.match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([\w-]+)/);
 if(m)return "https://drive.google.com/thumbnail?id="+m[1]+"&sz=w1000";
 return /\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(u)?u:""}
function savedIds(){try{return JSON.parse(localStorage.getItem("bgc-saved-notices")||"[]")}catch(e){return []}}
function card(p,i){const saved=savedIds().includes(p.id);return '<article class="card" style="animation-delay:'+Math.min(i,8)*50+'ms"><div class="row"><span class="tag '+esc(p.category)+'">'+esc(p.category)+'</span><span>📅 '+esc(fd(p))+'</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p>'+extras(p)+'<div class="row" style="margin-top:auto"><span><button class="save-post '+(saved?'saved':'')+'" data-save="'+esc(p.id)+'" aria-label="'+(saved?'Remove bookmark':'Bookmark notice')+'">'+(saved?'★ Saved':'☆ Save')+'</button></span><span>By <button class="au" data-u="'+esc(p.authorUid)+'">'+esc(p.authorName)+'</button></span></div></article>'}
function render(){const q=$("q").value.trim().toLowerCase(),saved=savedIds();
 const r=PUB.filter(p=>(cat=="All"||p.category==cat)&&(!savedOnly||saved.includes(p.id))&&(!q||[p.title,p.description,p.authorName].join(" ").toLowerCase().indexOf(q)>-1)).sort(byNew);
 $("list").innerHTML=r.length?r.map(card).join(''):'<div class="empty" style="grid-column:1/-1">'+(savedOnly?'No saved notices yet. Tap ☆ Save on any notice to keep it here.':'No notices found for this category yet.')+'</div>';
 const stat=$("statNotices");if(stat)stat.textContent=PUB.length}

async function loadPub(){try{const s=await getDocs(query(collection(db,"notices"),where("status","==","published")));PUB=s.docs.map(d=>Object.assign({id:d.id},d.data()))}catch(e){PUB=[];toast(err(e))}render()}
async function loadDir(){const el=$("dir");
 if(!(me&&me.emailVerified&&(prof||adm))){el.innerHTML='<div class="empty">🔒 '+(me&&me.emailVerified?"The student list is visible after admin approval.":"Log in with a verified email to see all students.")+"</div>";return}
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
 B.className=(u?"a-in ":"")+(u&&u.emailVerified?"a-ver ":"")+(prof?"a-apr ":"")+(adm?"a-adm":"");
 loadDir();loadPub();
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
 try{await addDoc(collection(db,"notices"),d);pf.reset();sync();m.textContent="";$("post").close();toast("Submitted! It will appear after admin approval.")}catch(x){m.textContent=err(x)}};

// admin panel
const iso=p=>p.noticeDate||isoDay(p);
function drawAdmin(){const s=$("afs").value,c=$("afc").value,q=$("afq").value.toLowerCase(),dt=$("afd").value;
 const r=ALL.filter(p=>(s=="all"||p.status==s)&&(c=="All"||p.category==c)&&(!dt||p.noticeDate==dt||isoDay(p)==dt)&&(!q||(p.title+" "+p.description+" "+p.authorName).toLowerCase().indexOf(q)>-1)).sort(byNew);
 $("alist").innerHTML=r.length?r.map(p=>'<div class="card"><div class="row"><span class="tag '+esc(p.category)+'">'+esc(p.category)+'</span><span class="tag">'+esc(p.status)+'</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+"</p>"+extras(p)+'<div class="meta">By '+esc(p.authorName)+" · "+esc(fd(p))+'</div><div class="acts"><button class="btn pri" data-act="approve" data-id="'+p.id+'">Approve</button><button class="btn" data-act="reject" data-id="'+p.id+'">Reject</button><button class="btn" data-act="edit" data-id="'+p.id+'">Edit</button><button class="btn" data-act="del" data-id="'+p.id+'">Delete</button></div></div>').join(""):'<div class="empty">Nothing here.</div>'}
async function loadAll(){try{const s=await getDocs(collection(db,"notices"));ALL=s.docs.map(d=>Object.assign({id:d.id},d.data()));drawAdmin()}catch(x){$("alist").innerHTML='<div class="empty">'+esc(err(x))+"</div>"}}
["afs","afc","afd","afq"].forEach(i=>{$(i).oninput=drawAdmin});
$("aposts").onclick=loadAll;
let SU=[];
$("astu").onclick=async()=>{try{const [s,p]=await Promise.all([getDocs(collection(db,"users")),getDocs(collection(db,"publicProfiles"))]);const ok=new Set(p.docs.map(d=>d.id));
 SU=s.docs.map(d=>Object.assign({id:d.id},d.data())).sort((x,y)=>x.name.localeCompare(y.name));
 $("alist").innerHTML=SU.map(u=>{const v=ok.has(u.id);return '<div class="card"><div class="row"><h3>'+esc(u.name)+'</h3><span class="tag">'+(v?"✅ Approved":"⏳ Waiting")+'</span></div><div class="meta">Roll '+esc(u.roll)+" · "+esc(u.year)+" · Session "+esc(u.session)+"<br>"+esc(u.email)+(u.phone?"<br>📞 "+esc(u.phone):"")+'</div><div class="acts">'+(v?'<button class="btn" data-act="unapprove" data-id="'+u.id+'">Remove from list</button>':'<button class="btn pri" data-act="approve-user" data-id="'+u.id+'">Approve</button><button class="btn" data-act="deluser" data-id="'+u.id+'">Delete record</button>')+"</div></div>"}).join("")||'<div class="empty">No students.</div>'}catch(x){toast(err(x))}};
$("alist").onclick=async e=>{const b=e.target.closest("button[data-act]");if(!b)return;const id=b.dataset.id,a=b.dataset.act,p=ALL.find(x=>x.id==id);
 if(a=="approve-user"||a=="unapprove"){const u=SU.find(x=>x.id==id);if(!u)return;
  try{if(a=="approve-user")await setDoc(doc(db,"publicProfiles",id),{name:u.name,roll:u.roll,year:u.year,session:u.session});
  else{if(!confirm("Remove this student from the public list?"))return;await deleteDoc(doc(db,"publicProfiles",id))}
  toast(a=="approve-user"?"Approved.":"Removed.");$("astu").click()}catch(x){toast(err(x))}return}
 if(a=="deluser"){if(!confirm("Delete this unverified student record? (Delete the login in Firebase → Authentication → Users too.)"))return;try{await deleteDoc(doc(db,"users",id));toast("Record deleted.");$("astu").click()}catch(x){toast(err(x))}return}
 if(!p)return;
 try{
  if(a=="approve"||a=="reject")await updateDoc(doc(db,"notices",id),{status:a=="approve"?"published":"rejected"});
  else if(a=="del"){if(!confirm("Delete this post permanently? This cannot be undone."))return;await deleteDoc(doc(db,"notices",id))}
  else if(a=="edit"){const t=prompt("Title",p.title);if(t===null)return;const d=prompt("Details",p.description);if(d===null)return;if(!t.trim()||!d.trim()){toast("Title and details are required.");return}await updateDoc(doc(db,"notices",id),{title:t.trim(),description:d.trim()})}
  await loadAll();loadPub()}catch(x){toast(err(x))}};
$("admbtn").onclick=()=>{$("nav").classList.remove("open");$("ap").showModal();loadAll()};

// ui
$("chips").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.saved){savedOnly=!savedOnly;cat="All";[].forEach.call($("chips").children,c=>c.classList.toggle("on",c==b));b.textContent=savedOnly?"★ Saved":"☆ Saved";render();return}savedOnly=false;cat=b.dataset.c;[].forEach.call($("chips").children,c=>c.classList.toggle("on",c==b));render()};
$("q").oninput=render;
$("bg").onclick=()=>$("nav").classList.toggle("open");
document.addEventListener("click",e=>{
 const save=e.target.closest("[data-save]");if(save){const id=save.dataset.save;let ids=savedIds();if(ids.includes(id)){ids=ids.filter(x=>x!==id);toast("Bookmark removed.")}else{ids.push(id);toast("Notice saved on this device.")}try{localStorage.setItem("bgc-saved-notices",JSON.stringify(ids))}catch(x){}render();return}
 const u=e.target.closest("[data-u]");if(u){openProfile(u.dataset.u);return}
 const o=e.target.closest("[data-open]");
 if(o){$("nav").classList.remove("open");const k=o.dataset.open;
  if((k=="post"||k=="prd")&&!prof){toast("Your profile could not be loaded. Log out, log in again, and make sure your email is verified.");return}
  if(k=="prd"){const f=$("mf").elements;f.n.value=prof.name;f.r.value=prof.roll;f.y.value=prof.year;f.s.value=prof.session;f.ph.value="";getDoc(doc(db,"users",me.uid)).then(d=>{if(d.exists())f.ph.value=d.data().phone||""}).catch(()=>{})}
  $(k).showModal()}
 if(e.target.closest("[data-close]"))e.target.closest("dialog").close();
 if(e.target.tagName=="DIALOG")e.target.close();
 if(e.target.closest("nav a"))$("nav").classList.remove("open")});
