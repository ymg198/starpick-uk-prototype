import {$,$$,money,esc,store} from './utils.js';
import {energySpec,tco,comparable} from './domain.js';
import {shipping} from './domain.js';
import {warehouseFor,destination} from './commerce.js';
export function mountCost(root,items){
  const eligible=items.filter(energySpec);if(!eligible.length)return;
  const same=eligible.every(p=>comparable(p,eligible[0]));
  const prefs=store.get('cost',{years:3,days:300,tariff:.25});
  root.innerHTML=`<details class="fw-cost card" ${items.length>1?'open':''}><summary><span><span class="eyebrow">Beyond the price tag</span><strong>What will it cost to own?</strong></span><span class="cost-preview"></span></summary><div class="cost-body"><p class="muted">Purchase + delivery + electricity + care · ${eligible.length<items.length?'Estimates only for supported appliances. ':''}${!same?'Different product types: totals reflect different uses.':''}</p><form class="cost-controls"><label>Years<select name="years">${[1,2,3,4,5].map(y=>`<option ${y===Number(prefs.years)?'selected':''}>${y}</option>`).join('')}</select></label><label>Days / year<input name="days" type="number" min="0" max="366" step="1" value="${prefs.days}"></label><label>Electricity (£/kWh)<input name="tariff" type="number" min="0" max="2" step=".01" value="${prefs.tariff}"></label>${eligible.map(p=>`<label>${esc(p.name.split(' ').slice(0,3).join(' '))} · hours/day<input aria-label="${esc(p.name)} hours per day" data-hours="${p.id}" type="number" min="0" max="24" step=".01" value="${energySpec(p).hours}"></label>`).join('')}</form><div class="cost-chart" aria-live="polite"></div><details><summary>Assumptions & calculation</summary><p>Electricity = rated kW × hours per day × days per year × years × tariff. This simple full-power model does not simulate thermostat cycling. Care is a fictional annual allowance. Shipping is the selected warehouse’s per-unit quote.</p><p>Tariff defaults to a demo £0.25/kWh; this is not a current supplier quote. Original catalogue variants inherit their base model’s energy assumption. Unsupported products have no estimate.</p><p>Use the same hours when comparing appliances doing the same job. All inputs are editable; actual use and costs will vary.</p></details></div></details>`;
  const form=$('form',root),chart=$('.cost-chart',root);
  const update=()=>{
    if(!form.reportValidity())return;
    const f=new FormData(form),options={years:+f.get('years'),days:+f.get('days'),tariff:+f.get('tariff')};store.set('cost',options);
    const results=eligible.map(p=>({p,c:tco(p,{...options,hours:+$(`[data-hours="${p.id}"]`,root).value,shipping:shipping(p,warehouseFor(p),destination()).fee})}));
    const max=Math.max(...results.map(x=>x.c.total),1);
    $('.cost-preview',root).textContent=items.length===1?`${money(results[0].c.total)} / ${options.years} years`:'Estimate & compare';
    chart.innerHTML=`<div class="legend"><span>● Purchase & delivery</span><span>● Electricity</span><span>● Care</span></div>${results.map(({p,c})=>`<div class="cost-result"><div class="split"><strong>${esc(p.name)}</strong><strong>${money(c.total)}</strong></div><div class="stack" role="img" aria-label="${esc(p.name)} total ${money(c.total)}"><i style="width:${(c.purchase+c.delivery)/max*100}%"></i><i style="width:${c.electricity/max*100}%"></i><i style="width:${c.care/max*100}%"></i></div><div class="cost-values">Purchase ${money(c.purchase)} · delivery ${money(c.delivery)} · electricity ${money(c.electricity)} · care ${money(c.care)}</div></div>`).join('')}`;
  };form.addEventListener('input',update);form.onsubmit=e=>e.preventDefault();update();
}
