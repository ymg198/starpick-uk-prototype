import {PRODUCTS} from '../data/products.js';
import {store} from './utils.js';
import {stock,shipping,defaultWarehouse,round,STAGES,CITIES} from './domain.js';
export const getCart=()=>store.get('cart',[]);
export const destination=()=>store.get('destination','manchester');
export const warehouseFor=p=>{const id=store.get('warehouses',{})[p.id];return stock(p,id)>0?id:defaultWarehouse(p);};
export function chooseWarehouse(p,id){if(!stock(p,id))return false;store.set('warehouses',{...store.get('warehouses',{}),[p.id]:id});return true;}
function save(lines){store.set('cart',lines);if(typeof document!=='undefined')document.dispatchEvent(new CustomEvent('cart-changed'));}
export function addItem(p,{size='',colour='',quantity=1,warehouse=warehouseFor(p)}={}) {
  if(p.sizes&&!p.sizes.includes(size))throw new Error('Choose a size before adding this item.');
  if(p.colors.length&&colour&&!p.colors.includes(colour))throw new Error('Choose an available colour.');
  colour=colour||p.colors[0]||'';
  const lines=getCart(),key=[p.id,size,colour,warehouse].join('|'),old=lines.find(x=>x.key===key);
  const qty=(old?.quantity||0)+Math.max(1,Math.floor(Number(quantity)||1));
  const allocated=lines.filter(x=>x.id===p.id&&x.warehouse===warehouse&&x.key!==key).reduce((n,x)=>n+x.quantity,0);
  if(qty+allocated>stock(p,warehouse))throw new Error('This quantity exceeds the warehouse stock.');
  if(old)old.quantity=qty;else lines.push({key,id:p.id,size,colour,quantity:qty,warehouse});
  save(lines);return key;
}
export function updateQuantity(key,quantity){
  const lines=getCart(),line=lines.find(x=>x.key===key);if(!line)return;
  const q=Math.floor(Number(quantity));if(!Number.isFinite(q)||q<0)throw new Error('Enter a valid quantity.');
  if(!q){save(lines.filter(x=>x.key!==key));return;}
  const p=PRODUCTS.find(p=>p.id===line.id);
  const other=lines.filter(x=>x.id===line.id&&x.warehouse===line.warehouse&&x.key!==key).reduce((n,x)=>n+x.quantity,0);
  if(q+other>stock(p,line.warehouse))throw new Error('This quantity exceeds the warehouse stock.');
  line.quantity=q;save(lines);
}
export function cartSummary(lines=getCart(),city=destination()){
  const detail=lines.map(l=>{const p=PRODUCTS.find(p=>p.id===l.id);if(!p)return null;const quote=shipping(p,l.warehouse,city);return {...l,p,quote,subtotal:round(p.price*l.quantity),delivery:round(quote.fee*l.quantity)};}).filter(Boolean);
  const subtotal=round(detail.reduce((n,l)=>n+l.subtotal,0)),delivery=round(detail.reduce((n,l)=>n+l.delivery,0));
  return{lines:detail,subtotal,delivery,total:round(subtotal+delivery),quantity:detail.reduce((n,l)=>n+l.quantity,0)};
}
export const getOrders=()=>store.get('newOrders',[]);
export function submitOrder({name,city,acknowledged}){
  if(!acknowledged)throw new Error('Confirm this is a demonstration order.');
  if(!name?.trim()||!CITIES.some(x=>x.id===city))throw new Error('Enter your name and choose a supported delivery city.');
  const summary=cartSummary(getCart(),city);if(!summary.lines.length)throw new Error('Your basket is empty.');
  for(const line of summary.lines){const allocated=summary.lines.filter(x=>x.id===line.id&&x.warehouse===line.warehouse).reduce((n,x)=>n+x.quantity,0);if(allocated>stock(line.p,line.warehouse))throw new Error('Stock changed. Please update your basket.');}
  const now=new Date(),id='FW-'+now.getTime().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,5).toUpperCase();
  const order={id,date:now.toISOString().slice(0,10),createdAt:now.toISOString(),name:name.trim().slice(0,80),city,status:'Processing',items:summary.lines.map(x=>x.id),lines:summary.lines.map(({p,quote,...l})=>({...l,unitPrice:p.price,days:quote.days,unitShipping:quote.fee})),subtotal:summary.subtotal,delivery:summary.delivery,total:summary.total,stages:{}};
  for(const l of order.lines)order.stages[l.warehouse]=0;
  store.set('destination',city);store.set('newOrders',[order,...getOrders()]);save([]);return order;
}
export function advanceOrder(id,warehouse,reset=false){
  const orders=getOrders(),o=orders.find(x=>x.id===id);if(!o?.stages||!(warehouse in o.stages))return;
  o.stages[warehouse]=reset?0:Math.min(STAGES.length-1,o.stages[warehouse]+1);
  const values=Object.values(o.stages);o.status=values.every(x=>x===5)?'Delivered':values.some(x=>x>=2)?'In transit':'Processing';
  store.set('newOrders',orders);
}
