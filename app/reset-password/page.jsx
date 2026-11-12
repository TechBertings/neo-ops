"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {AuthShell} from "@/components/Chrome";
import {Field} from "@/components/Field";
export default function Reset(){
  const [v,set]=useState({}),[err,setErr]=useState({}),r=useRouter();
  const submit=e=>{e.preventDefault();const x={};if((v.pw||"").length<8)x.pw="Password too short! Use at least 8 characters.";if(v.pw!==v.pw2)x.pw2="Passwords don’t match!";setErr(x);if(!Object.keys(x).length)r.push("/login")};
  return <AuthShell><form onSubmit={submit} noValidate><h2 style={{fontSize:28}}>Create New Password</h2><p className="sub">Choose a strong password that you haven’t used before.</p>
    <Field label="New Password" name="pw" type="password" ph="At least 8 characters" v={v} set={set} err={err.pw}/>
    <Field label="Confirm New Password" name="pw2" type="password" ph="Repeat password" v={v} set={set} err={err.pw2}/>
    <button className="btn" style={{marginTop:14}}>Reset Password</button></form></AuthShell>;
}
