import {$,esc,store,toast} from './utils.js';
export function showDialog(title,body,onMount){
  document.querySelector('#fw-dialog')?.remove();
  const dialog=document.createElement('dialog');dialog.id='fw-dialog';dialog.className='fw-dialog';
  dialog.innerHTML=`<button class="dialog-close" aria-label="Close dialog">×</button><h2>${esc(title)}</h2>${body}`;
  document.body.append(dialog);dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();onMount?.(dialog);return dialog;
}
export function openFamily(){
  const p=store.get('family',{people:3,budget:100,priority:'balanced'});
  showDialog('A little about your household',`<p class="muted">Optional preferences for more useful picks.</p><form id="family-form" class="fw-form"><label>People at home<select name="people">${[1,2,3,4,5,6].map(n=>`<option ${n==p.people?'selected':''}>${n}</option>`).join('')}</select></label><label>Budget per item (£)<input name="budget" type="number" min="5" max="5000" value="${Number(p.budget)||100}" required></label><label>What matters most?<select name="priority">${[['balanced','A balanced choice'],['running','Lower running costs'],['delivery','Faster delivery']].map(([v,t])=>`<option value="${v}" ${p.priority===v?'selected':''}>${t}</option>`).join('')}</select></label><div class="button-row"><button class="pill pill-blue">Save preferences</button><button type="button" id="family-reset" class="link-btn">Reset</button></div><details><summary>How are these used?</summary><p>Saved only in this browser. We rank matching capacity, item budget and your chosen priority. Product ratings remain sample data.</p></details></form>`,d=>{
    $('#family-form',d).onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);store.set('family',{people:Number(f.get('people')),budget:Number(f.get('budget')),priority:f.get('priority')});d.close();document.dispatchEvent(new CustomEvent('family-changed'));toast('Household preferences saved');};
    $('#family-reset',d).onclick=()=>{store.set('family',null);d.close();document.dispatchEvent(new CustomEvent('family-changed'));};
  });
}
export function initFamily(){
  $('#family-open').onclick=openFamily;
  $('#about-edition').onclick=()=>showDialog('Two projects, one thoughtful shop',`<p>StarPick’s catalogue, search, reviews and PK comparison meet FamilyWise’s calm design and household shopping tools.</p><div class="info-grid"><div><strong>Choose with confidence</strong><p>Compare purchase and estimated running costs.</p></div><div><strong>See the journey</strong><p>Choose a warehouse and follow each demo parcel.</p></div></div><p class="muted">Integrated V1.1 · All products, reviews, shipping quotes and orders are simulated. No payments are taken.</p><a class="pill pill-grey" href="classic/">View original StarPick ↗</a>`);
}
