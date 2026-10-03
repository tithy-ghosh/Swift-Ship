import Link from 'next/link'
import { MdArrowForward, MdRoute } from 'react-icons/md'

/**
 * Sticky bottom action bar.
 *
 * The point is that booking and tracking stay one thumb-tap away, not only at
 * the top of a scroll that runs eight sections long.
 *
 * Lives in `SiteShell` rather than in the homepage tree, because it is page
 * chrome in the same sense the navbar is: it is `fixed`, it is not part of the
 * document flow, and it has to know the route. `SiteShell` renders it only on
 * `/` and only below `lg`, which also keeps it off `/send-parcel` and `/track`
 * where a `fixed` bar would sit on top of a form or a timeline. A `fixed`
 * element ignores `position: absolute` ancestors but does respect
 * `display: none`, which is what does the hiding here.
 *
 * This is the one mobile affordance that never had a desktop equivalent, which
 * is why it survived the removal of the mobile section tree. Below `lg` the
 * hero has both CTAs, but they are only reachable from the top of the page.
 *
 * `pb-[calc(0.75rem+env(safe-area-inset-bottom))]`: on iOS the home indicator
 * overlays the bottom of the viewport. Without the `env()` term the bar's
 * buttons end up underneath it and the primary CTA is partially untappable.
 *
 * The page reserves matching bottom space, and so does the footer - see
 * `SiteShell`. Both are needed, because the bar is `fixed` relative to the
 * viewport, not to either one of them.
 */
const MobileActionBar = () => {
  return (
    <div className="action-bar-rise fixed inset-x-0 bottom-0 z-30 border-t border-brand-border-subtle bg-white/95 backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-md items-center gap-2.5 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        <Link
          href="/track"
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-brand-content/15 px-4 py-3.5 text-sm font-semibold text-brand-content-strong transition active:scale-95"
        >
          <MdRoute className="size-[18px]" />
          Track
        </Link>

        <Link
          href="/send-parcel"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-surface-inverse px-4 py-3.5 text-sm font-bold text-white transition active:scale-95"
        >
          Book a Delivery
          <MdArrowForward className="size-[18px]" />
        </Link>
      </div>
    </div>
  )
}

export default MobileActionBar
