"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { trackClick } from "@/actions/trackClick";

export default function RedirectPage() {
  const params = useParams();
  const id = params.id as string;
  const [providerName, setProviderName] = useState<string>("our travel partner");
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current || !id) return;
    hasTriggered.current = true;

    async function performRedirect() {
      try {
        const result = await trackClick(id);
        if (result.providerName) {
          setProviderName(result.providerName);
        }
        // Redirect to provider
        console.log("Executing redirect to: ", result.url);
        window.location.href = result.url;
      } catch (err) {
        console.error("Redirect action failed:", err);
        window.location.href = "/";
      }
    }

    performRedirect();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-8 animate-in fade-in duration-500 ease-out">
        {/* Spinning Geometric Loader */}
        <div className="relative w-16 h-16">
          {/* Track/Base Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          {/* Active spinning indicator */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0047AB] animate-spin [animation-duration:0.22s] [animation-timing-function:cubic-bezier(0.23,1,0.32,1)]" />
        </div>

        <div className="space-y-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#0047AB] font-bold">
            Redirecting Securely
          </span>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-zinc-950 px-4">
            Securing your exclusive deal with <span className="text-[#0047AB]">{providerName}</span>...
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Please wait while we establish a secure affiliate connection.
          </p>
        </div>
      </div>
    </div>
  );
}
