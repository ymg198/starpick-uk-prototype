// Explicit demo inputs; power is never inferred from a marketing/specification string.
export const CITIES = [
  {id:'london',name:'London',lat:51.5074,lng:-0.1278},
  {id:'manchester',name:'Manchester',lat:53.4808,lng:-2.2426},
  {id:'birmingham',name:'Birmingham',lat:52.4862,lng:-1.8904},
  {id:'edinburgh',name:'Edinburgh',lat:55.9533,lng:-3.1883},
];
export const WAREHOUSES = [
  {id:'london',name:'London warehouse',country:'UK',lat:51.53,lng:-0.38},
  {id:'manchester',name:'Manchester warehouse',country:'UK',lat:53.46,lng:-2.32},
  {id:'shenzhen',name:'Shenzhen warehouse',country:'CN',lat:22.5431,lng:114.0579},
];
const ENERGY = {k1:[3000,.05,8],k2:[2200,.05,8],l1:[5,4,2],l2:[8,4,2],l3:[6,4,2],y3:[1000,.2,5]};
export function energySpec(p) {
  if(p.energy) return p.energy;
  const v=ENERGY[p.base||p.id];
  return v?{watts:v[0],hours:v[1],annualCare:v[2]}:null;
}
export const round = n => Math.round((n+Number.EPSILON)*100)/100;
export function tco(p,{years=3,hours,days=300,tariff=.25,shipping=0}={}) {
  const spec=energySpec(p); if(!spec)return null;
  const y=Math.min(5,Math.max(1,Number(years)||3));
  const h=Math.min(24,Math.max(0,Number(hours??spec.hours)||0));
  const d=Math.min(366,Math.max(0,Number(days)||0));
  const rate=Math.min(2,Math.max(0,Number(tariff)||0));
  const electricity=round(spec.watts/1000*h*d*y*rate),care=round(spec.annualCare*y);
  const purchase=round(p.price),delivery=round(Math.max(0,Number(shipping)||0));
  return {purchase,delivery,electricity,care,total:round(purchase+delivery+electricity+care),years:y,hours:h,days:d,tariff:rate};
}
export function stock(p,warehouseId) {
  if(!WAREHOUSES.some(w=>w.id===warehouseId))return 0;
  if(p.stocks) return p.stocks[warehouseId]||0;
  if(p.warehouse==='CN') return warehouseId==='shenzhen'?18:0;
  if(warehouseId==='shenzhen') return 0;
  const seed=[...p.id].reduce((n,c)=>n+c.charCodeAt(0),0);
  return warehouseId==='london'?4+seed%13:3+seed%8;
}
export function shipping(p,warehouseId,cityId='manchester') {
  const w=WAREHOUSES.find(x=>x.id===warehouseId)||WAREHOUSES[0];
  const city=CITIES.find(x=>x.id===cityId)||CITIES[1];
  const overseas=w.country==='CN',local=w.id===city.id;
  const days=overseas?[7,14]:local?[1,2]:city.id==='edinburgh'?[3,5]:[2,4];
  // Per-unit prototype quote. No hidden order-level free-delivery threshold.
  const fee=overseas?5.99:local?1.99:3.49;
  return {warehouse:w,city,days,fee,stock:stock(p,w.id)};
}
export function defaultWarehouse(p) {return WAREHOUSES.find(w=>stock(p,w.id)>0)?.id||'london';}
export function comparable(a,b) {return a.category===b.category&&a.sub===b.sub;}
export function familyScore(p,profile) {
  let score=p.rating*10;
  const reasons=[];
  if(!profile)return{score,reasons};
  if(profile.budget&&p.price<=profile.budget){score+=5;reasons.push('Within your item budget');}
  if(p.capacity&&p.capacity>=Number(profile.people)*1.2){score+=10;reasons.push('Capacity for your household');}
  if(profile.priority==='running'&&energySpec(p)){score+=12-(energySpec(p).watts/1000);reasons.push('Running costs available');}
  if(profile.priority==='delivery'&&p.warehouse==='UK'){score+=8;reasons.push('UK warehouse available');}
  return {score,reasons};
}
export const STAGES=['Order confirmed','Preparing your parcel','Dispatched','In transit','Out for delivery','Delivered'];
