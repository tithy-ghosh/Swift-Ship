"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MdArrowForward,
  MdCheck,
  MdErrorOutline,
  MdHome,
  MdInventory2,
  MdLocationOn,
  MdLocalShipping,
  MdMyLocation,
  MdOutlineAccessTime,
  MdOutlineSearch,
  MdRefresh,
} from "react-icons/md";

const STATUS_META = {
  order_placed: { label: "Order placed", icon: MdInventory2 },
  pending: { label: "Order placed", icon: MdInventory2 },
  picked_up: { label: "Parcel picked up", icon: MdLocalShipping },
  "picked-up": { label: "Parcel picked up", icon: MdLocalShipping },
  in_transit: { label: "In transit", icon: MdLocalShipping },
  "in-transit": { label: "In transit", icon: MdLocalShipping },
  out_for_delivery: { label: "Out for delivery", icon: MdMyLocation },
  delivered: { label: "Delivered", icon: MdHome },
  failed_delivery: { label: "Delivery attempt failed", icon: MdErrorOutline },
  returned: { label: "Returned", icon: MdErrorOutline },
  cancelled: { label: "Cancelled", icon: MdErrorOutline },
};

const normalizeStatus = (status = "") => status.toLowerCase().trim();

const getStatusMeta = (status) => {
  const key = normalizeStatus(status);
  return STATUS_META[key] || {
    label: key.replaceAll("_", " ").replaceAll("-", " ") || "Update",
    icon: MdCheck,
  };
};

const formatDate = (value) => {
  if (!value) return "Time not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const TrackingSkeleton = () => (
  <div className="mt-8 animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white">
    <div className="h-32 bg-slate-100" />
    <div className="space-y-5 p-6 sm:p-8">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-4">
          <div className="size-11 rounded-full bg-slate-100" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-40 rounded bg-slate-100" />
            <div className="h-3 w-64 max-w-full rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function TrackParcelPage() {
  const router = useRouter();
  const params = useParams();
  const trackingParam = params.trackingId;
  const trackingId = Array.isArray(trackingParam) ? trackingParam[0] : trackingParam;
  const [input, setInput] = useState(trackingId || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!trackingId) {
      return;
    }

    const controller = new AbortController();

    async function loadTracking() {
      setLoading(true);
      setError("");
      setResult(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tracking/${encodeURIComponent(trackingId)}`,
          { signal: controller.signal },
        );
        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(body.error || body.message || "We could not find that tracking ID.");
        }

        setResult(body);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Tracking information could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTracking();
    return () => controller.abort();
  }, [trackingId]);

  const parcel = result?.parcel || result?.shipment || result || null;
  const history = useMemo(() => {
    const updates = result?.events || [];
    return [...updates].sort(
      (first, second) =>
        new Date(second.eventTime || second.createdAt) -
        new Date(first.eventTime || first.createdAt),
    );
  }, [result]);

  const currentStatus =
    parcel?.currentStatus || parcel?.status || history[0]?.status || "pending";
  const currentMeta = getStatusMeta(currentStatus);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) {
      setError("Enter a tracking ID to continue.");
      return;
    }
    router.push(`/track/${encodeURIComponent(value)}`);
  };

  return (
    <main className="min-h-screen bg-[#f4f7f3] text-slate-900">
      {!trackingId && (
        <section className="relative overflow-hidden bg-[#14231a] px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20">
          <div className="absolute -left-24 top-0 size-72 rounded-full bg-[#83BD75]/15 blur-3xl" />
          <div className="absolute -right-20 bottom-0 size-72 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#a9db9d]">
              <MdLocationOn className="size-4" /> Live parcel tracking
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Where is your parcel?
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Enter your SwiftShip tracking ID to see every delivery update from pickup to doorstep.
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20 sm:flex-row"
            >
              <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <MdOutlineSearch className="size-6 shrink-0 text-slate-400" />
                <span className="sr-only">Tracking ID</span>
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Enter tracking ID, e.g. SWFT-123456"
                  autoComplete="off"
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm font-semibold uppercase outline-none placeholder:font-normal placeholder:normal-case placeholder:text-slate-400"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#83BD75] px-6 text-sm font-black text-[#14231a] transition hover:bg-[#96ce89] disabled:opacity-60"
              >
                Track parcel <MdArrowForward className="size-5" />
              </button>
            </form>
          </div>
        </section>
      )}

      <section className={`relative z-10 mx-auto max-w-4xl px-4 pb-20 sm:px-6 ${
        trackingId ? "pt-10 sm:pt-14" : "-mt-12 sm:-mt-14"
      }`}>
        {!trackingId && !error && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-12">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#edf7ea] text-[#4d8d41]">
              <MdLocalShipping className="size-8" />
            </span>
            <h2 className="mt-5 text-xl font-black">Ready when you are</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your tracking ID is included in your booking confirmation and parcel dashboard.
            </p>
          </div>
        )}

        {loading && <TrackingSkeleton />}

        {!loading && error && (
          <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl shadow-rose-100/50">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <MdErrorOutline className="size-8" />
            </span>
            <h2 className="mt-4 text-xl font-black">Tracking unavailable</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{error}</p>
            {trackingId && (
              <button
                type="button"
                onClick={() => router.refresh()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
              >
                <MdRefresh className="size-5" /> Try again
              </button>
            )}
          </div>
        )}

        {!loading && !error && result && (
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <header className="bg-gradient-to-r from-[#4d8d41] to-[#70aa62] p-6 text-white sm:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                    <currentMeta.icon className="size-7" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">Current status</p>
                    <h2 className="mt-1 text-2xl font-black">{currentMeta.label}</h2>
                  </div>
                </div>
                <div className="rounded-xl bg-black/10 px-4 py-3 ring-1 ring-white/15">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Tracking ID</p>
                  <p className="mt-0.5 font-mono text-sm font-bold">{parcel?.trackingId || trackingId}</p>
                </div>
              </div>
            </header>

            <div className="grid border-b border-slate-100 sm:grid-cols-3">
              <div className="p-5 sm:border-r sm:border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">From</p>
                <p className="mt-1 truncate text-sm font-bold">{parcel?.senderServiceCenter || parcel?.origin || "Not available"}</p>
              </div>
              <div className="border-y border-slate-100 p-5 sm:border-y-0 sm:border-r">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">To</p>
                <p className="mt-1 truncate text-sm font-bold">{parcel?.receiverServiceCenter || parcel?.destination || "Not available"}</p>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Last updated</p>
                <p className="mt-1 text-sm font-bold">{formatDate(history[0]?.eventTime || history[0]?.createdAt || parcel?.updatedAt)}</p>
              </div>
            </div>

            <section className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#4d8d41]">Shipment journey</p>
                  <h3 className="mt-1 text-xl font-black">Tracking history</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                  {history.length} {history.length === 1 ? "update" : "updates"}
                </span>
              </div>

              {history.length ? (
                <ol>
                  {history.map((update, index) => {
                    const meta = getStatusMeta(update.status);
                    const UpdateIcon = meta.icon;
                    const isLatest = index === 0;

                    return (
                      <li key={update._id || update.id || `${update.status}-${index}`} className="relative flex gap-4 pb-7 last:pb-0">
                        {index < history.length - 1 && (
                          <span className="absolute left-[21px] top-11 h-[calc(100%-2.25rem)] w-px bg-slate-200" />
                        )}
                        <span className={`relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full ${
                          isLatest ? "bg-[#83BD75] text-[#14231a] ring-4 ring-[#edf7ea]" : "bg-slate-100 text-slate-500"
                        }`}>
                          <UpdateIcon className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                            <p className="font-black text-slate-800">{meta.label}</p>
                            <p className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-400">
                              <MdOutlineAccessTime className="size-4" />
                              {formatDate(update.eventTime || update.createdAt)}
                            </p>
                          </div>
                          {update.location && (
                            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#4d8d41]">
                              <MdLocationOn className="size-4 shrink-0" /> {update.location}
                            </p>
                          )}
                          {update.message && <p className="mt-1 text-sm leading-6 text-slate-500">{update.message}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-bold text-slate-600">No tracking updates have been posted yet.</p>
                  <p className="mt-1 text-xs text-slate-400">Check again after your parcel has been processed.</p>
                </div>
              )}
            </section>
          </article>
        )}
      </section>
    </main>
  );
}