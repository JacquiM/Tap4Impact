import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import impactImage from "@assets/WhatsApp Image 2025-09-15 at 21.01.33_a1649a4f_1757962936453.jpg";

// Country data with ISO codes
const countries = [
  { code: "ZA", name: "South Africa", currency: "ZAR" },
  { code: "US", name: "United States", currency: "USD" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "DE", name: "Germany", currency: "EUR" },
  { code: "FR", name: "France", currency: "EUR" },
  { code: "IT", name: "Italy", currency: "EUR" },
  { code: "ES", name: "Spain", currency: "EUR" },
  { code: "NL", name: "Netherlands", currency: "EUR" },
  { code: "BE", name: "Belgium", currency: "EUR" },
  { code: "AT", name: "Austria", currency: "EUR" },
  { code: "IE", name: "Ireland", currency: "EUR" },
  { code: "PT", name: "Portugal", currency: "EUR" },
  { code: "FI", name: "Finland", currency: "EUR" },
  { code: "GR", name: "Greece", currency: "EUR" },
  { code: "LU", name: "Luxembourg", currency: "EUR" },
  { code: "JP", name: "Japan", currency: "JPY" },
  { code: "CH", name: "Switzerland", currency: "CHF" },
  { code: "SE", name: "Sweden", currency: "SEK" },
  { code: "NO", name: "Norway", currency: "NOK" },
  { code: "DK", name: "Denmark", currency: "DKK" },
  { code: "CN", name: "China", currency: "CNY" },
  { code: "IN", name: "India", currency: "INR" },
  { code: "BR", name: "Brazil", currency: "BRL" },
  { code: "MX", name: "Mexico", currency: "MXN" },
  { code: "AR", name: "Argentina", currency: "ARS" },
  { code: "SG", name: "Singapore", currency: "SGD" },
  { code: "HK", name: "Hong Kong", currency: "HKD" },
  { code: "KR", name: "South Korea", currency: "KRW" },
  { code: "NZ", name: "New Zealand", currency: "NZD" },
  { code: "IL", name: "Israel", currency: "ILS" },
  { code: "AE", name: "United Arab Emirates", currency: "AED" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR" },
  { code: "EG", name: "Egypt", currency: "EGP" },
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "KE", name: "Kenya", currency: "KES" },
  { code: "GH", name: "Ghana", currency: "GHS" },
  { code: "MA", name: "Morocco", currency: "MAD" },
  { code: "TN", name: "Tunisia", currency: "TND" },
  { code: "DZ", name: "Algeria", currency: "DZD" },
  { code: "ZM", name: "Zambia", currency: "ZMW" },
  { code: "BW", name: "Botswana", currency: "BWP" },
  { code: "NA", name: "Namibia", currency: "NAD" },
  { code: "ZW", name: "Zimbabwe", currency: "USD" },
  { code: "MW", name: "Malawi", currency: "MWK" },
  { code: "MZ", name: "Mozambique", currency: "MZN" },
  { code: "SZ", name: "Eswatini", currency: "SZL" },
  { code: "LS", name: "Lesotho", currency: "LSL" },
  { code: "RU", name: "Russia", currency: "RUB" },
  { code: "PL", name: "Poland", currency: "PLN" },
  { code: "CZ", name: "Czech Republic", currency: "CZK" },
  { code: "HU", name: "Hungary", currency: "HUF" },
  { code: "RO", name: "Romania", currency: "RON" },
  { code: "BG", name: "Bulgaria", currency: "BGN" },
  { code: "HR", name: "Croatia", currency: "EUR" },
  { code: "SI", name: "Slovenia", currency: "EUR" },
  { code: "SK", name: "Slovakia", currency: "EUR" },
  { code: "EE", name: "Estonia", currency: "EUR" },
  { code: "LV", name: "Latvia", currency: "EUR" },
  { code: "LT", name: "Lithuania", currency: "EUR" },
  { code: "TR", name: "Turkey", currency: "TRY" },
  { code: "TH", name: "Thailand", currency: "THB" },
  { code: "MY", name: "Malaysia", currency: "MYR" },
  { code: "ID", name: "Indonesia", currency: "IDR" },
  { code: "PH", name: "Philippines", currency: "PHP" },
  { code: "VN", name: "Vietnam", currency: "VND" },
].sort((a, b) => a.name.localeCompare(b.name));

// Currency data with symbols and formatting
const currencies = {
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
  CAD: { symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  AUD: { symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  ZAR: { symbol: "R", name: "South African Rand", locale: "en-ZA" },
  JPY: { symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  CHF: { symbol: "Fr", name: "Swiss Franc", locale: "de-CH" },
  CNY: { symbol: "¥", name: "Chinese Yuan", locale: "zh-CN" },
  INR: { symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  BRL: { symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
  MXN: { symbol: "$", name: "Mexican Peso", locale: "es-MX" },
  ARS: { symbol: "$", name: "Argentine Peso", locale: "es-AR" },
  SGD: { symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar", locale: "en-HK" },
  KRW: { symbol: "₩", name: "South Korean Won", locale: "ko-KR" },
  NZD: { symbol: "NZ$", name: "New Zealand Dollar", locale: "en-NZ" },
  SEK: { symbol: "kr", name: "Swedish Krona", locale: "sv-SE" },
  NOK: { symbol: "kr", name: "Norwegian Krone", locale: "nb-NO" },
  DKK: { symbol: "kr", name: "Danish Krone", locale: "da-DK" },
  ILS: { symbol: "₪", name: "Israeli Shekel", locale: "he-IL" },
  AED: { symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE" },
  SAR: { symbol: "﷼", name: "Saudi Riyal", locale: "ar-SA" },
  EGP: { symbol: "£", name: "Egyptian Pound", locale: "ar-EG" },
  NGN: { symbol: "₦", name: "Nigerian Naira", locale: "en-NG" },
  KES: { symbol: "Sh", name: "Kenyan Shilling", locale: "en-KE" },
  GHS: { symbol: "₵", name: "Ghanaian Cedi", locale: "en-GH" },
  MAD: { symbol: "د.م.", name: "Moroccan Dirham", locale: "ar-MA" },
  TND: { symbol: "د.ت", name: "Tunisian Dinar", locale: "ar-TN" },
  DZD: { symbol: "د.ج", name: "Algerian Dinar", locale: "ar-DZ" },
  ZMW: { symbol: "K", name: "Zambian Kwacha", locale: "en-ZM" },
  BWP: { symbol: "P", name: "Botswana Pula", locale: "en-BW" },
  NAD: { symbol: "N$", name: "Namibian Dollar", locale: "en-NA" },
  MWK: { symbol: "MK", name: "Malawian Kwacha", locale: "en-MW" },
  MZN: { symbol: "MT", name: "Mozambican Metical", locale: "pt-MZ" },
  SZL: { symbol: "L", name: "Swazi Lilangeni", locale: "en-SZ" },
  LSL: { symbol: "L", name: "Lesotho Loti", locale: "en-LS" },
  RUB: { symbol: "₽", name: "Russian Ruble", locale: "ru-RU" },
  PLN: { symbol: "zł", name: "Polish Zloty", locale: "pl-PL" },
  CZK: { symbol: "Kč", name: "Czech Koruna", locale: "cs-CZ" },
  HUF: { symbol: "Ft", name: "Hungarian Forint", locale: "hu-HU" },
  RON: { symbol: "lei", name: "Romanian Leu", locale: "ro-RO" },
  BGN: { symbol: "лв", name: "Bulgarian Lev", locale: "bg-BG" },
  TRY: { symbol: "₺", name: "Turkish Lira", locale: "tr-TR" },
  THB: { symbol: "฿", name: "Thai Baht", locale: "th-TH" },
  MYR: { symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY" },
  IDR: { symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID" },
  PHP: { symbol: "₱", name: "Philippine Peso", locale: "en-PH" },
  VND: { symbol: "₫", name: "Vietnamese Dong", locale: "vi-VN" },
};

interface DonationAmount {
  value: number;
  label: string;
  impact: string;
}

export default function DonationSection() {
  const [donationType, setDonationType] = useState<"monthly" | "once">("monthly");
  const [selectedAmount, setSelectedAmount] = useState<number>(315);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [country, setCountry] = useState("ZA");
  const [currency, setCurrency] = useState("ZAR");
  const [coverFees, setCoverFees] = useState(false);

  const getCurrencySymbol = () => {
    const currencyInfo = currencies[currency as keyof typeof currencies];
    return currencyInfo?.symbol || 'R';
  };

  const getPresetAmounts = (): DonationAmount[] => {
    const currencyInfo = currencies[currency as keyof typeof currencies];
    const symbol = currencyInfo?.symbol || 'R';
    const baseAmounts = {
      USD: [25, 50, 100],
      EUR: [25, 45, 85],
      GBP: [20, 40, 75],
      CAD: [35, 65, 125],
      AUD: [40, 70, 140],
      ZAR: [175, 315, 470],
      JPY: [3000, 5500, 10500],
      CHF: [25, 45, 85],
      CNY: [180, 320, 650],
      INR: [2000, 3500, 7000]
    };
    
    const amounts = baseAmounts[currency as keyof typeof baseAmounts] || baseAmounts.USD;
    const impacts = [
      "Helps fund fuel for rural patrols each month",
      "Supports SMS alerting for three farm blocks monthly", 
      "Contributes to a thermal camera for livestock protection"
    ];
    
    return amounts.map((amount, index) => ({
      value: amount,
      label: `${symbol}${amount}`,
      impact: impacts[index]
    }));
  };
  
  const presetAmounts = getPresetAmounts();

  const getCurrentAmount = () => {
    if (selectedAmount === 0 && customAmount) {
      return parseFloat(customAmount) || 0;
    }
    return selectedAmount;
  };

  const getProcessingFee = () => {
    const amount = getCurrentAmount();
    return Math.round(amount * 0.02 * 100) / 100;
  };

  const getTotalAmount = () => {
    const amount = getCurrentAmount();
    return coverFees ? amount + getProcessingFee() : amount;
  };

  const getCurrentImpact = () => {
    const amount = getCurrentAmount();
    const preset = presetAmounts.find(p => p.value === amount);
    return preset?.impact || "Supports agricultural safety initiatives across South Africa";
  };

  const formatCurrency = (amount: number) => {
    const currencyInfo = currencies[currency as keyof typeof currencies];
    if (!currencyInfo) {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2
      }).format(amount);
    }
    
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' || currency === 'KRW' || currency === 'VND' ? 0 : 2
    }).format(amount);
  };
  
  const handleCountryChange = (countryCode: string) => {
    setCountry(countryCode);
    const selectedCountry = countries.find(c => c.code === countryCode);
    if (selectedCountry) {
      setCurrency(selectedCountry.currency);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const handleDonate = () => {
    console.log('Donation submitted:', {
      type: donationType,
      amount: getCurrentAmount(),
      coverFees,
      total: getTotalAmount()
    });
    // Note: Payment processing not implemented - design only
  };

  return (
    <section id="donation-section" className="py-16 bg-background" data-testid="section-donation">
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-donation-title">
              Support Agricultural Safety
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-donation-subtitle">
              Help protect South African farming communities through innovative security solutions
            </p>
          </div>

          {/* Donation Form */}
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-3 gap-0">
              {/* Left Column - Donation Form */}
              <div className="lg:col-span-2 p-8">
                {/* Donation Type Toggle */}
                <div className="flex gap-0 mb-8 rounded-md overflow-hidden border border-border">
                  <Button
                    variant={donationType === "monthly" ? "default" : "ghost"}
                    className={`flex-1 rounded-none py-4 text-sm font-semibold uppercase tracking-wide ${
                      donationType === "monthly" 
                        ? "bg-primary hover:bg-primary/90 text-white" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => setDonationType("monthly")}
                    data-testid="button-monthly"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Give Monthly
                  </Button>
                  <Button
                    variant={donationType === "once" ? "default" : "ghost"}
                    className={`flex-1 rounded-none py-4 text-sm font-semibold uppercase tracking-wide ${
                      donationType === "once" 
                        ? "bg-primary hover:bg-primary/90 text-white" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => setDonationType("once")}
                    data-testid="button-once"
                  >
                    Give Once
                  </Button>
                </div>

                {/* Donation Details Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-donation-header">
                    Your {donationType} donation
                  </h3>
                  <p className="text-muted-foreground" data-testid="text-supporter-message">
                    You are about to become a Tap4Impact {donationType} supporter
                  </p>
                </div>

                {/* Country and Currency */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Country
                    </label>
                    <Select value={country} onValueChange={handleCountryChange}>
                      <SelectTrigger data-testid="select-country">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-y-auto">
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Currency
                    </label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger data-testid="select-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-y-auto">
                        {Object.entries(currencies).map(([code, info]) => (
                          <SelectItem key={code} value={code}>
                            {info.symbol} - {code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Donation Amount */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-foreground mb-4" data-testid="text-amount-header">
                    Make a <strong>{donationType}</strong> donation of
                  </h4>
                  
                  {/* Preset Amounts */}
                  <div className="flex gap-3 mb-4">
                    {presetAmounts.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={selectedAmount === preset.value ? "default" : "outline"}
                        className={`px-6 py-3 text-lg font-semibold ${
                          selectedAmount === preset.value 
                            ? "bg-primary hover:bg-primary/90" 
                            : ""
                        }`}
                        onClick={() => handleAmountSelect(preset.value)}
                        data-testid={`button-amount-${preset.value}`}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted rounded-md px-3 py-2 text-lg font-semibold">
                      {getCurrencySymbol()}
                    </div>
                    <Input
                      type="number"
                      placeholder="Other"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="text-lg py-3"
                      data-testid="input-custom-amount"
                    />
                  </div>
                </div>

                {/* Processing Fee */}
                <div className="bg-muted/50 p-4 rounded-md mb-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="cover-fees"
                      checked={coverFees}
                      onCheckedChange={(checked) => setCoverFees(checked as boolean)}
                      data-testid="checkbox-cover-fees"
                    />
                    <label htmlFor="cover-fees" className="text-sm text-muted-foreground leading-relaxed">
                      By adding 2% ({formatCurrency(getProcessingFee())}) to your donation, you could help cover processing fees so 
                      that your donation goes further for rural safety initiatives.
                    </label>
                  </div>
                </div>

                {/* Donate Button */}
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg font-semibold uppercase tracking-wide"
                  onClick={handleDonate}
                  data-testid="button-donate-submit"
                >
                  Donate {donationType === "monthly" ? "Monthly" : "Now"} • {formatCurrency(getTotalAmount())}
                </Button>
              </div>

              {/* Right Column - Impact Panel */}
              <div className="relative bg-muted/30">
                <div className="relative h-64 lg:h-full">
                  <img 
                    src={impactImage} 
                    alt="Agricultural safety impact" 
                    className="w-full h-full object-cover object-center"
                    data-testid="img-impact"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-primary text-white p-4 rounded-md">
                      <p className="text-sm font-medium" data-testid="text-impact-message">
                        {getCurrentImpact()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}