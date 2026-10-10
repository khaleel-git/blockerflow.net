import { useState } from 'react'

const SYSTEM_FONT = "[font-family:-apple-system,BlinkMacSystemFont,'SF_Pro_Text',system-ui,sans-serif]"

function AppIcon({ badge }: { badge: 'warning' | 'ok' }) {
  return (
    <div className="relative mx-auto mb-3 h-[76px] w-[76px]">
      <img src="/assets/icon-512.png" alt="" width={76} height={76} className="h-[76px] w-[76px] rounded-[17px] shadow-md" />
      <div className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-white shadow">
        {badge === 'warning' ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3.5l9.5 16.5h-19L12 3.5z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 10v4.5M12 17.2v.1" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#10B981" />
            <path d="M7.5 12.4l3 3 6-6.4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  )
}

/** The dialog's buttons are part of the picture, not controls, so they are hidden from assistive technology. */
function FakeButton({ primary, children }: { primary?: boolean; children: string }) {
  return (
    <div
      aria-hidden="true"
      className={`mt-2.5 rounded-[9px] py-[7px] text-[13.5px] ${
        primary ? 'bg-[#0a84ff] text-white' : 'bg-white text-[#1d1d1f] shadow-[0_0_0_.5px_rgba(0,0,0,.18),0_1px_1px_rgba(0,0,0,.08)]'
      }`}
    >
      {children}
    </div>
  )
}

/**
 * The macOS message for an app that is not signed, next to the one for a notarized app. Wide spaces show both with an
 * arrow. Narrow ones (a phone, a card) show one at a time with a switch, so the text stays readable. Both are always in
 * the page as real text. The inactive one is hidden with a container query class, not the hidden attribute: Tailwind's
 * base styles make [hidden] display:none !important, which a later rule cannot override.
 */
export function GatekeeperVisual({ className = '' }: { className?: string }) {
  const [signed, setSigned] = useState(false)
  const [touched, setTouched] = useState(false)
  const pick = (v: boolean) => {
    setSigned(v)
    setTouched(true)
  }
  const dialog = `w-full max-w-[300px] rounded-[22px] bg-[rgba(246,246,248,.9)] px-[22px] pb-5 pt-[26px] text-center backdrop-blur-2xl ${SYSTEM_FONT} ${
    touched ? 'motion-safe:animate-dialog-in' : ''
  }`
  const shadow = 'shadow-[0_0_0_.5px_rgba(0,0,0,.25),0_22px_60px_rgba(30,27,75,.35)]'

  return (
    <figure className={`@container ${className}`}>
      <div
        className="overflow-hidden rounded-[28px] p-5 sm:p-8"
        style={{
          background:
            'radial-gradient(900px 400px at 15% 0%,#c7d2fe 0%,transparent 60%),radial-gradient(700px 400px at 100% 100%,#bae6fd 0%,transparent 60%),radial-gradient(500px 300px at 60% 20%,#fbcfe8 0%,transparent 60%),#e0e7ff',
        }}
      >
        <div role="group" aria-label="Compare the two messages" className="mx-auto mb-6 flex w-fit rounded-full bg-white/70 p-1 shadow-sm backdrop-blur @2xl:hidden">
          {[
            { label: 'Today', value: false },
            { label: 'After signing', value: true },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={signed === o.value}
              onClick={() => pick(o.value)}
              className={`rounded-full px-4 py-2 font-display text-[15px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                signed === o.value ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="flex items-start justify-center gap-10 @2xl:gap-14">
          <div className={`w-full max-w-[300px] ${signed ? '@max-2xl:hidden' : ''}`}>
            <p className="mb-3.5 hidden text-center font-display text-[15px] font-semibold text-slate-700 @2xl:block">Today</p>
            <div role="group" aria-label="macOS message today" className={`${dialog} ${shadow}`}>
              <AppIcon badge="warning" />
              <h4 className="text-[14.5px] font-semibold leading-snug text-[#1d1d1f]">“Blockerflow” Not Opened</h4>
              <p className="mt-2 text-[12.5px] leading-[1.4] text-[#515154]">
                Apple could not verify “Blockerflow” is free of malware that may harm your Mac or compromise your privacy.
              </p>
              <FakeButton primary>Done</FakeButton>
              <FakeButton>Move to Bin</FakeButton>
            </div>
          </div>

          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-40 hidden shrink-0 text-primary @2xl:block">
            <path d="M4 12h15m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className={`w-full max-w-[300px] ${signed ? '' : '@max-2xl:hidden'}`}>
            <p className="mb-3.5 hidden text-center font-display text-[15px] font-semibold text-slate-700 @2xl:block">After signing</p>
            <div
              role="group"
              aria-label="macOS message after signing"
              className={`${dialog} shadow-[0_0_0_2px_#34d399,0_0_0_8px_rgba(52,211,153,.25),0_22px_60px_rgba(30,27,75,.35)]`}
            >
              <AppIcon badge="ok" />
              <h4 className="text-[14.5px] font-semibold leading-snug text-[#1d1d1f]">
                “Blockerflow” is an app downloaded from the Internet. Are you sure you want to open it?
              </h4>
              <p className="mt-2 text-[12.5px] leading-[1.4] text-[#515154]">Apple checked it for malicious software and none was detected.</p>
              <FakeButton primary>Open</FakeButton>
              <FakeButton>Cancel</FakeButton>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-ink-muted">
        Illustration of the two macOS messages. <span className="@2xl:hidden">Use the switch to compare them.</span>
      </figcaption>
    </figure>
  )
}
