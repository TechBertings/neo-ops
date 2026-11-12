"use client";
import {useApp} from "@/lib/store";
import {P,peso,fd,calc} from "@/lib/data";

export default function Profile(){
  const {user,last}=useApp();
  const k=last&&last.pkg!==null?P[last.pkg]:null,c=k?calc(last.pkg,last.disc):null;
  return <div className="wrap">
    <h1>My Profile</h1>
    <div className="pn sm" style={{marginTop:16}}>
      <h3>Account</h3>
      <table><tbody>
        <tr><td>NAME</td><td>{user.name}</td></tr>
        <tr><td>EMAIL</td><td>{user.email||"—"}</td></tr>
        <tr><td>PHONE</td><td>{user.phone?`+63 ${user.phone}`:"—"}</td></tr>
        <tr><td>FACEBOOK</td><td>{user.fb||"—"}</td></tr>
      </tbody></table>
    </div>
 
  </div>;
}