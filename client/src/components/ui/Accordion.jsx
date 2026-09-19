import { useState, useRef, useLayoutEffect } from 'react';

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <AccordionItem
          key={item.q}
          question={item.q}
          answer={item.a}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  );
}

function AccordionItem({ question, answer, isOpen, onToggle }) {
  const panelRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    setHeight(isOpen ? panelRef.current?.scrollHeight ?? 0 : 0);
  }, [isOpen, answer]);

  return (
    <div className="border-b border-line">
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex items-center justify-between gap-s3 w-full py-s3 text-left font-sans text-[1.05rem] font-bold text-ink hover:text-cyan-700"
        >
          {question}
          <span
            className={`relative flex-none w-[34px] h-[34px] rounded-none transition-colors duration-200 ${
              isOpen ? 'bg-cyan' : 'bg-sand-deep'
            }`}
          >
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[13px] h-0.5 rounded ${
                isOpen ? 'bg-white' : 'bg-cyan-700'
              }`}
            />
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-[13px] rounded transition-opacity duration-200 ${
                isOpen ? 'opacity-0' : 'bg-cyan-700 opacity-100'
              }`}
            />
          </span>
        </button>
      </h3>
      <div
        ref={panelRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div className="pb-s3 max-w-[780px] text-muted leading-[1.7]" dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  );
}
