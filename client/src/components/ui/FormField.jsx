const fieldBase =
  'w-full font-sans text-[0.98rem] text-ink px-[17px] py-[15px] bg-sand border-[1.5px] border-transparent rounded-xl transition-colors focus:outline-none focus:bg-white focus:border-cyan';

export function TextField({ label, name, register, error, full, ...props }) {
  return (
    <div className={full ? 'col-span-2 max-[640px]:col-span-1' : ''}>
      <label htmlFor={name} className="block text-[0.85rem] font-bold text-ink mb-[7px]">
        {label} {props.required && <span className="text-coral-600">*</span>}
      </label>
      <input
        id={name}
        className={`${fieldBase} ${error ? 'border-coral-600 bg-[#FFF6F5]' : ''}`}
        {...register(name)}
        {...props}
      />
      {error && <p className="text-[0.82rem] font-semibold text-coral-600 mt-[6px]">{error.message}</p>}
    </div>
  );
}

export function SelectField({ label, name, register, error, options, full, ...props }) {
  return (
    <div className={full ? 'col-span-2 max-[640px]:col-span-1' : ''}>
      <label htmlFor={name} className="block text-[0.85rem] font-bold text-ink mb-[7px]">
        {label} {props.required && <span className="text-coral-600">*</span>}
      </label>
      <select id={name} className={`${fieldBase} cursor-pointer ${error ? 'border-coral-600 bg-[#FFF6F5]' : ''}`} {...register(name)} {...props}>
        <option value="">Please choose</option>
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      {error && <p className="text-[0.82rem] font-semibold text-coral-600 mt-[6px]">{error.message}</p>}
    </div>
  );
}

export function TextAreaField({ label, name, register, error, full = true, ...props }) {
  return (
    <div className={full ? 'col-span-2 max-[640px]:col-span-1' : ''}>
      <label htmlFor={name} className="block text-[0.85rem] font-bold text-ink mb-[7px]">
        {label} {props.required && <span className="text-coral-600">*</span>}
      </label>
      <textarea id={name} rows={5} className={`${fieldBase} resize-y min-h-[130px] ${error ? 'border-coral-600 bg-[#FFF6F5]' : ''}`} {...register(name)} {...props} />
      {error && <p className="text-[0.82rem] font-semibold text-coral-600 mt-[6px]">{error.message}</p>}
    </div>
  );
}

export function PillGroup({ label, name, register, options }) {
  return (
    <div className="col-span-2 max-[640px]:col-span-1">
      <span className="block text-[0.85rem] font-bold text-ink mb-[7px]">{label}</span>
      <div className="flex flex-wrap gap-[10px]">
        {options.map(([value, text]) => (
          <label key={value} className="relative cursor-pointer">
            <input type="radio" value={value} className="peer sr-only" {...register(name)} />
            <span className="block px-5 py-3 rounded-full bg-sand border-[1.5px] border-transparent text-[0.9rem] font-semibold text-ink peer-checked:bg-cyan peer-checked:text-white peer-checked:border-cyan hover:border-cyan transition-all">
              {text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function ConsentCheckbox({ name, register, error, children }) {
  return (
    <div className="col-span-2 max-[640px]:col-span-1">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={name}
          className="w-[21px] h-[21px] flex-none mt-0.5 accent-cyan cursor-pointer"
          {...register(name)}
        />
        <label htmlFor={name} className="text-[0.88rem] text-muted font-medium leading-[1.6]">
          {children}
        </label>
      </div>
      {error && <p className="text-[0.82rem] font-semibold text-coral-600 mt-[6px] ml-8">{error.message}</p>}
    </div>
  );
}
