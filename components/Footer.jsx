import Link from "next/link";

// Ilagay ang mga image sa public/social/ at palitan ang mga link
const SOCIALS=[
  {name:"Instagram",href:"https://instagram.com/",icon:"/images/instagram.png"},
  {name:"TikTok",href:"https://tiktok.com/",icon:"/images/tiktok.png"},
  {name:"Facebook",href:"https://facebook.com/",icon:"/images/fb.png"},
];

export default function Footer(){
  return (
    <footer className="ft">
      <div className="ft-in">
        <div className="ft-c">
          <Link className="logo" href="/">NEO<small>STUDIOS</small></Link>
          <p>A self-portrait studio in Malabon City, Philippines. Create freely. Capture authentically.</p>
          <div className="soc2">
            {SOCIALS.map(s=>(
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                <img src={s.icon} alt=""/>
              </a>
            ))}
          </div>
        </div>
        <div className="ft-c">
          <h4>Explore</h4>
<Link href="/">Home</Link><Link href="/about">About</Link><Link href="/my-bookings">My Bookings</Link><Link href="/booking">Booking</Link>        </div>
        <div className="ft-c">
          <h4>Legal</h4>
          <Link href="/privacy-policy">Privacy Policy</Link>
       <Link href="/terms-and-conditions">Terms and Condition</Link>
        </div>
        <div className="ft-c">
          <h4>Studio</h4>
          <span>Malabon City, Philippines</span>
          <span>Open daily, 7:00 AM to 7:00 PM</span>
        </div>
      </div>
      <div className="ft-b">
        <span>© 2026 Neo Studios.</span>
        <span style={{letterSpacing:3}}>www.neostudiosph.com</span>
      </div>
    </footer>
  );
}