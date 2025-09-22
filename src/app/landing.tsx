import React from "react";
import Link from "next/link";

export default function Landing() {
  return (
    <section className="h-[100vh]">
      <section className="flex justify-between flex-col items-center">
        <div className="flex items-center justify-center h-[90vh] flex-col">
          <section className="w-[fit-content] h-[fit-content] container flex justify-center items-center flex-col gap-0">
            {/* <h1 className=" text-5xl text-left leading-none tracking-[0em] select-none text-black/80 font-black flex gap-2 flex-col">
           <div>   KS{" "}</div> 
            </h1> */}
            <h1 className=" text-5xl text-left leading-none tracking-[0em] select-none text-black/80 font-black flex gap-2 flex-col">
           <div> <span className="text-[#eb9d00] rotate-x-7"> ✦</span> KEEPS</div> 
           {/* <div className="grotesk-font text-sm s">KEEPS</div> */}
            </h1>
            {/* <h2 className="!mb-0 text-4xl text-black/90 font-bold" >A page for every day. </h2> */}
            <p className="text-[1.15rem] text-black/60 mt-2 tracking-wide body-font ">
              Plan, rant, dream, or just collect pretty things.

            </p>
            <div className="flex flex-wrap items-center gap-8 mt-6">
              <Link href="/sign-in" className="text-sm transition-colors">
              <button type="button" className="button-secondary">
               Sign - Save My Vibes
               </button>
              </Link>
              <Link href="/dashboard">
                <button type="button" className="button-primary">
                 Try Keeps Now ✨
                </button>
              </Link>
            </div>
           
          </section>

        </div>
          <p className="text-xs text-black/40 mt-4 ">
              All your vibes stay on this device. <Link href="/sign-up" className="underline-offset-2 hover:underline text-black/60 hover:text-black/80 transition-colors">Make an account</Link> when you’re ready to keep them safe everywhere.
            </p>
      </section>
    </section>
  );
}
