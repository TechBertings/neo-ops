export function Field({label,name,v,set,err,type="text",ph=""}){
  return(<><label htmlFor={name}>{label}</label><input id={name} type={type} placeholder={ph} value={v[name]||""} onChange={e=>set({...v,[name]:e.target.value})} className={err?"bad":""}/>{err&&<small className="e">{err}</small>}</>);
}
export function Phone({v,set,name="phone",err}){
  return(<><label>Contact Number</label><div className="ph"><span>+63</span><input type="tel" placeholder="9XX XXX XXXX" value={v[name]||""} onChange={e=>set({...v,[name]:e.target.value})} className={err?"bad":""}/></div>{err&&<small className="e">{err}</small>}</>);
}
