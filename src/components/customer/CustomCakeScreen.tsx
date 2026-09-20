import React, { useState, useRef } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { CakeFlavour, CakeSize } from '../../types';
import {
  Cake,
  Upload,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  HelpCircle,
  X,
  Phone,
  User,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Check,
  Palette,
  Layers,
} from 'lucide-react';

interface CustomCakeScreenProps {
  onClose?: () => void;
}

export const CustomCakeScreen: React.FC<CustomCakeScreenProps> = ({ onClose }) => {
  const { user, selectedAddress, submitCustomCake, setCustomerTab, showToast } = useBakery();

  const [customerName, setCustomerName] = useState(user.name || '');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '');

  // 10 Steps state
  const [cakeType, setCakeType] = useState<
    'Fondant Theme' | 'Tiered Wedding' | 'Photo Cake' | 'Buttercream Floral' | 'Pinata Cake' | 'Drip Cake'
  >('Fondant Theme');

  const [flavour, setFlavour] = useState<CakeFlavour>('Belgian Chocolate');
  const [weightSize, setWeightSize] = useState<CakeSize>('2.0 kg');
  const [isEggless, setIsEggless] = useState(true);
  const [designTheme, setDesignTheme] = useState('Milestone Birthday & Metallic Gold');

  const [referenceImageUrl, setReferenceImageUrl] = useState(
    'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=700&q=80'
  );

  const [cakeMessage, setCakeMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [requiredDate, setRequiredDate] = useState('2026-08-20');
  const [timeSlot, setTimeSlot] = useState('6:00 PM - 8:00 PM');

  const [deliveryAddress, setDeliveryAddress] = useState(
    selectedAddress
      ? `${selectedAddress.houseFlat}, ${selectedAddress.street}, ${selectedAddress.area}, ${selectedAddress.city} - ${selectedAddress.pincode}`
      : 'House #42, Near Geeta Mandir, Model Town, Jalandhar, Punjab - 144003'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [lastRequestNum, setLastRequestNum] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reference presets
  const samplePresets = [
    {
      name: 'Princess Floral Castle',
      theme: 'Floral Romance & Fairy-tale',
      url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=700&q=80',
    },
    {
      name: 'Modern Gold Foil Marble',
      theme: 'Milestone Birthday & Metallic Gold',
      url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80',
    },
    {
      name: 'Gaming & Neon Theme',
      theme: 'Kids & Superhero / Gaming',
      url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80',
    },
    {
      name: 'Tiered Wedding Royale',
      theme: 'Grand Wedding & Pearls',
      url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=700&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImageUrl(reader.result as string);
        showToast('Reference image loaded for Custom Cake!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Estimated Price Guide
  const estimateBase = {
    'Fondant Theme': 1200,
    'Tiered Wedding': 1600,
    'Photo Cake': 750,
    'Buttercream Floral': 900,
    'Pinata Cake': 1100,
    'Drip Cake': 850,
  }[cakeType];

  let weightFactor = 2.0;
  if (weightSize === '1.0 kg') weightFactor = 1.0;
  else if (weightSize === '1.5 kg') weightFactor = 1.5;
  else if (weightSize === '2.0 kg') weightFactor = 2.0;
  else if (weightSize === '2.5 kg') weightFactor = 2.5;
  else if (weightSize.includes('3.0 kg')) weightFactor = 3.0;
  else if (weightSize.includes('5.0 kg')) weightFactor = 5.0;

  const estimatedPrice = Math.round(estimateBase * weightFactor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      showToast('Please provide your name and contact phone.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const req = submitCustomCake({
        customerName,
        customerPhone,
        cakeType,
        flavour,
        weightSize,
        isEggless,
        cakeMessage,
        referenceImageUrl,
        specialInstructions: `[Theme: ${designTheme}] ${specialInstructions}`.trim(),
        requiredDeliveryDate: requiredDate,
        deliveryTimeSlot: timeSlot,
        deliveryAddress,
      });

      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      setLastRequestNum(req.requestNumber);
    }, 600);
  };

  if (isSubmittedSuccess) {
    return (
      <div className="p-6 text-center max-w-md mx-auto my-auto py-14 space-y-4" id="custom-cake-success">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-[#2B1A15] dark:text-[#FAF4EE]">
          Custom Cake Request Sent!
        </h2>
        <p className="text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227]">
          Request Reference: {lastRequestNum}
        </p>
        <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1] leading-relaxed">
          Our Executive Pastry Chef will review your theme, confirm ingredients and piping detail, and calculate your custom price quote.
        </p>

        <div className="p-4 rounded-2xl bg-[#FFF8F0] dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#7A6A63]">Selected Architecture:</span>
            <span className="font-bold text-[#2B1A15] dark:text-[#FAF4EE]">{cakeType} ({weightSize})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A6A63]">Flavour:</span>
            <span className="font-bold text-[#2B1A15] dark:text-[#FAF4EE]">{flavour}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A6A63]">Theme:</span>
            <span className="font-bold text-[#2B1A15] dark:text-[#FAF4EE]">{designTheme}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A6A63]">Estimated Guide:</span>
            <span className="font-bold text-[#8B2F3C] dark:text-[#C9A227]">~₹{estimatedPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A6A63]">Required Date:</span>
            <span className="font-bold text-[#2B1A15] dark:text-[#FAF4EE]">{requiredDate} ({timeSlot})</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              setIsSubmittedSuccess(false);
              if (onClose) onClose();
              setCustomerTab('orders');
            }}
            className="w-full py-3 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-bold text-xs shadow-md border border-[#C9A227]/30 transition"
          >
            Track in My Quotes / Orders
          </button>

          <button
            onClick={() => {
              setIsSubmittedSuccess(false);
              if (onClose) onClose();
              setCustomerTab('home');
            }}
            className="w-full py-2.5 rounded-2xl bg-[#FFF8F0] dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] text-[#7A6A63] dark:text-[#FAF4EE] font-semibold text-xs transition"
          >
            Back to Fresh Bakery Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 pb-28" id="custom-cake-screen">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DACD] dark:border-[#46332B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#8B2F3C] text-white rounded-2xl shadow-md border border-[#C9A227]/40">
            <Cake className="w-6 h-6 text-[#C9A227]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2B1A15] dark:text-[#FAF4EE]">
              CRAVVY Custom Cake Studio
            </h1>
            <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1]">
              Handcrafted 10-step bespoke cake creator for your dream celebration
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FFF8F0] dark:hover:bg-[#30221D] text-[#7A6A63] transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: The 10 Steps */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1: Select Cake Type */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8B2F3C] text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <label className="text-xs font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
                STEP 1: Select Cake Architecture / Type
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Fondant Theme', desc: 'Sculpted 3D Figures' },
                { name: 'Tiered Wedding', desc: '2-3 Layer Majestic' },
                { name: 'Photo Cake', desc: 'Edible Sugar Sheet' },
                { name: 'Buttercream Floral', desc: 'Textured Petals' },
                { name: 'Pinata Cake', desc: 'Smash Shell with Hammer' },
                { name: 'Drip Cake', desc: 'Chocolate Ganache Drip' },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setCakeType(item.name as any)}
                  className={`p-3 rounded-2xl text-xs font-bold border text-left transition flex flex-col justify-between h-20 ${
                    cakeType === item.name
                      ? 'border-[#8B2F3C] bg-[#8B2F3C] text-white shadow-md'
                      : 'border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/60 dark:bg-[#261B16] text-[#3B2118] dark:text-[#E8DACD] hover:border-[#C9A227]'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className={`text-[10px] font-normal ${cakeType === item.name ? 'text-[#FAF4EE]/80' : 'text-[#7A6A63]'}`}>
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Select Flavour */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8B2F3C] text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <label className="text-xs font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
                STEP 2: Select Flavour
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'Belgian Chocolate',
                'Dutch Truffle',
                'Red Velvet Cream Cheese',
                'Nutella Hazelnut',
                'Butterscotch Crunch',
                'Fresh Mango Passion',
                'Blueberry Bliss',
                'Black Forest',
              ].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlavour(f as CakeFlavour)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition ${
                    flavour === f
                      ? 'border-[#8B2F3C] bg-[#8B2F3C] text-white font-bold shadow-xs'
                      : 'border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/60 dark:bg-[#261B16] text-[#3B2118] dark:text-[#E8DACD] hover:border-[#C9A227]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: Select Weight / Size */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#8B2F3C] text-white text-xs font-black flex items-center justify-center">
                  3
                </span>
                <label className="text-xs font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
                  STEP 3: Select Weight / Size
                </label>
              </div>
              <span className="text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227]">{weightSize}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { size: '1.0 kg', serves: '6-8' },
                { size: '1.5 kg', serves: '10-12' },
                { size: '2.0 kg', serves: '14-16' },
                { size: '2.5 kg', serves: '18-20' },
                { size: '3.0 kg (2-Tier)', serves: '22-26' },
                { size: '5.0 kg (3-Tier)', serves: '40+' },
              ].map((item) => (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => setWeightSize(item.size as CakeSize)}
                  className={`p-2 rounded-xl text-center border transition flex flex-col items-center justify-center ${
                    weightSize === item.size
                      ? 'border-[#8B2F3C] bg-[#8B2F3C] text-white font-bold shadow-xs'
                      : 'border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/60 dark:bg-[#261B16] text-[#3B2118] dark:text-[#E8DACD] hover:border-[#C9A227]'
                  }`}
                >
                  <span className="text-xs font-bold">{item.size}</span>
                  <span className="text-[9px] opacity-80">{item.serves} guests</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 4: Dietary Guarantee - 100% Pure Veg & Eggless */}
          <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                  4
                </span>
                <label className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                  STEP 4: Dietary Standard
                </label>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                100% Veg Certified
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-xs border-2 border-emerald-600 flex items-center justify-center bg-white flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                </span>
                <div>
                  <div className="text-xs font-black flex items-center gap-1.5">
                    <span>100% Pure Eggless Guaranteed</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Handcrafted in our strictly pure vegetarian, egg-free kitchen with rich milk solids and dairy butter.
                  </span>
                </div>
              </div>
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            </div>
          </div>

          {/* STEP 5: Select Design / Theme */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8B2F3C] text-white text-xs font-black flex items-center justify-center">
                5
              </span>
              <label className="text-xs font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
                STEP 5: Select Design / Celebration Theme
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Milestone Birthday & Metallic Gold',
                'Floral Romance & Fairy-tale',
                'Kids & Superhero / Gaming',
                'Grand Wedding & Pearls',
                'Corporate & Geometric Minimalist',
                'Smash Pinata & Surprise Treats',
              ].map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setDesignTheme(theme)}
                  className={`p-2.5 rounded-xl text-xs text-left font-medium border transition ${
                    designTheme === theme
                      ? 'border-[#8B2F3C] bg-[#8B2F3C] text-white font-bold shadow-xs'
                      : 'border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/60 dark:bg-[#261B16] text-[#3B2118] dark:text-[#E8DACD] hover:border-[#C9A227]'
                  }`}
                >
                  ✨ {theme}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 6: Upload Reference Image */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#8B2F3C] text-white text-xs font-black flex items-center justify-center">
                  6
                </span>
                <label className="text-xs font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
                  STEP 6: Upload Reference Image / Pick Inspiration
                </label>
              </div>
              <span className="text-[10px] text-[#7A6A63]">Photo / Pinterest link</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-40 h-32 rounded-2xl overflow-hidden bg-neutral-900 border-2 border-[#C9A227] shadow-md flex-shrink-0">
                <img
                  src={referenceImageUrl}
                  alt="Reference"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                  Active Reference
                </span>
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] text-[#8B2F3C] dark:text-[#C9A227] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#FDF2E4] transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload From Device / Camera</span>
                </button>

                <span className="text-[11px] text-[#7A6A63] block">
                  Or choose an inspiration sample:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {samplePresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setReferenceImageUrl(preset.url);
                        setDesignTheme(preset.theme);
                      }}
                      className="p-1.5 text-left rounded-lg bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD]/60 dark:border-[#46332B] text-[10px] text-[#3B2118] dark:text-[#E8DACD] truncate hover:border-[#C9A227] transition"
                    >
                      🌟 {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 7: Enter Cake Message */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8B2F3C] text-white text-xs font-black flex items-center justify-center">
                7
              </span>
              <label className="text-xs font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
                STEP 7: Enter Cake Message (Inscription Piping)
              </label>
            </div>

            <input
              type="text"
              maxLength={50}
              placeholder="e.g. Happy 25th Silver Jubilee Mom & Dad! ❤️"
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/40 dark:bg-[#261B16] text-xs text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none font-medium"
            />
            <div className="flex justify-between text-[10px] text-[#7A6A63] px-1">
              <span>Free personalized calligraphy on fondant plaque</span>
              <span>{cakeMessage.length}/50</span>
            </div>
          </div>

          {/* STEP 8: Special Instructions */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8B2F3C] text-white text-xs font-black flex items-center justify-center">
                8
              </span>
              <label className="text-xs font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
                STEP 8: Special Instructions & Fondant Detailing
              </label>
            </div>

            <textarea
              rows={2}
              placeholder="e.g. Please add 2 sugar figurines on top, gold sparkle dust, less sweetness in cream, delivery at banquet hall..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/40 dark:bg-[#261B16] text-xs text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
            />
          </div>

          {/* STEP 9 & STEP 10: Delivery Date & Time */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-3 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* STEP 9 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white text-[10px] font-black flex items-center justify-center">
                    9
                  </span>
                  <label className="text-xs font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
                    STEP 9: Delivery Date
                  </label>
                </div>
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/40 dark:bg-[#261B16] text-xs font-semibold text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                />
              </div>

              {/* STEP 10 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white text-[10px] font-black flex items-center justify-center">
                    10
                  </span>
                  <label className="text-xs font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
                    STEP 10: Delivery Time Slot
                  </label>
                </div>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/40 dark:bg-[#261B16] text-xs font-semibold text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                >
                  <option value="11:00 AM - 1:00 PM">Morning (11:00 AM - 1:00 PM)</option>
                  <option value="3:00 PM - 5:00 PM">Afternoon (3:00 PM - 5:00 PM)</option>
                  <option value="6:00 PM - 8:00 PM">Evening Celebration (6:00 PM - 8:00 PM)</option>
                  <option value="11:30 PM - 12:15 AM (Midnight)">Midnight Surprise (11:30 PM - 12:15 AM)</option>
                </select>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E8DACD] dark:border-[#46332B]">
              <div>
                <label className="text-[11px] font-bold text-[#7A6A63] dark:text-[#B8A8A1] block mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7A6A63] dark:text-[#B8A8A1] block mb-1">
                  Phone (WhatsApp for Quote)
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#7A6A63] dark:text-[#B8A8A1] block mb-1">
                Celebration Delivery Address
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Persistent Live Summary & Request Button */}
        <div className="space-y-4">
          <div className="sticky top-4 p-5 rounded-3xl bg-[#3B2118] text-white border border-[#C9A227]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C9A227]/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#FAF4EE]">
                  Live Custom Cake Summary
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#C9A227]/20 text-[#C9A227] font-bold border border-[#C9A227]/30">
                10 Steps Complete
              </span>
            </div>

            {/* Reference Thumbnail */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#C9A227]/60 bg-neutral-900 flex-shrink-0">
                <img
                  src={referenceImageUrl}
                  alt="Summary Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black truncate text-white">
                  {cakeType}
                </h4>
                <p className="text-[11px] text-[#C9A227] truncate font-semibold">
                  {flavour}
                </p>
                <span className="text-[10px] text-[#FAF4EE]/70 block">
                  {weightSize} • {isEggless ? 'Eggless' : 'Contains Egg'}
                </span>
              </div>
            </div>

            {/* Step breakdown */}
            <div className="space-y-1.5 text-xs text-[#FAF4EE]/90 bg-[#2B1A15] p-3 rounded-2xl border border-[#C9A227]/20">
              <div className="flex justify-between">
                <span className="text-[#FAF4EE]/60">Theme:</span>
                <span className="font-semibold text-right truncate max-w-[130px]">{designTheme}</span>
              </div>
              {cakeMessage && (
                <div className="flex justify-between">
                  <span className="text-[#FAF4EE]/60">Message:</span>
                  <span className="font-semibold text-[#C9A227] truncate max-w-[130px]">"{cakeMessage}"</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#FAF4EE]/60">Delivery Date:</span>
                <span className="font-semibold">{requiredDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FAF4EE]/60">Slot:</span>
                <span className="font-semibold">{timeSlot}</span>
              </div>
            </div>

            {/* Cost Estimate Guide */}
            <div className="pt-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#FAF4EE]/70">Estimated Guide:</span>
                <span className="text-2xl font-black text-[#C9A227]">
                  ~₹{estimatedPrice}
                </span>
              </div>
              <p className="text-[10px] text-[#FAF4EE]/60 mt-1 leading-snug">
                Chef will verify intricate handmade sculpting details and issue your official price quote.
              </p>
            </div>

            {/* REQUEST CUSTOM CAKE Action Button */}
            <button
              id="btn-request-custom-cake"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#8B2F3C]/40 border border-[#C9A227]/40 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C9A227]" />
              <span>{isSubmitting ? 'Sending to Chef...' : 'REQUEST CUSTOM CAKE'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
