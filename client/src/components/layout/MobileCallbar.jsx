// Sticky Call/Book bar shown only on phones — present in the original
// design intent but never actually built in the WordPress/Elementor attempt.
export default function MobileCallbar() {
  return (
    <div className="lg:hidden fixed left-0 right-0 bottom-0 z-[90] flex gap-[10px] bg-white border-t border-line px-[14px] py-[10px] shadow-[0_-6px_24px_rgba(10,42,51,0.1)]">
      <a href="tel:+260760737805" className="btn btn--coral flex-1 !py-[15px] !px-[10px] text-[0.86rem]">
        Call 24/7
      </a>
      <a href="/book" className="btn btn--primary flex-1 !py-[15px] !px-[10px] text-[0.86rem]">
        Book Now
      </a>
    </div>
  );
}
