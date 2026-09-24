import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useBakery } from '../../context/BakeryContext';
import {
  X,
  QrCode,
  Building2,
  Copy,
  Check,
  UploadCloud,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Smartphone,
  ArrowRight,
  Eye,
  Trash2,
} from 'lucide-react';

interface BankUpiPaymentModalProps {
  amount: number;
  customerName: string;
  orderNumber?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPayment: (paymentDetails: {
    utrTransactionId: string;
    paymentScreenshot?: string;
  }) => void;
  isSubmitting?: boolean;
}

export const BankUpiPaymentModal: React.FC<BankUpiPaymentModalProps> = ({
  amount,
  customerName,
  orderNumber,
  isOpen,
  onClose,
  onSubmitPayment,
  isSubmitting = false,
}) => {
  const { settings } = useBakery();
  const [activeTab, setActiveTab] = useState<'upi' | 'bank'>('upi');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form Fields
  const [utrTransactionId, setUtrTransactionId] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Dynamic UPI Info from Bakery Settings
  const UPI_ID = settings.upiId || 'q490463229@ybl';
  const PAYEE_NAME = 'CRAVVY CAKES';
  const MOBILE_NUMBER = settings.phone || '+91 96539 30001';

  // Dynamic Bank Account Info from Bakery Settings
  const BANK_NAME = settings.bankName || 'Kotak Mahindra Bank';
  const ACCOUNT_TYPE = 'Current / Business Account';
  const ACCOUNT_NUMBER = settings.bankAccountNumber || '4311966246';
  const IFSC_CODE = settings.bankIfsc || 'KKBK0004019';
  const BENEFICIARY_NAME = 'CRAVVY CAKES';
  const BRANCH_NAME = settings.address || 'Tanda Road, Jalandhar - 144004, Punjab';

  // Deep link for mobile UPI apps
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    PAYEE_NAME
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(
    orderNumber ? `Cravvy Cakes Order ${orderNumber}` : `Cravvy Cakes Order`
  )}`;

  // Generate crisp, scannable QR Code
  useEffect(() => {
    QRCode.toDataURL(
      upiDeepLink,
      {
        width: 480,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!err && url) {
          setQrCodeDataUrl(url);
        }
      }
    );
  }, [amount, upiDeepLink]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please upload an image file (PNG, JPG, or JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrTransactionId.trim()) {
      setFormError('Please enter the 12-digit UPI reference number or Bank UTR ID.');
      return;
    }

    if (utrTransactionId.trim().length < 6) {
      setFormError('UTR / Transaction ID should be at least 6 alphanumeric characters.');
      return;
    }

    setFormError(null);
    onSubmitPayment({
      utrTransactionId: utrTransactionId.trim(),
      paymentScreenshot: screenshotPreview || undefined,
    });
  };

  // Demo receipt presets for browser testing
  const sampleReceiptPresets = [
    {
      name: 'PhonePe Success',
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'GPay Receipt',
      url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      id="bank-upi-modal-overlay"
    >
      <div
        className="bg-white text-neutral-900 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8DACD] animate-scaleUp overflow-hidden my-auto"
        id="bank-upi-modal"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#8B2F3C] text-white flex items-center justify-between shadow-md border-b border-[#C9A227]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white border border-[#C9A227]/40">
              <QrCode className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">Pay via Bank / UPI</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#C9A227]/30 text-[#C9A227] border border-[#C9A227]/50 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure
                </span>
              </div>
              <p className="text-xs text-[#FAF4EE]/80 font-medium">
                Official Merchant Payment Portal • {settings.name || 'Bakery'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Amount Bar */}
        <div className="bg-[#FFF8F0] px-5 py-3 border-b border-[#E8DACD] flex items-center justify-between text-xs">
          <div>
            <span className="text-[#7A6A63] block font-medium">Order Total Payable:</span>
            <span className="text-xl font-black text-[#3B2118]">₹{amount.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="text-[#7A6A63] block font-medium">Customer:</span>
            <span className="font-bold text-[#2B1A15]">{customerName}</span>
          </div>
        </div>

        {/* Option Tabs */}
        <div className="grid grid-cols-2 p-2 bg-[#FFF8F0]/70 gap-1.5 border-b border-[#E8DACD]">
          <button
            type="button"
            onClick={() => setActiveTab('upi')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'upi'
                ? 'bg-white text-[#8B2F3C] shadow-sm border border-[#C9A227]'
                : 'text-[#7A6A63] hover:text-[#2B1A15] hover:bg-[#FFF8F0]'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#8B2F3C]" />
            <span>1. UPI QR SCANNER</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-white text-[#8B2F3C] shadow-sm border border-[#C9A227]'
                : 'text-[#7A6A63] hover:text-[#2B1A15] hover:bg-[#FFF8F0]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#8B2F3C]" />
            <span>2. BANK TRANSFER</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: UPI QR SCANNER */}
          {activeTab === 'upi' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-neutral-900">Scan & Pay</h3>
                <p className="text-neutral-600 font-medium text-xs">
                  Pay securely using any UPI app (Google Pay, PhonePe, Paytm, BHIM, Cred)
                </p>
              </div>

              {/* Official PhonePe / Merchant QR Card */}
              <div className="max-w-xs mx-auto bg-white rounded-3xl p-4 shadow-xl border-2 border-[#E8DACD] text-center space-y-3 relative overflow-hidden">
                {/* Purple PhonePe Banner */}
                <div className="flex flex-col items-center justify-center gap-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                      पे
                    </div>
                    <span className="text-[#5f259f] font-black text-lg tracking-tight">PhonePe</span>
                  </div>

                  {/* Merchant Pill */}
                  <div className="mt-1 px-4 py-1 rounded-full bg-[#8B2F3C] text-white font-black text-xs shadow-xs uppercase tracking-wide border border-[#C9A227]/40">
                    {PAYEE_NAME}
                  </div>
                </div>

                {/* QR Code */}
                <div className="p-2 bg-white rounded-2xl border border-[#E8DACD] inline-block shadow-inner">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt={`${settings.name || 'Bakery'} Payment QR Code`}
                      className="w-56 h-56 mx-auto object-contain"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-neutral-400">
                      Loading QR Code...
                    </div>
                  )}
                </div>

                {/* BHIM UPI Branding */}
                <div className="flex items-center justify-center gap-2 text-[11px] font-extrabold text-[#2B1A15] tracking-wider">
                  <span className="text-emerald-700 font-black">BHIM</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-[#8B2F3C] font-black">UPI</span>
                  <span className="text-[10px] text-neutral-400 font-normal">UNIFIED PAYMENTS INTERFACE</span>
                </div>

                {/* Amount Tag */}
                <div className="py-1.5 px-3 rounded-xl bg-[#FFF8F0] border border-[#E8DACD] text-[#3B2118] font-bold text-xs">
                  Paying Exact Total: <span className="font-black text-sm">₹{amount.toFixed(2)}</span>
                </div>
              </div>

              {/* UPI ID & Mobile Display */}
              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#E8DACD] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A6A63] block">UPI ID:</span>
                    <span className="font-black text-sm text-[#2B1A15] select-all">{UPI_ID}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(UPI_ID, 'upi')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                      copiedField === 'upi'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#8B2F3C] hover:bg-[#742531] text-white border border-[#C9A227]/30'
                    }`}
                  >
                    {copiedField === 'upi' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>UPI ID Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-[#E8DACD] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A6A63] block">Mobile:</span>
                    <span className="font-extrabold text-xs text-[#2B1A15]">{MOBILE_NUMBER}</span>
                  </div>
                  <a
                    href={upiDeepLink}
                    className="px-3 py-1.5 rounded-xl bg-[#3B2118] hover:bg-[#2B1A15] text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Open UPI App</span>
                  </a>
                </div>
              </div>

              {/* Supported Apps Chips */}
              <div className="space-y-1.5 text-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Supported UPI Apps:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'CRED', 'Amazon Pay'].map((app) => (
                    <span
                      key={app}
                      className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 font-bold text-[10px] border border-neutral-200"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BANK ACCOUNT TRANSFER */}
          {activeTab === 'bank' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-neutral-900">Bank Account Details</h3>
                <p className="text-neutral-600 font-medium text-xs">
                  Transfer directly via IMPS / NEFT / RTGS from any bank app
                </p>
              </div>

              {/* Premium Bank Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white shadow-xl border border-neutral-800 space-y-4 relative overflow-hidden">
                {/* Decorative Red Kotak Accent */}
                <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-rose-600/20 blur-xl pointer-events-none" />

                {/* Bank Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-sm shadow">
                      K
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white">{BANK_NAME}</h4>
                      <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">
                        {ACCOUNT_TYPE}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-semibold border border-neutral-700">
                    CBS Verified
                  </span>
                </div>

                {/* Account Details Rows */}
                <div className="space-y-3 text-xs">
                  {/* Beneficiary */}
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase">
                      Beneficiary Account Name:
                    </span>
                    <span className="text-sm font-black text-amber-400">{BENEFICIARY_NAME}</span>
                  </div>

                  {/* Account Number with Copy */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-800/80 border border-neutral-700">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 block uppercase">
                        Account Number:
                      </span>
                      <span className="text-base font-black tracking-wider text-white select-all">
                        {ACCOUNT_NUMBER}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ACCOUNT_NUMBER, 'acc')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                        copiedField === 'acc'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                    >
                      {copiedField === 'acc' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Account Number</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* IFSC Code with Copy */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-800/80 border border-neutral-700">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 block uppercase">
                        IFSC Code:
                      </span>
                      <span className="text-sm font-black tracking-wider text-white select-all">
                        {IFSC_CODE}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(IFSC_CODE, 'ifsc')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                        copiedField === 'ifsc'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                    >
                      {copiedField === 'ifsc' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy IFSC</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Branch */}
                  <div className="text-[11px] text-neutral-400">
                    <span className="font-bold text-neutral-300">Branch: </span>
                    {BRANCH_NAME}
                  </div>
                </div>
              </div>

              {/* Note banner */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="font-semibold">
                  After making the payment, please upload your payment screenshot below so our bakery team can verify and dispatch your order.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: PAYMENT CONFIRMATION (Screenshot & UTR ID) */}
          <div className="pt-4 border-t border-neutral-200 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>3. PAYMENT CONFIRMATION (सबूत अपलोड करें)</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Transaction / UTR ID */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Transaction / UTR ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 424883109241 or Bank Ref No."
                  value={utrTransactionId}
                  onChange={(e) => {
                    setUtrTransactionId(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 font-mono font-bold text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Find this 12-digit reference number in your UPI app receipt or bank transfer message.
                </span>
              </div>

              {/* Field 2: Payment Screenshot */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Payment Screenshot (स्क्रीनशॉट)
                </label>

                {screenshotPreview ? (
                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={screenshotPreview}
                        alt="Payment Receipt"
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                      />
                      <div className="truncate">
                        <span className="font-bold text-xs text-neutral-800 block truncate">
                          Receipt Uploaded
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ready to submit
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setScreenshotPreview(null)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Remove screenshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#C9A227] rounded-2xl bg-[#FFF8F0] hover:bg-[#FDF2E4] cursor-pointer transition text-center group">
                    <UploadCloud className="w-7 h-7 text-[#8B2F3C] mb-1 group-hover:scale-110 transition" />
                    <span className="font-bold text-xs text-[#2B1A15]">
                      Click to upload payment screenshot
                    </span>
                    <span className="text-[10px] text-[#7A6A63] mt-0.5">
                      Supports JPG, PNG, Screenshots from Google Pay / PhonePe / Paytm
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Demo quick receipt selector for quick testing */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#7A6A63]">Quick Test Screenshot:</span>
                  {sampleReceiptPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setScreenshotPreview(preset.url)}
                      className="text-[10px] font-semibold text-[#8B2F3C] bg-[#8B2F3C]/10 hover:bg-[#8B2F3C]/20 px-2 py-0.5 rounded-md transition"
                    >
                      +{preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Security Trust Note */}
              <div className="p-3 rounded-2xl bg-[#FFF8F0] border border-[#E8DACD] flex items-center gap-2 text-[#7A6A63] text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                <span>
                  Your payment will be verified by {settings.name || 'Bakery'} before the order is confirmed.
                </span>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-2xl bg-[#FFF8F0] hover:bg-[#FDF2E4] border border-[#E8DACD] text-[#7A6A63] font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] active:scale-98 text-white font-extrabold text-sm shadow-lg border border-[#C9A227]/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Details...</span>
                  ) : (
                    <>
                      <span>SUBMIT PAYMENT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
