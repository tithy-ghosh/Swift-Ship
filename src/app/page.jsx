import Hero from "@/app/components/homepage/hero";
import Homepage from "@/app/ui/Homepage";

/**
 * One tree, rearranged at `lg`.
 *
 * The page used to paint a mobile tree and a desktop tree side by side and
 * switch between them with `display`. That bought full control of the phone
 * layout at the cost of duplicating every section, and the copies drifted: the
 * mobile tree had quietly lost the speciality, brand and merchant sections, and
 * the hero existed in two versions whose content no longer matched. Every
 * future content change then had to be made twice, and twice is twice as likely
 * that one copy is stale.
 *
 * So there is one section tree now, and each section handles its own narrow
 * layout. Two things made that practical:
 *
 *  - The sections are already mostly single-column below `md`, so the phone
 *    layout is not a redesign but a set of gutters, type sizes and paddings.
 *    `NetworkMap` and `BeMarchent` were the two that actually needed work.
 *  - Anything that is genuinely a different DOM - the reviews and brand carousels
 *    - degrades from an auto-advancing marquee to a scroll-snap row below `sm`.
 *    The track is the same element either way, so this costs no duplicate markup.
 *
 * `Hero` is separate only because it is not one section among several. It is the
 * LCP element and it still rearranges itself at `lg`, so it stays outside
 * `Homepage` and above the section stack.
 *
 * The one thing that did not survive the merge is the phone's sticky
 * book/track bar, which had no desktop equivalent. It is `fixed` page chrome,
 * so it lives in `SiteShell` behind a route check rather than in this tree.
 */
const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-canvas">
      <Hero />
      <Homepage />
    </div>
  );
};

export default Home;
