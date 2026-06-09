"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Mail, X } from "lucide-react";

interface EsimBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
  planLabel: string;
  totalStr: string;
  coverageRange: string;
}

export default function EsimBuyModal({
  isOpen,
  onClose,
  destinationName,
  planLabel,
  totalStr,
  coverageRange,
}: EsimBuyModalProps) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setSubmitting(false);
      setSubmitted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute inset-0 bg-neutral-900/60 cursor-default"
        tabIndex={-1}
      />
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-lg max-w-md w-full p-6 md:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded p-1 -m-1"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {submitted ? (
          <div>
            <div className="w-12 h-12 bg-fern-50 rounded-lg flex items-center justify-center mb-5">
              <svg
                className="w-6 h-6 text-fern-700"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 id={titleId} className="text-lg font-semibold text-neutral-900 mb-2">
              Check your inbox
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 mb-6">
              We&apos;ve sent your {destinationName} eSIM QR code to{" "}
              <span className="font-semibold text-neutral-900 break-all">{email}</span>.
              Open it from your phone&apos;s camera to install.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-cobalt-500/10 rounded-lg flex items-center justify-center mb-5">
              <Mail className="w-6 h-6 text-cobalt-500" aria-hidden="true" />
            </div>
            <h2 id={titleId} className="text-lg font-semibold text-neutral-900 mb-2 pr-8">
              Where should we send your eSIM?
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 mb-6">
              We&apos;ll email a QR code to install your {destinationName} eSIM.
            </p>

            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-neutral-900 truncate">
                    {destinationName} eSIM
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{planLabel}</div>
                  <div className="text-xs text-slate-500">Active {coverageRange}</div>
                </div>
                <div className="text-2xl font-bold text-neutral-900 shrink-0">
                  ${totalStr}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <label
                htmlFor="buy-email"
                className="block text-sm font-semibold text-neutral-900 mb-2"
              >
                Email address
              </label>
              <input
                ref={inputRef}
                id="buy-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                disabled={submitting}
                autoComplete="email"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-sm text-neutral-800 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus:border-cobalt-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
              />

              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center border border-slate-300 text-neutral-800 hover:bg-slate-50 hover:border-slate-400 font-semibold px-7 py-3 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !email}
                  className="flex-1 inline-flex items-center justify-center bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending…" : `Pay $${totalStr}`}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
