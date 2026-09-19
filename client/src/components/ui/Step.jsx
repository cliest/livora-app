export default function Step({ n, title, body, dark = false }) {
  return (
    <div className="flex gap-s3">
      <span className="flex-none w-[42px] h-[42px] rounded-none bg-cyan text-white flex items-center justify-center font-extrabold">
        {n}
      </span>
      <div>
        <h4 className={`mb-[5px] font-bold text-[1.1rem] ${dark ? 'text-white' : 'text-ink'}`}>{title}</h4>
        <p className={`text-[0.94rem] ${dark ? 'text-haze-600' : 'text-muted'}`}>{body}</p>
      </div>
    </div>
  );
}
