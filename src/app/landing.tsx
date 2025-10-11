import React from "react";
import Link from "next/link";

export default function Landing() {
  return (
    <section className="h-[100vh] landing-body">
      <section className="flex justify-between flex-col items-center">
        <div className="flex items-center justify-center h-[90vh] flex-col">
          <section className="w-[fit-content] h-[fit-content] container flex justify-center items-center flex-col gap-0">
            {/* <h1 className=" text-5xl text-left leading-none tracking-[0em] select-none text-black/80 font-black flex gap-2 flex-col">
           <div>   KS{" "}</div> 
            </h1> */}
            <h1 className="text-6xl text-left font-[500] leading-none select-none logo-font text-ink-strong">
              <span className="mr-[0.03em]">K</span>EEPS
            </h1>
            {/* <Image
                src="/Images/image.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* <Image
                src="/Images/megira.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* 
              <Image
                src="/Images/Vensfolk.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                src="/Images/Caress.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* 
              <Image
                src="/Images/ButeSans.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* <Image
                src="/Images/Bute.png"
                alt="A picture of me"
                width={160}
                height={160}
              />

              <Image
                src="/Images/Finance.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                src="/Images/Uniqueen.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* <Image
                src="/Images/Qeilab.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                src="/Images/Platinum.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                src="/Images/Highbary.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                src="/Images/HighbaryC.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* <Image
                src="/Images/JHINBEY.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                src="/Images/Maharlika.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* <Image
                src="/Images/Identica.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                height={160}
                src="/Images/Caudex.png"
                alt="A picture of me"
                width={160}
              /> */}

            {/* <Image
                src="/Images/Newt.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                src="/Images/Better.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                src="/Images/Tropical.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <Image
                src="/Images/Dosca.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* <Image
                src="/Images/Expletus.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* 
              <Image
                src="/Images/Natural.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* 
<Image
                src="/Images/Laachir.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}
            {/* 
              <Image
                src="/Images/Natural.png"
                alt="A picture of me"
                width={160}
                height={160}
              /> */}

            {/* <h2 className="!mb-0 text-4xl text-black/90 font-bold" >A page for every day. </h2> */}
            <p className="text-[1.15rem] text-ink-soft mt-2 body-font font-light">
              Plan, rant, dream, or just collect pretty things.
            </p>
            <div className="flex flex-wrap items-center gap-8 mt-6">
              <Link href="/sign-in" className="text-sm transition-colors">
                <button  className="button-secondary">
                  Sign - Save My Vibes
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="button-primary">
                  Try Keeps Now ✨
                </button>
              </Link>
            </div>
          </section>
        </div>
        <p className="text-sm text-ink-muted mt-4 accent-font">
          All your vibes stay on this device.{" "}
          <Link
            href="/sign-up"
            className="underline-offset-2 hover:underline text-ink hover:text-ink transition-colors"
          >
            Make an account
          </Link>{" "}
          when you’re ready to keep them safe everywhere.
        </p>
      </section>
    </section>
  );
}
