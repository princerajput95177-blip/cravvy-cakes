import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  QrCode,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Server,
  Cloud,
  Layers,
  ArrowUpRight,
  Check,
  Zap,
  Info,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import QRCode from 'qrcode';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'apk' | 'pwa' | 'share' | 'domain';
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'apk',
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'apk' | 'pwa' | 'share' | 'domain'>(initialTab);
  const [customDomain, setCustomDomain] = useState('cravvycakes.in');

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-c6plbw2lip7zulw67q4pni-67795857064.asia-southeast1.run.app';

  const cleanDomain = customDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim() || 'cravvycakes.in';
  const customAppUrl = `https://${cleanDomain}`;
  const customDeleteUrl = `https://${cleanDomain}/?view=delete-account`;
  const customPrivacyUrl = `https://${cleanDomain}/?view=privacy`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    if (isOpen && appUrl) {
      QRCode.toDataURL(appUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#3B2118',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🎂 *Cravvy Cakes Bakery App*\n\nOrder 100% Pure Veg & Eggless cakes, bento boxes, cheesecakes & get custom designer cakes!\n\n👉 Open or Install App: ${appUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const pwabuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(
    appUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF4EE] dark:bg-[#201511] rounded-3xl shadow-2xl border border-[#E8DCC4] dark:border-[#3D251D] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#8B2F3C] via-[#661D27] to-[#3B2118] text-white p-5 md:p-6 flex items-start justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-36 h-36 bg-[#C9A227]/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#C9A227]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-serif">
                  Android App & APK Export
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A227] text-[#3B2118]">
                  v1.0 Ready
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Cravvy Cakes Bakery App ko phone mein chalayein ya share karein
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DCC4] dark:border-[#3D251D] bg-[#F2E8DC] dark:bg-[#281A15] p-1.5 gap-1 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition ${
              activeTab === 'apk'
                ? 'bg-white dark:bg-[#3B2118] text-[#8B2F3C] dark:text-[#C9A227] shadow-sm'
                : 'text-[#6E4F42] dark:text-[#D1BEB0] hover:text-[#3B2118]'
            }`}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="truncate">1. APK Export</span>
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition ${
              activeTab === 'pwa'
                ? 'bg-white dark:bg-[#3B2118] text-[#8B2F3C] dark:text-[#C9A227] shadow-sm'
                : 'text-[#6E4F42] dark:text-[#D1BEB0] hover:text-[#3B2118]'
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Install App</span>
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition ${
              activeTab === 'share'
                ? 'bg-white dark:bg-[#3B2118] text-[#8B2F3C] dark:text-[#C9A227] shadow-sm'
                : 'text-[#6E4F42] dark:text-[#D1BEB0] hover:text-[#3B2118]'
            }`}
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span className="truncate">3. Share</span>
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition ${
              activeTab === 'domain'
                ? 'bg-white dark:bg-[#3B2118] text-[#8B2F3C] dark:text-[#C9A227] shadow-sm'
                : 'text-[#6E4F42] dark:text-[#D1BEB0] hover:text-[#3B2118]'
            }`}
          >
            <Globe className="w-4 h-4 text-[#C9A227] shrink-0" />
            <span className="truncate font-bold">4. Domain & Publish</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: DOWNLOAD APK */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div className="text-xs text-[#523A30] dark:text-[#E6D7CC]">
                  <p className="font-semibold text-sm text-[#3B2118] dark:text-white mb-1">
                    APK File Kaise Banayein (1-Click Process):
                  </p>
                  Aapki app **PWA-ready** ho chuki hai (Manifest, Icons, aur Service Worker ready hain). Microsoft ke official tool **PWABuilder** se 2 minute me direct Android APK file ban jati hai jise aap WhatsApp par bhej sakte hain.
                </div>
              </div>

              {/* App Icon Card */}
              <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] flex flex-col sm:flex-row items-center gap-4">
                <img
                  src="/cravvy-icon.png"
                  alt="Cravvy Cakes Icon"
                  className="w-20 h-20 rounded-2xl border-2 border-[#E8DCC4] shadow-md object-cover shrink-0"
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h5 className="font-bold text-sm text-[#3B2118] dark:text-white">
                      Official App Icon (512x512)
                    </h5>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      PNG
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E4F42] dark:text-[#D1BEB0] mt-0.5">
                    Cravvy Cakes Royal Crown Icon for PWABuilder / Play Store
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <a
                      href="/cravvy-icon.png"
                      download="cravvy-cakes-icon.png"
                      className="px-3 py-1.5 rounded-lg bg-[#8B2F3C] text-white text-xs font-semibold hover:bg-[#661D27] transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Icon PNG</span>
                    </a>
                    <button
                      onClick={() => {
                        const iconFullUrl = `${appUrl}/cravvy-icon.png`;
                        navigator.clipboard.writeText(iconFullUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#E8DCC4] dark:border-[#3D251D] text-xs font-semibold text-[#3B2118] dark:text-[#FAF4EE] hover:bg-[#FAF4EE] dark:hover:bg-[#3B2118] transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>Copy Icon Link</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 1-Click Copy App URL Bar */}
              <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border-2 border-[#8B2F3C]/20 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B2F3C] dark:text-[#C9A227] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Step 1: App Link Copy Karein</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    Ready to Paste
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 bg-[#FAF4EE] dark:bg-[#201511] border border-[#E8DCC4] dark:border-[#3D251D] rounded-xl px-3 py-2 text-xs text-[#3B2118] dark:text-[#FAF4EE] font-mono truncate select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-[#8B2F3C] text-white text-xs font-bold hover:bg-[#661D27] transition flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#C9A227]" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step 2: Choose APK Generator Websites */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E4F42] dark:text-[#D1BEB0] pl-1">
                  Step 2: Kisi Bhi Website Par Click Karke Direct APK Banayein:
                </h4>

                {/* Option A: AppsGeyser (Instant & Most Popular) */}
                <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] hover:border-[#8B2F3C] transition shadow-sm space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                        AG
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-[#3B2118] dark:text-white">
                            AppsGeyser (Sabse Fast & Free)
                          </h5>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            ⭐ Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6E4F42] dark:text-[#D1BEB0]">
                          1-Minute me bina kisi wait ke direct Android .apk file download hoti hai.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#8C6D60] dark:text-[#B0988A] bg-[#FAF4EE] dark:bg-[#201511] p-2.5 rounded-xl border border-[#E8DCC4]/50 dark:border-[#3D251D]/50 space-y-1">
                    <p>1. Neeche button dabakar website kholein.</p>
                    <p>2. <strong>"Website URL"</strong> mein upar copy kiya gaya link paste karein.</p>
                    <p>3. App Name mein <strong>"Cravvy Cakes"</strong> likhein aur <strong>Download APK</strong> dabayein!</p>
                  </div>

                  <a
                    href="https://appsgeyser.com/create-url-app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition"
                  >
                    <span>Open AppsGeyser & Create APK</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                </div>

                {/* Option B: Median.co (GoNative) */}
                <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] hover:border-[#8B2F3C] transition shadow-sm space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                        M
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-[#3B2118] dark:text-white">
                            Median.co (Professional APK)
                          </h5>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                            High Quality
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6E4F42] dark:text-[#D1BEB0]">
                          Clean interface, official Android app package builder.
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://median.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow transition"
                  >
                    <span>Open Median.co</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                </div>

                {/* Option C: WebToApp.design */}
                <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] hover:border-[#8B2F3C] transition shadow-sm space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                        W
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-[#3B2118] dark:text-white">
                          WebToApp.design
                        </h5>
                        <p className="text-[11px] text-[#6E4F42] dark:text-[#D1BEB0]">
                          Automatic icon detection ke sath easy Android app builder.
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://webtoapp.design/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow transition"
                  >
                    <span>Open WebToApp.design</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                </div>

                {/* Option D: PWABuilder (Microsoft) */}
                <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] hover:border-[#8B2F3C] transition shadow-sm space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#8B2F3C] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                        PWA
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-[#3B2118] dark:text-white">
                          PWABuilder (Microsoft)
                        </h5>
                        <p className="text-[11px] text-[#6E4F42] dark:text-[#D1BEB0]">
                          Microsoft ka official PWA to Android Store package builder.
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={pwabuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#8B2F3C] hover:bg-[#661D27] text-white text-xs font-bold shadow transition"
                  >
                    <span>Open PWABuilder</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                </div>

                {/* Play Store Requirement: Account Deletion URL */}
                <div className="bg-rose-50/70 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-300 dark:border-rose-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      Play Store Required: Account Deletion URL
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100">
                      Policy Compliant
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E4F42] dark:text-[#D1BEB0]">
                    Google Play Console me <strong>Data Safety &gt; Account Deletion URL</strong> mangne par yeh URL enter karein:
                  </p>
                  <div className="p-2 rounded-xl bg-white dark:bg-[#201511] border border-rose-200 dark:border-rose-900 font-mono text-[11px] text-rose-900 dark:text-rose-200 break-all select-all flex items-center justify-between gap-2">
                    <span>{appUrl}?view=delete-account</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${appUrl}?view=delete-account`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-1 px-2 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-[10px] font-bold shrink-0 hover:bg-rose-200"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTANT INSTALL (NO APK NEEDED) */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-[#523A30] dark:text-[#E6D7CC]">
                  <p className="font-semibold text-sm text-emerald-800 dark:text-emerald-300 mb-1">
                    Bina APK Download Kiye Direct Install (Sabse Aasan):
                  </p>
                  Customer ko APK file bhejne par Android phone "Harmful File / Unknown Source" ki warning deta hai. Lekin agar aap link bhejenge, toh customer 1 click me bina kisi warning ke **Original App** install kar sakta hai!
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] space-y-3">
                <h4 className="text-sm font-bold text-[#3B2118] dark:text-white">
                  📱 Android Phone Me Kaise Install Karein:
                </h4>
                <ol className="text-xs text-[#6E4F42] dark:text-[#D1BEB0] space-y-2 list-decimal list-inside pl-1">
                  <li>Apne phone ke **Chrome Browser** mein yeh link open karein.</li>
                  <li>Chrome ke top-right me **3 dots (⋮)** par click karein.</li>
                  <li>Wahan **"Install App"** ya **"Add to Home screen"** par click karein.</li>
                  <li>Aapke phone ke home screen par **Cravvy Cakes** ka app icon ban jayega!</li>
                </ol>
              </div>

              <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] space-y-3">
                <h4 className="text-sm font-bold text-[#3B2118] dark:text-white">
                  🍏 iPhone / iPad Me Kaise Install Karein:
                </h4>
                <ol className="text-xs text-[#6E4F42] dark:text-[#D1BEB0] space-y-2 list-decimal list-inside pl-1">
                  <li>**Safari Browser** mein yeh link kholein.</li>
                  <li>Neeche **Share button (square with arrow)** par tap karein.</li>
                  <li>Neeche scroll karke **"Add to Home Screen"** select karein.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: WHATSAPP SHARE */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#2A1C17] p-5 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] text-center space-y-3">
                <h4 className="text-base font-bold text-[#3B2118] dark:text-white">
                  Customers Ko WhatsApp Par Bhejein
                </h4>
                <p className="text-xs text-[#6E4F42] dark:text-[#D1BEB0]">
                  Single click me WhatsApp par order link aur app link send karein:
                </p>

                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition transform hover:scale-[1.02]"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Send on WhatsApp</span>
                </button>
              </div>

              {qrCodeUrl && (
                <div className="bg-white dark:bg-[#2A1C17] p-5 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] text-center space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227]">
                    <QrCode className="w-4 h-4" />
                    <span>Scan QR Code to Open on Phone</span>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={qrCodeUrl}
                      alt="App QR Code"
                      className="w-44 h-44 rounded-2xl border-4 border-[#FAF4EE] shadow-md"
                    />
                  </div>
                  <p className="text-[11px] text-[#8C6D60] dark:text-[#B0988A]">
                    Kisi bhi mobile camera se scan karein aur app turant open ho jayegi!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOMAIN & PLAY STORE PUBLISHING */}
          {activeTab === 'domain' && (
            <div className="space-y-4">
              {/* Core Concept Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#8B2F3C]/10 via-[#C9A227]/15 to-emerald-500/10 border border-[#C9A227]/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div className="text-xs text-[#523A30] dark:text-[#E6D7CC]">
                  <p className="font-bold text-sm text-[#3B2118] dark:text-white mb-1">
                    Live Auto-Sync: Bina Play Store Update Ke Automatic Changes!
                  </p>
                  Jab aap app ko apne custom domain se connect karte hain aur PWABuilder se Play Store par publish karte hain, toh Android aur iOS app seedha aapke domain se live data uthati hain.
                  <strong> Yaha koi bhi cake, price ya design badalenge toh Play Store app me turant bina new version dale live change ho jayega!</strong>
                </div>
              </div>

              {/* Custom Domain Interactive Configurator */}
              <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B2F3C] dark:text-[#C9A227] flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span>Apna Custom Domain Yahan Dalein:</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Live URL Generator
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 bg-[#FAF4EE] dark:bg-[#201511] border border-[#E8DCC4] dark:border-[#3D251D] rounded-xl text-xs text-[#8C6D60] dark:text-[#B0988A] font-mono shrink-0">
                    https://
                  </span>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="cravvycakes.in ya cravvycakes.com"
                    className="flex-1 bg-[#FAF4EE] dark:bg-[#201511] border border-[#E8DCC4] dark:border-[#3D251D] rounded-xl px-3 py-2 text-xs text-[#3B2118] dark:text-white font-mono focus:outline-none focus:border-[#8B2F3C]"
                  />
                </div>
                <p className="text-[11px] text-[#8C6D60] dark:text-[#B0988A]">
                  Agar aapne GoDaddy, Hostinger ya Namecheap se domain khareeda hai toh yahan enter karein. Neeche ke saare links aur DNS settings auto-update ho jayenge!
                </p>
              </div>

              {/* Step 1: DNS Records to Add in GoDaddy / Hostinger */}
              <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B2118] dark:text-white flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-[#C9A227]" />
                    <span>Step 1: Domain DNS Records (GoDaddy / Hostinger me add karein)</span>
                  </h4>
                </div>

                <p className="text-[11px] text-[#6E4F42] dark:text-[#D1BEB0]">
                  Apne Domain Provider (GoDaddy, Hostinger, Namecheap) ke <strong>DNS Management</strong> me jakar yeh 2 records add karein:
                </p>

                <div className="space-y-2">
                  {/* Record A */}
                  <div className="p-3 bg-[#FAF4EE] dark:bg-[#201511] rounded-xl border border-[#E8DCC4] dark:border-[#3D251D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 font-mono text-[10px] font-bold rounded">
                          Type: A
                        </span>
                        <span className="font-semibold text-[#3B2118] dark:text-white">
                          Host / Name: <code className="font-mono text-[#8B2F3C]">@</code>
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#6E4F42] dark:text-[#D1BEB0]">
                        Value: <strong>76.76.21.21</strong> (Vercel Global Anycast IP)
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard('76.76.21.21', 'dns-a')}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#3B2118] border border-[#E8DCC4] dark:border-[#3D251D] text-xs font-bold text-[#3B2118] dark:text-white hover:bg-[#FAF4EE] flex items-center justify-center gap-1 shrink-0"
                    >
                      {copiedKey === 'dns-a' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#C9A227]" />}
                      <span>{copiedKey === 'dns-a' ? 'Copied!' : 'Copy IP'}</span>
                    </button>
                  </div>

                  {/* Record CNAME */}
                  <div className="p-3 bg-[#FAF4EE] dark:bg-[#201511] rounded-xl border border-[#E8DCC4] dark:border-[#3D251D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 font-mono text-[10px] font-bold rounded">
                          Type: CNAME
                        </span>
                        <span className="font-semibold text-[#3B2118] dark:text-white">
                          Host / Name: <code className="font-mono text-[#8B2F3C]">www</code>
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#6E4F42] dark:text-[#D1BEB0]">
                        Value: <strong>cname.vercel-dns.com</strong>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard('cname.vercel-dns.com', 'dns-cname')}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#3B2118] border border-[#E8DCC4] dark:border-[#3D251D] text-xs font-bold text-[#3B2118] dark:text-white hover:bg-[#FAF4EE] flex items-center justify-center gap-1 shrink-0"
                    >
                      {copiedKey === 'dns-cname' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#C9A227]" />}
                      <span>{copiedKey === 'dns-cname' ? 'Copied!' : 'Copy Value'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-[#8C6D60] dark:text-[#B0988A] bg-[#FAF4EE] dark:bg-[#201511] p-2.5 rounded-xl border border-[#E8DCC4]/50 dark:border-[#3D251D]/50 space-y-1">
                  <p className="font-semibold text-[#3B2118] dark:text-[#FAF4EE]">Hosting Kaise Karein (100% Free):</p>
                  <p>1. Is project ko GitHub par push karein.</p>
                  <p>2. Vercel.com ya Netlify.com par Free account banakar GitHub repo select karein.</p>
                  <p>3. Settings &gt; Domains me jakar <strong>{cleanDomain}</strong> add karein. SSL Certificate (HTTPS) 2 minute me automatically lag jata hai!</p>
                </div>
              </div>

              {/* Step 2: Google Play Console Required URLs */}
              <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border-2 border-[#8B2F3C]/20 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B2F3C] dark:text-[#C9A227] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Step 2: Play Store Mandatory URLs (Copy-Paste Ready)</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Compliant
                  </span>
                </div>

                <p className="text-[11px] text-[#6E4F42] dark:text-[#D1BEB0]">
                  Google Play Console me App submission ke dauran yeh do links maangta hai:
                </p>

                <div className="space-y-2">
                  {/* Account Deletion URL */}
                  <div className="p-2.5 bg-[#FAF4EE] dark:bg-[#201511] rounded-xl border border-[#E8DCC4] dark:border-[#3D251D] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300">
                        1. Account Deletion URL (Google Play Policy Required):
                      </span>
                      <button
                        onClick={() => copyToClipboard(customDeleteUrl, 'del-url')}
                        className="px-2 py-1 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-[10px] font-bold hover:bg-rose-200 flex items-center gap-1"
                      >
                        {copiedKey === 'del-url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'del-url' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-[#523A30] dark:text-[#E6D7CC] select-all break-all">
                      {customDeleteUrl}
                    </div>
                  </div>

                  {/* Privacy Policy URL */}
                  <div className="p-2.5 bg-[#FAF4EE] dark:bg-[#201511] rounded-xl border border-[#E8DCC4] dark:border-[#3D251D] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300">
                        2. Privacy Policy URL:
                      </span>
                      <button
                        onClick={() => copyToClipboard(customPrivacyUrl, 'privacy-url')}
                        className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] font-bold hover:bg-blue-200 flex items-center gap-1"
                      >
                        {copiedKey === 'privacy-url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'privacy-url' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-[#523A30] dark:text-[#E6D7CC] select-all break-all">
                      {customPrivacyUrl}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Google Play Store Publishing Walkthrough */}
              <div className="bg-white dark:bg-[#2A1C17] p-4 rounded-2xl border border-[#E8DCC4] dark:border-[#3D251D] shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B2118] dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#8B2F3C]" />
                  <span>Step 3: Play Store Pe App Kaise Dalen (Final 5 Steps)</span>
                </h4>

                <div className="space-y-2 text-xs text-[#523A30] dark:text-[#E6D7CC]">
                  <div className="p-2.5 rounded-xl bg-[#FAF4EE] dark:bg-[#201511] border border-[#E8DCC4]/50 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong>Google Play Console Account</strong> banayein (play.google.com/console) — $25 one-time registration fee hoti hai jo lifetime valid rehti hai.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF4EE] dark:bg-[#201511] border border-[#E8DCC4]/50 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong>PWABuilder par .aab File Generate Karein:</strong>{' '}
                      <a
                        href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(customAppUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8B2F3C] dark:text-[#C9A227] underline font-bold inline-flex items-center gap-1"
                      >
                        Open PWABuilder with Domain <ExternalLink className="w-3 h-3" />
                      </a>
                      <br />
                      Wahan <strong>"Package for Store &gt; Android"</strong> click karein aur signed <code>.aab</code> file download karein.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF4EE] dark:bg-[#201511] border border-[#E8DCC4]/50 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong>Store Listing Bharein:</strong>
                      <ul className="list-disc list-inside mt-1 text-[11px] text-[#6E4F42] dark:text-[#D1BEB0] space-y-0.5">
                        <li>App Title: <strong>Cravvy Cakes - 100% Pure Veg Bakery</strong></li>
                        <li>Icon: Tab 1 se 512x512 Icon PNG download karke upload karein</li>
                        <li>Feature Graphic: 1024x500 banner upload karein</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF4EE] dark:bg-[#201511] border border-[#E8DCC4]/50 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <strong>Data Safety & Deletion Form:</strong> Upar copy kiya gaya <code>{customDeleteUrl}</code> paste karein.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF4EE] dark:bg-[#201511] border border-[#E8DCC4]/50 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      5
                    </span>
                    <div>
                      <strong>Production Release:</strong> Apni <code>.aab</code> file upload karein aur <strong>"Send for Review"</strong> button dabayein! Google 24-48 hours mein app live kar dega.
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct PWABuilder Action Button */}
              <a
                href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(customAppUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B2F3C] to-[#661D27] hover:from-[#732531] hover:to-[#52161f] text-white text-xs font-bold shadow-md transition"
              >
                <span>Launch PWABuilder for {cleanDomain}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DCC4] dark:border-[#3D251D] bg-[#F2E8DC] dark:bg-[#241712] flex items-center justify-between">
          <div className="text-[11px] text-[#8C6D60] dark:text-[#B0988A]">
            Cravvy Cakes • 100% Pure Veg Bakery
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#3B2118] text-white text-xs font-semibold hover:bg-[#523A30] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
