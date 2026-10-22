import {$,$$,esc,money,store,toast} from './utils.js';
import {WAREHOUSES,CITIES,shipping,stock} from './domain.js';
import {warehouseFor,chooseWarehouse,destination} from './commerce.js';
import {showDialog} from './family.js';
import {mountMap} from './maps.js';
export function warehouseSummary(p){const q=shipping(p,warehouseFor(p),destination());return `<span class="warehouse-label">${q.warehouse.name} · ${q.days.join('–')} days · ${money(q.fee)}</span>`;}
export function openWarehouses(p,onChoose){
  showDialog('A shorter journey, a clearer choice',`<p class="muted">Choose where your item starts.</p><label class="destination-line">Deliver to<select id="warehouse-city" aria-label="Warehouse delivery city">${CITIES.map(c=>`<option value="${c.id}" ${c.id===destination()?'selected':''}>${c.name}</option>`).join('')}</select></label><div class="route-map" id="warehouse-map"></div><div id="warehouse-options"></div><details><summary>About stock & delivery</summary><p>Stock counts, fees and calendar-day windows are deterministic demo estimates. Quotes are per unit. Warehouse choice is saved for this product; items already in your basket keep their selected origin.</p></details>`,d=>{
    d.addEventListener('close',()=>onChoose?.(),{once:true});
    const render=()=>{const city=destination();$('#warehouse-options',d).innerHTML=WAREHOUSES.map(w=>{const q=shipping(p,w.id,city),n=stock(p,w.id);return `<button class="warehouse-option ${w.id===warehouseFor(p)?'selected':''}" data-warehouse="${w.id}" ${!n?'disabled':''}><span><strong>${w.name}</strong><small>${n?`${n} in stock · ${q.days.join('–')} days`:'Out of stock'}</small></span><strong>${money(q.fee)}</strong><span>${w.id===warehouseFor(p)?'✓':'→'}</span></button>`;}).join('');$$('[data-warehouse]',d).forEach(b=>b.onclick=()=>{chooseWarehouse(p,b.dataset.warehouse);d.close();toast('Warehouse choice saved');});};
    $('#warehouse-city',d).onchange=e=>{store.set('destination',e.target.value);render();const old=$('#warehouse-map',d),next=old.cloneNode(false);old.replaceWith(next);mountMap(next,{city:CITIES.find(c=>c.id===destination())});};render();
    mountMap($('#warehouse-map',d),{city:CITIES.find(c=>c.id===destination())});
    // Destroy the map observer when the native dialog leaves the DOM as well.
  });
}
