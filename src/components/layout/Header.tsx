export function Header() {
  return (
    <header className="w-full pt-12 pb-8 text-center">
      <div className="flex items-center justify-center gap-4 mb-3">
        <img src="/logo-icon.svg" alt="贩厘" className="w-12 h-12" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          贩厘的工具百宝箱
        </h1>
      </div>
      <p className="text-sm md:text-base text-white/65">
        发现和收藏优秀的AI工具与常用网站
      </p>
    </header>
  );
}
