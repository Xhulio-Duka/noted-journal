export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=document.cookie.match(/(?:^|; )theme=(dark|light)/)?.[1];var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.classList.toggle('light',!d)}catch(e){}})()`,
      }}
    />
  )
}
