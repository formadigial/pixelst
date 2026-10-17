'use strict';
/* ---------- Demo data: single source of truth. Replace freely. ---------- */
const PRODUCTS=[
{id:1,name:'Compostable Bandages',cat:'First Aid',icon:'bandage',price:249,was:299,tag:'New Arrival',rating:4.5,reviews:96,color:'#E6F1E3',desc:'Plant-fibre adhesive bandages in assorted sizes.',specs:['Assorted sizes','Plant-fibre backing','Check packaging for disposal advice']},
{id:2,name:'Bamboo Toothbrush Set',cat:'Personal Care',icon:'sprout',price:299,tag:'Popular',rating:4.4,reviews:140,color:'#F0F5D8',desc:'Set of four bamboo-handle toothbrushes.',specs:['Pack of 4','Bamboo handles','Soft bristles']},
{id:3,name:'Refillable First Aid Tin',cat:'First Aid',icon:'briefcase-medical',price:899,rating:4.6,reviews:82,color:'#DCEBDD',desc:'Reusable metal tin with everyday first aid basics.',specs:['Reusable tin','Labelled sections','Refills sold separately']},
{id:4,name:'Digital Thermometer',cat:'Devices',icon:'thermometer',price:249,was:349,tag:'Popular',rating:4.4,reviews:128,color:'#E6F1E3',desc:'Fast-reading thermometer with a clear display.',specs:['Memory recall','Auto shut-off','Battery included']},
{id:5,name:'Rechargeable BP Monitor',cat:'Devices',icon:'heart-pulse',price:2099,was:2599,rating:4.5,reviews:174,color:'#F0F5D8',desc:'Upper-arm monitor you charge by USB, no disposable batteries.',specs:['USB charging','Reading memory','Adjustable cuff']},
{id:6,name:'Reusable Hot & Cold Pack',cat:'Personal Care',icon:'snowflake',price:349,tag:'Limited Offer',rating:4.1,reviews:42,color:'#DCEBDD',desc:'Gel pack you can use again and again.',specs:['Reusable','Flexible gel','Cover included']},
{id:7,name:'Washable Knee Support',cat:'Equipment',icon:'shield',price:899,was:1199,rating:4.3,reviews:91,color:'#E6F1E3',desc:'Breathable, machine-washable elastic knee support.',specs:['Washable','Adjustable strap','One size']},
{id:8,name:'Reusable Cotton Pads',cat:'Personal Care',icon:'leaf',price:199,tag:'New Arrival',rating:4.2,reviews:58,color:'#F0F5D8',desc:'Washable cotton rounds with a laundry bag.',specs:['Set of 10','Machine washable','Laundry bag included']}];
const CATS=[['First Aid & Wound Care','First Aid','cross','Dressings, kits, antiseptics'],['Diagnostic Devices','Devices','stethoscope','Monitors & thermometers'],['Mobility & Support','Equipment','accessibility','Braces and aids'],['Personal Care','Personal Care','hand-heart','Daily comfort'],['Medical Consumables','First Aid','syringe','Gloves, swabs, tape'],['Home Healthcare','Devices','house','Care at home'],['Protective Equipment','Equipment','hard-hat','Masks and gloves'],['Wellness Essentials','Personal Care','leaf','Everyday support']];
const FAQ=[['How can I place an order?','Add products to your cart and choose Checkout. Checkout is a demo in this preview.'],['What payment methods are supported?','Placeholder: list only the methods your store actually supports.'],['How can I track my order?','Placeholder: add your tracking process here.'],['What is the return policy?','Placeholder: add your returns policy here.'],['Are specifications available before purchase?','Yes. Use Quick view on any product to see its key specifications.']];
const FILTERS=['All Products','First Aid','Devices','Personal Care','Equipment'];
const $=s=>document.querySelector(s),inr=n=>'₹'+n.toLocaleString('en-IN');
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
let cart=load('vd-cart',{}),wish=new Set(load('vd-wish',[])),state={cat:'All Products',q:'',wishOnly:false};
const icons=()=>window.lucide&&lucide.createIcons();

function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)}
/* ---------- Products ---------- */
function card(p){const off=p.was?Math.round(100-p.price/p.was*100):0;
return `<article class="card"><div class="pimg" style="background:${p.color}">${p.tag?`<span class="tag">${p.tag}</span>`:''}<i data-lucide="${p.icon}"></i>
<button class="ib wish" data-wish="${p.id}" aria-pressed="${wish.has(p.id)}" aria-label="Toggle wishlist for ${p.name}"><i data-lucide="heart"></i></button></div>
<span class="cat-l">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p><span class="rate">★ ${p.rating} (${p.reviews}, demo data)</span>
<div class="price">${inr(p.price)}${p.was?`<s>${inr(p.was)}</s> <small>${off}% off</small>`:''}</div>
<div class="crow"><button class="btn" data-add="${p.id}">Add to cart</button><button class="btn sm" data-view="${p.id}">Quick view</button></div></article>`}
function filtered(){const q=state.q.trim().toLowerCase();return PRODUCTS.filter(p=>(state.cat==='All Products'||p.cat===state.cat)&&(!state.wishOnly||wish.has(p.id))&&(!q||[p.name,p.cat,p.desc].some(s=>s.toLowerCase().includes(q))))}
function render(){const l=filtered();$('#products').innerHTML=l.length?l.map(card).join(''):`<div class="empty"><h3>No products found</h3><p>Try a different search or clear your filters.</p></div>`;
$('#status').textContent=`${l.length} product${l.length===1?'':'s'}${state.wishOnly?' in your wishlist':''}`;
$('#filters').innerHTML=FILTERS.map(f=>`<button class="chip" data-cat="${f}" aria-pressed="${f===state.cat}">${f}</button>`).join('');
$('#wishCount').textContent=wish.size;$('#wishBtn').setAttribute('aria-pressed',state.wishOnly);icons()}
$('#popGrid').innerHTML=PRODUCTS.filter(p=>p.tag==='Popular'||p.tag==='New Arrival').map(card).join('');
$('#cats').innerHTML=CATS.map(c=>`<button class="cat" data-catgo="${c[1]}"><i data-lucide="${c[2]}"></i><div><h3>${c[0]}</h3><p>${c[3]}</p></div></button>`).join('');
$('#faqList').innerHTML=FAQ.map((f,i)=>`<div class="faq"><button aria-expanded="false" aria-controls="a${i}"><span>${f[0]}</span><i data-lucide="chevron-down"></i></button><div class="ans" id="a${i}"><p>${f[1]}</p></div></div>`).join('');
/* ---------- Cart ---------- */
function renderCart(){const ids=Object.keys(cart).filter(id=>PRODUCTS.some(p=>p.id==id));let total=0,count=0;
$('#cartItems').innerHTML=ids.length?ids.map(id=>{const p=PRODUCTS.find(x=>x.id==id),q=cart[id];total+=p.price*q;count+=q;
return `<div class="item"><div class="pimg" style="background:${p.color}"><i data-lucide="${p.icon}"></i></div><div><h3>${p.name}</h3><span>${inr(p.price)}</span><div class="qty"><button data-dec="${id}" aria-label="Decrease quantity">−</button><span>${q}</span><button data-inc="${id}" aria-label="Increase quantity">+</button></div></div><button class="ib" data-rm="${id}" aria-label="Remove ${p.name}"><i data-lucide="trash-2"></i></button></div>`}).join(''):`<div class="empty"><h3>Your cart is empty</h3><p>Browse essentials and add what you need.</p><a class="btn" href="#shop" data-close>Continue shopping</a></div>`;
$('#cartTotal').textContent=inr(total);const c=$('#cartCount');c.textContent=count;c.classList.add('pop');setTimeout(()=>c.classList.remove('pop'),250);
$('#checkout').disabled=!count;save('vd-cart',cart);icons()}
function add(id,n=1){cart[id]=Math.min(10,(cart[id]||0)+n);renderCart();toast('Added to cart')}
/* ---------- Overlays ---------- */
let lastFocus;const scrim=$('#scrim');
function openLayer(el){lastFocus=document.activeElement;el.classList.add('open');el.setAttribute('aria-hidden','false');scrim.hidden=false;document.body.style.overflow='hidden';(el.querySelector('button,a'))?.focus()}
function closeAll(){document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'));$('#cart').setAttribute('aria-hidden','true');$('#modal').hidden=true;scrim.hidden=true;document.body.style.overflow='';$('#burger').setAttribute('aria-expanded','false');lastFocus?.focus?.()}
function quick(id){const p=PRODUCTS.find(x=>x.id==id);let q=1;const m=$('#modal');
m.innerHTML=`<div class="mbox"><button class="ib x" data-close aria-label="Close quick view"><i data-lucide="x"></i></button><div class="pimg" style="background:${p.color}"><i data-lucide="${p.icon}"></i></div><div><span class="cat-l">${p.cat}</span><h2 id="mTitle" style="font-size:1.5rem">${p.name}</h2><div class="price">${inr(p.price)}</div><p>${p.desc}</p><ul>${p.specs.map(s=>`<li>${s}</li>`).join('')}</ul>
<div class="qty"><button id="mq-" aria-label="Decrease">−</button><span id="mq">1</span><button id="mq+" aria-label="Increase">+</button></div><button class="btn block" id="mAdd" style="margin-top:14px">Add to cart</button></div></div>`;
lastFocus=document.activeElement;m.hidden=false;document.body.style.overflow='hidden';icons();m.querySelector('.x').focus();
const set=v=>{q=Math.max(1,Math.min(10,v));$('#mq').textContent=q};$('#mq-').onclick=()=>set(q-1);$('#mq+').onclick=()=>set(q+1);$('#mAdd').onclick=()=>{add(p.id,q);closeAll()}}
/* ---------- Events ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('button,a,.scrim,.modal');if(!t)return;const d=t.dataset;
if(d.add)add(+d.add);else if(d.view)quick(d.view);
else if(d.wish){const id=+d.wish;wish.has(id)?wish.delete(id):wish.add(id);save('vd-wish',[...wish]);render();$('#popGrid').innerHTML=PRODUCTS.filter(p=>p.tag==='Popular'||p.tag==='New Arrival').map(card).join('');icons()}
else if(d.cat){state.cat=d.cat;render()}
else if(d.catgo){state.cat=d.catgo;state.wishOnly=false;render();$('#shop').scrollIntoView()}
else if(d.inc){add(d.inc,1)}else if(d.dec){cart[d.dec]--;if(cart[d.dec]<1)delete cart[d.dec];renderCart()}else if(d.rm){delete cart[d.rm];renderCart()}
else if(t.id==='cartBtn')openLayer($('#cart'));
else if(t.id==='burger'){openLayer($('#links'));t.setAttribute('aria-expanded','true')}
else if(t.id==='wishBtn'){state.wishOnly=!state.wishOnly;render();$('#shop').scrollIntoView()}
else if(t.id==='srchT')$('#searchForm').classList.toggle('show');
else if(t.id==='qClear'){$('#q').value='';state.q='';t.hidden=true;render()}
else if(t.id==='checkout'){toast('Demo checkout: no payment is taken');}
else if(t.matches('.faq button')){const f=t.parentElement,o=f.classList.contains('open');document.querySelectorAll('.faq').forEach(x=>{x.classList.remove('open');x.firstChild.setAttribute('aria-expanded','false')});if(!o){f.classList.add('open');t.setAttribute('aria-expanded','true')}}
else if(t.hasAttribute('data-close')||t===scrim||t.id==='modal'&&e.target===t||(t.tagName==='A'&&t.closest('#links')))closeAll()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
$('#searchForm').addEventListener('submit',e=>{e.preventDefault();$('#shop').scrollIntoView()});
$('#q').addEventListener('input',e=>{state.q=e.target.value;$('#qClear').hidden=!state.q;render()});
const sb=document.createElement('button');sb.className='ib';sb.id='srchT';sb.setAttribute('aria-label','Toggle search');sb.innerHTML='<i data-lucide="search"></i>';sb.style.display='none';$('.acts').prepend(sb);
const mq=matchMedia('(max-width:860px)');const sm=()=>sb.style.display=mq.matches?'grid':'none';mq.addEventListener('change',sm);sm();
addEventListener('scroll',()=>$('#nav').classList.toggle('stuck',scrollY>10),{passive:true});
/* Rotating announcement strip */
const MSG=['Your everyday healthcare essentials, delivered with care.','Free delivery on eligible orders.','Secure checkout. Trusted products.'];let mi=0;setInterval(()=>{mi=(mi+1)%3;$('#strip').textContent=MSG[mi]},4000);
/* Newsletter: demo only, swap in a real API call inside subscribe() */
function subscribe(email){return Promise.resolve({ok:true})}
$('#news').addEventListener('submit',async e=>{e.preventDefault();const v=$('#email').value.trim(),m=$('#newsMsg');
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){m.className='err';m.textContent='Enter a valid email, like name@example.com.';return}
await subscribe(v);m.className='ok';m.textContent='Demo only: no email was saved.';e.target.reset()});
render();renderCart();addEventListener('load',icons);
