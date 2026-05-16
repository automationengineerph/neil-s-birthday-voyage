import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Anchor, Ship, GraduationCap, Heart, MapPin, Calendar, Briefcase, Facebook } from "lucide-react";
import heroImg from "@/assets/neil-hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const BIRTH_YEAR = 1985;
const age = new Date().getFullYear() - BIRTH_YEAR;

function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const today = new Date();
    // Always run on load for celebration; especially on May 16
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const colors = ["#c9a84c", "#1b7fa8", "#ffffff", "#f5d97a", "#0a1f44"];
    const count = today.getMonth() === 4 && today.getDate() === 16 ? 220 : 120;
    const pieces = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      r: 4 + Math.random() * 6,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 1 + Math.random() * 3,
      vx: -1 + Math.random() * 2,
      rot: Math.random() * Math.PI,
      vr: -0.1 + Math.random() * 0.2,
    }));
    let frame = 0;
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vr;
        if (p.y > canvas.height) p.y = -10;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      });
      frame++;
      if (frame < 600) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}

function Waves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 w-[200%] h-full animate-wave"
        viewBox="0 0 2400 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C300,180 600,20 1200,100 C1800,180 2100,20 2400,100 L2400,200 L0,200 Z"
          fill="oklch(0.58 0.11 220 / 0.35)"
        />
        <path
          d="M0,130 C400,200 800,60 1200,130 C1600,200 2000,60 2400,130 L2400,200 L0,200 Z"
          fill="oklch(0.22 0.08 260 / 0.7)"
        />
      </svg>
    </div>
  );
}

function FloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <Anchor className="absolute top-[12%] left-[8%] w-10 h-10 text-gold/20 animate-float-slow" />
      <Ship className="absolute top-[20%] right-[10%] w-12 h-12 text-gold/15 animate-float-slow" style={{ animationDelay: "1s" }} />
      <Anchor className="absolute bottom-[30%] right-[15%] w-8 h-8 text-gold/20 animate-float-slow" style={{ animationDelay: "2s" }} />
      <Ship className="absolute top-[55%] left-[12%] w-9 h-9 text-gold/15 animate-float-slow" style={{ animationDelay: "3s" }} />
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-navy-deep text-foreground overflow-x-hidden">
      <Confetti />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-navy-deep via-navy to-navy-deep">
        <FloatingIcons />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-navy/40 backdrop-blur-sm mb-8">
            <Anchor className="w-4 h-4 text-gold" />
            <span className="text-sm tracking-widest uppercase text-gold-soft">A Tribute</span>
          </div>

          <div className="mb-10 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-teal blur-2xl opacity-40" />
              <img
                src={heroImg}
                alt="Neil Espinosa Pecha cycling by the river"
                width={240}
                height={240}
                className="relative w-48 h-48 md:w-60 md:h-60 rounded-full object-cover border-4 border-gold shadow-2xl shadow-gold/30"
              />
            </div>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-gold animate-shimmer leading-tight">
            Happy Birthday, Neil! 🎂
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            May 16, 1985 → Turning <span className="text-gold font-semibold">{age}</span> today!
          </p>
          <p className="mt-3 text-base text-muted-foreground/80 italic">
            Chief Engineer · Leonis Navigation Co., Inc.
          </p>
        </div>
        <Waves />
      </section>

      {/* PROFILE CARD */}
      <section className="px-6 py-20 bg-navy">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center text-gold mb-12">The Captain of the Engine Room</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Anchor, label: "Full Name", value: "Neil Espinosa Pecha" },
              { icon: Briefcase, label: "Role", value: "Chief Engineer" },
              { icon: Ship, label: "Company", value: "Leonis Navigation Co., Inc." },
              { icon: MapPin, label: "Location", value: "Bacolod City, Philippines" },
              { icon: Calendar, label: "Birthday", value: "May 16, 1985" },
              { icon: GraduationCap, label: "Alma Mater", value: "VMA Global College" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-5 rounded-xl bg-navy-deep/60 border border-gold/20 hover:border-gold/50 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="text-foreground font-medium">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAMILY */}
      <section className="relative px-6 py-24 bg-gradient-to-br from-navy-deep via-navy to-navy-deep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.13_85/0.08),transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <Heart className="w-12 h-12 text-gold mx-auto mb-6 fill-gold/30" />
          <h2 className="font-display text-4xl md:text-5xl text-gold mb-4">His Greatest Voyage ❤️</h2>
          <p className="text-muted-foreground mb-10">Beyond the engines and the open sea, his truest course is home.</p>
          <div className="inline-block p-8 md:p-10 rounded-2xl bg-navy/70 border border-gold/30 backdrop-blur-sm">
            <div className="text-sm uppercase tracking-widest text-gold-soft mb-2">Married Since</div>
            <div className="font-display text-3xl md:text-4xl text-foreground mb-6">December 27, 2012</div>
            <div className="h-px w-24 mx-auto bg-gold/40 mb-6" />
            <div className="text-sm uppercase tracking-widest text-gold-soft mb-2">With</div>
            <div className="font-display text-2xl md:text-3xl text-gold">Jhun Espinosa Pecha</div>
          </div>
        </div>
      </section>

      {/* CAREER & EDUCATION */}
      <section className="px-6 py-20 bg-navy">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center text-gold mb-12">Career & Education</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-navy-deep/60 border border-gold/20">
              <div className="text-4xl mb-4">🚢</div>
              <div className="text-xs uppercase tracking-widest text-gold-soft mb-2">Work</div>
              <h3 className="font-display text-2xl text-foreground mb-1">Leonis Navigation Co., Inc.</h3>
              <p className="text-muted-foreground">Chief Engineer</p>
            </div>
            <div className="p-8 rounded-2xl bg-navy-deep/60 border border-gold/20">
              <div className="text-4xl mb-4">🎓</div>
              <div className="text-xs uppercase tracking-widest text-gold-soft mb-2">Education</div>
              <h3 className="font-display text-2xl text-foreground mb-1">VMA Global College</h3>
              <p className="text-muted-foreground">Marine Engineering</p>
            </div>
          </div>
        </div>
      </section>

      {/* BIRTHDAY MESSAGE */}
      <section className="relative px-6 py-24 bg-gradient-to-br from-gold via-gold-soft to-gold text-navy-deep overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Anchor className="absolute top-10 left-10 w-40 h-40" />
          <Ship className="absolute bottom-10 right-10 w-48 h-48" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-6">🎉</div>
          <blockquote className="font-display text-2xl md:text-4xl leading-snug font-semibold text-navy-deep">
            "To the man who keeps the engines running and his family's heart full — Happy Birthday, Neil! Wishing you calm seas, fair winds, and all the joy you deserve. 🎉⚓"
          </blockquote>
          <div className="mt-8 text-sm uppercase tracking-[0.3em] text-navy">— With love, from all of us</div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-navy-deep text-center">
        <h2 className="font-display text-3xl md:text-4xl text-gold mb-6">Send Him Your Wishes</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Drop by his Facebook to leave a birthday message.
        </p>
        <a
          href="https://www.facebook.com/neil.pecha"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1877f2] hover:bg-[#1664d9] text-white font-semibold transition-all shadow-lg shadow-[#1877f2]/30 hover:scale-105"
        >
          <Facebook className="w-5 h-5" />
          Connect with Neil on Facebook
        </a>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 bg-navy-deep border-t border-gold/20 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Anchor className="w-4 h-4 text-gold" />
          <span>© 2025 Neil Espinosa Pecha | Chief Engineer — Leonis Navigation Co., Inc.</span>
        </div>
        <div>Made with <span className="text-gold">❤</span> from Bacolod City</div>
      </footer>
    </div>
  );
}
