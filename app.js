// DATOS: catálogo y recursos multimedia reales disponibles en la carpeta videos/.
const kits = [
  {id:'clima',name:'Estación IoT del clima',category:'IoT',price:289,level:'INTERMEDIO',desc:'Mide temperatura, humedad y calidad del aire en tiempo real.',art:'weather',color:'#42d9be',badge:'MÁS POPULAR',media:'videos/Estación IoT del clima.jpg',mediaType:'image'},
  {id:'rover',name:'Rover explorador',category:'Robótica',price:349,level:'INTERMEDIO',desc:'Construye un robot móvil y aprende a controlarlo por Bluetooth.',art:'wheels',color:'#f29561',badge:'NUEVO',media:'videos/Rover explorador.jpg',mediaType:'image'},
  {id:'arduino',name:'Primeros pasos Arduino',category:'Principiantes',price:199,level:'INICIAL',desc:'LEDs, botones y tu primera programación, sin complicaciones.',art:'board',color:'#66deb3',badge:'IDEAL PARA EMPEZAR',media:'videos/Primeros pasos Arduino.jpg',mediaType:'image'},
  {id:'sensor',name:'Laboratorio de sensores',category:'Sensores',price:229,level:'INICIAL',desc:'Explora luz, distancia, movimiento y muchas señales del mundo.',art:'sensor',color:'#85cfff',badge:'8 SENSORES',media:'videos/kit-demo.gif',mediaType:'image'},
  {id:'robot',name:'Mini bot seguidor de línea',category:'Robótica',price:319,level:'INTERMEDIO',desc:'Arma un robot que encuentra su camino siguiendo una pista.',art:'robot',color:'#a4e879',badge:'RETO MAKER',media:'videos/Mini bot seguidor de línea.jpg',mediaType:'image'},
  {id:'led',name:'Pixel art LED inteligente',category:'IoT',price:259,level:'INICIAL',desc:'Diseña animaciones luminosas y contrólalas desde tu celular.',art:'light',color:'#e183e9',badge:'EFECTO WOW',media:'videos/Pixel art LED inteligente.jpg',mediaType:'image'},
  {id:'brazo',name:'Brazo robótico de mesa',category:'Robótica',price:449,level:'AVANZADO',desc:'Domina servomotores y control preciso con este brazo articulado.',art:'arm',color:'#ffb865',badge:'NIVEL PRO',media:'videos/Brazo robótico de mesa.jpg',mediaType:'image'},
  {id:'alarma',name:'Alarma inteligente para casa',category:'Sensores',price:279,level:'INTERMEDIO',desc:'Crea una alarma con sensor de movimiento y notificaciones IoT.',art:'light',color:'#ff747c',badge:'PROYECTO ÚTIL',media:'videos/Alarma inteligente para casa.jpg',mediaType:'image'},
  {id:'mini',name:'Robot amigo mini',category:'Principiantes',price:189,level:'INICIAL',desc:'Un compañero construible que se ilumina y responde al tacto.',art:'robot',color:'#ff9eac',badge:'FAVORITO',media:'videos/Robot amigo mini.jpg',mediaType:'image'},
  {id:'solar',name:'Energía solar en acción',category:'Sensores',price:299,level:'INTERMEDIO',desc:'Experimenta con panel solar, almacenamiento y energía limpia.',art:'solar',color:'#ffd263',badge:'ENERGÍA VERDE',media:'videos/Energía solar en acción.jpg',mediaType:'image'}
];

// SELECTORES Y ESTADO: filtros, búsqueda y carrito persistente en este navegador.
const $ = (selector, root=document) => root.querySelector(selector);
const grid = $('#kits');
const formatPrice = amount => `Bs ${amount.toFixed(2)}`;
let activeFilter = 'Todos';
let query = '';
let cart = loadCart();
let currentKit = kits[0];
let toastTimer;

// CARRITO: recupera la selección guardada y descarta datos inválidos.
function loadCart(){
  try {
    const saved=JSON.parse(localStorage.getItem('voltlab-cart')||'[]');
    return saved.filter(row=>kits.some(kit=>kit.id===row.id)&&Number.isInteger(row.qty)&&row.qty>0)
      .map(row=>({...kits.find(kit=>kit.id===row.id),qty:row.qty}));
  } catch { return []; }
}
function saveCart(){
  try { localStorage.setItem('voltlab-cart',JSON.stringify(cart.map(({id,qty})=>({id,qty})))); }
  catch { showToast('No se pudo guardar el carrito en este navegador'); }
  updateCart();
}

// TARJETAS: crea la ilustración CSS según el tipo de proyecto.
function artMarkup(art){
  const drawings={board:'<div class="art-board"></div>',wheels:'<div class="art-wheels"></div>',sensor:'<div class="art-sensor"></div>',light:'<div class="art-light"><i></i><i></i><i></i></div>',arm:'<div class="art-arm"></div>',robot:'<div class="art-robot"><i></i></div>',weather:'<div class="art-weather">☀</div>',solar:'<div class="art-box"></div>'};
  return drawings[art]||drawings.board;
}
function productCard(kit,index){
  return `<article class="product-card" style="--glow:${kit.color}22;--art:${kit.color};animation-delay:${Math.min(index*45,300)}ms">
    <div class="product-visual${kit.media && kit.media !== 'videos/kit-demo.gif' && /\.(gif|jpe?g|webp|png)$/i.test(kit.media) ? ' has-cover' : ''}">${kit.media && kit.media !== 'videos/kit-demo.gif' && /\.(gif|jpe?g|webp|png)$/i.test(kit.media) ? `<img class="product-cover" src="${encodeURI(kit.media)}" alt="Carátula de ${kit.name}" loading="lazy">` : ''}<span class="badge">${kit.badge}</span><button class="visual-play" data-video="${kit.id}" aria-label="Ver video de ${kit.name}">▶</button><div class="product-art">${artMarkup(kit.art)}</div></div>
    <div class="product-content"><span class="product-category">${kit.category}</span><h3>${kit.name}</h3><p>${kit.desc}</p><div class="product-meta"><span class="price">${formatPrice(kit.price)}</span><span class="level">${kit.level}</span></div><div class="card-actions"><button class="add-button" data-add="${kit.id}">＋ Agregar al carrito</button><button class="details-button" data-video="${kit.id}">Ver proyecto</button></div></div>
  </article>`;
}

// CATÁLOGO: aplica categoría y texto de búsqueda, y muestra estado vacío.
function render(){
  const filtered=kits.filter(kit=>(activeFilter==='Todos'||kit.category===activeFilter)&&(!query||`${kit.name} ${kit.desc} ${kit.category}`.toLowerCase().includes(query)));
  grid.innerHTML=filtered.map(productCard).join('');
  $('#emptyState').hidden=filtered.length>0;
}

// AVISOS: confirmaciones breves al agregar o cambiar el pedido.
function showToast(message){
  const toast=$('#toast');toast.textContent=message;toast.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);
}

// CARRITO: vuelve a dibujar las filas, cantidades y subtotal.
function renderCart(){
  const totalCount=cart.reduce((sum,kit)=>sum+kit.qty,0);
  const total=cart.reduce((sum,kit)=>sum+kit.price*kit.qty,0);
  $('#drawerCount').textContent=`(${totalCount})`;
  $('#cartItems').innerHTML=cart.map(kit=>`<article class="cart-row"><div><h3>${kit.name}</h3><p>${formatPrice(kit.price)} por unidad</p><div class="quantity-control"><button data-quantity="-1" data-id="${kit.id}" aria-label="Quitar una unidad">−</button><span>${kit.qty}</span><button data-quantity="1" data-id="${kit.id}" aria-label="Agregar una unidad">＋</button></div></div><div class="cart-row-side"><strong>${formatPrice(kit.price*kit.qty)}</strong><button class="cart-remove" data-remove="${kit.id}">Quitar</button></div></article>`).join('');
  $('#cartSubtotal').textContent=formatPrice(total);
  $('#cartEmpty').classList.toggle('visible',cart.length===0);
  $('#cartSummary').classList.toggle('empty',cart.length===0);
}
function updateCart(){
  const count=cart.reduce((sum,kit)=>sum+kit.qty,0);
  $('#cartCount').textContent=count;
  renderCart();
}
function addToCart(id){
  const kit=kits.find(item=>item.id===id);if(!kit)return;
  const existing=cart.find(item=>item.id===id);
  if(existing)existing.qty++;else cart.push({...kit,qty:1});
  saveCart();showToast(`${kit.name} agregado al carrito`);
}
function changeQuantity(id,delta){
  const item=cart.find(kit=>kit.id===id);if(!item)return;
  item.qty+=delta;if(item.qty<=0)cart=cart.filter(kit=>kit.id!==id);
  saveCart();
}
function openCart(){
  renderCart();$('#cartPanel').classList.add('open');$('#cartPanel').setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';$('#cartClose').focus();
}
function closeCart(){
  $('#cartPanel').classList.remove('open');$('#cartPanel').setAttribute('aria-hidden','true');
  if(!$('#videoModal').classList.contains('open'))document.body.style.overflow='';
}

// VIDEO: muestra la media asociada de cada kit. Si la fuente es un vídeo, se reproduce; si es una imagen, se presenta en el panel.
function resolveMediaUrl(pathname){
  return pathname ? encodeURI(pathname) : '';
}
function openVideo(id){
  currentKit=kits.find(kit=>kit.id===id)||kits[0];
  const modal=$('#videoModal'),video=$('#kitVideo'),gif=$('#kitGif');
  $('#modalTitle').textContent=currentKit.name;$('#modalDescription').textContent=currentKit.desc;
  video.pause();video.removeAttribute('src');video.load();video.hidden=true;gif.hidden=true;
  const mediaUrl=resolveMediaUrl(currentKit.media);
  const isVideo=/\.(mp4|webm|ogg|mov)$/i.test(currentKit.media || '');
  if(isVideo){
    $('.video-placeholder').hidden=false;$('#videoDuration').textContent='● BUSCANDO VIDEO';
    video.src=mediaUrl;
    video.onloadedmetadata=()=>{$('#videoDuration').textContent='● VIDEO DISPONIBLE';};
    video.onerror=()=>{video.hidden=true;$('#videoDuration').textContent='● VIDEO DE MUESTRA';};
  } else {
    $('.video-placeholder').hidden=true;gif.src=mediaUrl;gif.alt=`Demostración visual de ${currentKit.name}`;gif.hidden=false;$('#videoDuration').textContent='● IMAGEN DISPONIBLE';
  }
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#modalClose').focus();
}
function closeVideo(){
  const modal=$('#videoModal');$('#kitVideo').pause();modal.classList.remove('open');modal.setAttribute('aria-hidden','true');
  if(!$('#cartPanel').classList.contains('open'))document.body.style.overflow='';
}

// EVENTOS: conecta botones de filtros, catálogo, carrito y reproductor.
document.addEventListener('click',event=>{
  const filter=event.target.closest('[data-filter]');
  if(filter){activeFilter=filter.dataset.filter;document.querySelectorAll('.filter').forEach(button=>button.classList.toggle('active',button===filter));render();}
  const add=event.target.closest('[data-add]');if(add)addToCart(add.dataset.add);
  const watch=event.target.closest('[data-video]');if(watch)openVideo(watch.dataset.video);
  const quantity=event.target.closest('[data-quantity]');if(quantity)changeQuantity(quantity.dataset.id,Number(quantity.dataset.quantity));
  const remove=event.target.closest('[data-remove]');if(remove){cart=cart.filter(kit=>kit.id!==remove.dataset.remove);saveCart();}
});
$('#searchInput').addEventListener('input',event=>{query=event.target.value.trim().toLowerCase();render();});
$('#clearSearch').addEventListener('click',()=>{activeFilter='Todos';query='';$('#searchInput').value='';document.querySelectorAll('.filter').forEach((button,index)=>button.classList.toggle('active',index===0));render();});
$('#cartButton').addEventListener('click',openCart);
$('#cartClose').addEventListener('click',closeCart);
$('#cartPanel').addEventListener('click',event=>{if(event.target===$('#cartPanel'))closeCart();});
$('#continueShopping').addEventListener('click',closeCart);
$('#clearCart').addEventListener('click',()=>{cart=[];saveCart();showToast('Carrito vacío');});
$('#checkoutButton').addEventListener('click',()=>{
  if(!cart.length)return;
  const lines=cart.map(kit=>`${kit.qty} × ${kit.name} (${formatPrice(kit.price*kit.qty)})`).join('\n');
  const total=formatPrice(cart.reduce((sum,kit)=>sum+kit.price*kit.qty,0));
  const message=`Hola, quiero hacer este pedido:\n${lines}\nTotal: ${total}`;
  closeCart();
  if(navigator.clipboard?.writeText){
    navigator.clipboard.writeText(message).then(()=>showToast('Resumen copiado. Conecta WhatsApp para recibir pedidos.')).catch(()=>window.alert(`${message}\n\nCopia este resumen para completar el pedido.`));
  } else { window.alert(`${message}\n\nCopia este resumen para completar el pedido.`); }
});
$('#modalClose').addEventListener('click',closeVideo);
$('#videoModal').addEventListener('click',event=>{if(event.target===$('#videoModal'))closeVideo();});
$('#videoPlay').addEventListener('click',()=>{
  const video=$('#kitVideo'),gif=$('#kitGif'),placeholder=$('.video-placeholder');
  const mediaUrl=resolveMediaUrl(currentKit.media);
  const isVideo=/\.(mp4|webm|ogg|mov)$/i.test(currentKit.media || '');
  if(!isVideo){
    gif.src=mediaUrl;gif.hidden=false;placeholder.hidden=true;$('#videoDuration').textContent='● IMAGEN DISPONIBLE';return;
  }
  video.hidden=false;placeholder.hidden=true;
  video.play().catch(()=>{video.hidden=true;placeholder.hidden=false;showToast(`La reproducción de ${currentKit.name} no está disponible todavía.`);});
});
$('#modalBuy').addEventListener('click',()=>{addToCart(currentKit.id);closeVideo();});
$('#menuToggle').addEventListener('click',()=>$('.main-nav').classList.toggle('open'));
$('.search-toggle').addEventListener('click',()=>{document.querySelector('#explorar').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#searchInput').focus(),350);});
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>$('.main-nav').classList.remove('open')));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeVideo();closeCart();}});

// INICIO: pinta los diez kits y el estado del carrito guardado.
render();updateCart();
