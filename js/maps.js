import {WAREHOUSES,CITIES} from './domain.js';
// The delivery list remains usable when external map tiles are unavailable.
export function mountMap(el,{warehouses=WAREHOUSES,city=CITIES[1]}={}){
  if(!window.L||!el)return;
  const L=window.L,map=L.map(el,{scrollWheelZoom:false}).setView([53,-2],5);
  const tile=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:17}).addTo(map);
  let errors=0;tile.on('tileerror',()=>{if(++errors===3){const note=document.createElement('p');note.className='map-note';note.textContent='Map tiles unavailable. Warehouse and delivery details are listed below.';el.after(note);}});
  const pts=[];for(const w of warehouses){pts.push([w.lat,w.lng]);L.circleMarker([w.lat,w.lng],{radius:7,color:'#547a67',fillOpacity:1}).addTo(map).bindPopup(w.name);}
  pts.push([city.lat,city.lng]);L.circleMarker([city.lat,city.lng],{radius:6,color:'#c58049',fillOpacity:1}).addTo(map).bindPopup(`Delivery: ${city.name}`);
  if(warehouses.length===1)L.polyline(pts,{color:'#547a67',dashArray:'6 8',weight:2}).addTo(map);
  map.fitBounds(pts,{padding:[30,30],maxZoom:9});
  const observer=new ResizeObserver(()=>map.invalidateSize());observer.observe(el);
  const routeObserver=new MutationObserver(()=>{if(!el.isConnected){observer.disconnect();routeObserver.disconnect();map.remove();}});routeObserver.observe(document.body,{childList:true,subtree:true});
}
