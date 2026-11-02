import Script from 'next/script'

const themeBoot = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(dark|light)/);var t=m&&m[1];var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.classList.toggle('light',!d)}catch(e){}})();`

export function ThemeScript() {
  return (
    <Script id="theme-boot" strategy="beforeInteractive">
      {themeBoot}
    </Script>
  )
}
