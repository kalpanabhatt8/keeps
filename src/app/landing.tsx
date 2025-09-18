import React from "react";
import Link from "next/link";

export default function Landing() {
  return (
    <section className="">
      <section className="">
        <div className="flex items-center justify-center h-[90vh]">
          <section className="w-[fit-content] h-[fit-content] container flex justify-center items-center flex-col gap-0">
            <h1 className="pixel-font !mb-0 text-5xl text-left leading-none tracking-[0em] select-none text-black/80 font-bold">
              KEEPS{" "}
            </h1>
            {/* <h2 className="!mb-0 text-4xl text-black/90 font-bold" >A page for every day. </h2> */}
            <p className="text-[1.4rem] text-black/60 font-extralight mt-[-4px] tracking-wide slab-font">
              Plan, rant, dream, or just collect pretty things.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link href="/sign-in">
                <button type="button" className="keeps-button">
                  Sign In
                </button>
              </Link>
           
              <Link href="/sign-up">
                <button type="button" className="keeps-button">
                Get Started
                </button>
              </Link>
            </div>
          </section>
        </div>
      </section>
    </section>
  );
}
