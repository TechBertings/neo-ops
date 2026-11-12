import {Art} from "@/components/Chrome";

export default function Home(){
  return (
    <div className="hero">
      <div className="tiles">
        {Array.from({length:18},(_,i)=><div key={i}><Art/></div>)}
      </div>
      <div className="t">
        <h1>Welcome to NEO Studios</h1>
        <p>A self-portrait studio in Malabon City, Philippines where you take the lead. Create freely. Capture authentically. Remember every moment.</p>
      </div>
    </div>
  );
}