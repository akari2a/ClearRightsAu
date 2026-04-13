import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getUiCopy } from "../../i18n/copy";
import type { AppLocale } from "../../i18n/config";

type Step = "type-picker" | "input-form" | "analysing" | "result";
type ScamType = "text" | "email" | "phone" | "website";
type Verdict = "suspicious" | "no-indicators";

type ScamRecogniserDialogProps = {
  locale: AppLocale;
  isOpen: boolean;
  initialType?: string;
  onClose: () => void;
  onNavigateToGuide: (howHappened: string) => void;
};

const SCAM_INDICATORS = [
  "urgent", "verify", "account", "suspended", "click here",
  "prize", "winner", "expire", "immediately", "confirm",
  "password", "bank", "transfer", "ato", "tax refund",
  "locked", "unusual activity", "security alert", "login",
  "update your", "limited time", "act now", "compromised",
  "unauthorized", "unauthorised", "payment", "overdue"
];

const SUSPICIOUS_TLDS = [".xyz", ".top", ".buzz", ".click", ".tk", ".ml", ".ga"];

function analyse(fields: Record<string, string>, type: ScamType): Verdict {
  const combined = Object.values(fields).join(" ").toLowerCase();
  let hits = SCAM_INDICATORS.filter((kw) => combined.includes(kw)).length;

  if (type === "website") {
    const url = fields["website.url"] ?? "";
    const lower = url.toLowerCase();
    // Flag bare IP addresses
    if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower)) {
      hits += 2;
    }
    // Flag suspicious TLDs
    if (SUSPICIOUS_TLDS.some((tld) => lower.includes(tld))) {
      hits += 2;
    }
    // Flag excessive subdomain depth (>=4 dots in hostname)
    try {
      const hostname = new URL(url).hostname;
      if (hostname.split(".").length >= 5) {
        hits += 2;
      }
    } catch { /* invalid URL handled by validation */ }
  }

  return hits >= 2 ? "suspicious" : "no-indicators";
}

function getTypeConfig(locale: AppLocale): Record<ScamType, { label: string; icon: string; fields: { key: string; label: string; type: "input" | "textarea"; placeholder: string }[] }> {
  const copy = getUiCopy(locale).scamRecogniser;

  return {
    text: {
      label: copy.types.text,
      icon: "message",
      fields: [
        { key: "text.sender", label: copy.fields.textSender, type: "input", placeholder: copy.fields.textSenderPlaceholder },
        { key: "text.content", label: copy.fields.textContent, type: "textarea", placeholder: copy.fields.textContentPlaceholder }
      ]
    },
    email: {
      label: copy.types.email,
      icon: "mail",
      fields: [
        { key: "email.sender", label: copy.fields.emailSender, type: "input", placeholder: copy.fields.emailSenderPlaceholder },
        { key: "email.content", label: copy.fields.emailContent, type: "textarea", placeholder: copy.fields.emailContentPlaceholder }
      ]
    },
    phone: {
      label: copy.types.phone,
      icon: "phone",
      fields: [
        { key: "phone.number", label: copy.fields.phoneNumber, type: "input", placeholder: copy.fields.phoneNumberPlaceholder },
        { key: "phone.description", label: copy.fields.phoneDescription, type: "textarea", placeholder: copy.fields.phoneDescriptionPlaceholder }
      ]
    },
    website: {
      label: copy.types.website,
      icon: "globe",
      fields: [
        { key: "website.url", label: copy.fields.websiteUrl, type: "input", placeholder: copy.fields.websiteUrlPlaceholder }
      ]
    }
  };
}

function TypeIcon({ type }: { type: string }) {
  if (type === "message") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  if (type === "mail") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  if (type === "phone") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const MAX_CHARS = 2000;

const VALID_SCAM_TYPES: readonly string[] = ["text", "email", "phone", "website"];

export function ScamRecogniserDialog({ locale, isOpen, initialType, onClose, onNavigateToGuide }: ScamRecogniserDialogProps) {
  const uiCopy = getUiCopy(locale).scamRecogniser;
  const TYPE_CONFIG = useMemo(() => getTypeConfig(locale), [locale]);
  const [step, setStep] = useState<Step>("type-picker");
  const [selectedType, setSelectedType] = useState<ScamType | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const analysisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const hardReset = useCallback(() => {
    setStep("type-picker");
    setSelectedType(null);
    setFormData({});
    setVerdict(null);
    setValidationErrors({});
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    hardReset();
    onClose();
  }, [hardReset, onClose]);

  // Pre-select type when opened with initialType
  useEffect(() => {
    if (!isOpen) return;
    if (initialType && VALID_SCAM_TYPES.includes(initialType)) {
      setSelectedType(initialType as ScamType);
      setStep("input-form");
    }
  }, [isOpen, initialType]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  // Focus trap on open
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const first = dialogRef.current.querySelector<HTMLElement>("button, input, textarea, [tabindex]");
      first?.focus();
    }
  }, [isOpen, step]);

  const handleTypeSelect = (type: ScamType) => {
    setSelectedType(type);
    setStep("input-form");
    setValidationErrors({});
  };

  const handleBack = () => {
    setStep("type-picker");
    setValidationErrors({});
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedType) return;

    const config = TYPE_CONFIG[selectedType];
    const errors: Record<string, string> = {};

    for (const field of config.fields) {
      const value = (formData[field.key] ?? "").trim();
      if (!value) {
        errors[field.key] = uiCopy.required;
      } else if (field.type === "textarea" && value.length > MAX_CHARS) {
        errors[field.key] = uiCopy.tooLong(MAX_CHARS);
      } else if (field.key === "website.url") {
        try {
          const parsed = new URL(value);
          if (!parsed.protocol.startsWith("http")) {
            errors[field.key] = uiCopy.invalidUrl;
          }
        } catch {
          errors[field.key] = uiCopy.invalidUrl;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Focus first error field
      const firstErrorKey = config.fields.find((f) => errors[f.key])?.key;
      if (firstErrorKey) {
        const el = document.querySelector<HTMLElement>(`[data-field-key="${firstErrorKey}"]`);
        el?.focus();
      }
      return;
    }

    setStep("analysing");
    analysisTimerRef.current = setTimeout(() => {
      const typeFields: Record<string, string> = {};
      for (const field of config.fields) {
        typeFields[field.key] = formData[field.key] ?? "";
      }
      setVerdict(analyse(typeFields, selectedType));
      setStep("result");
      analysisTimerRef.current = null;
    }, 1500);
  };

  const handleCheckAnother = () => {
    hardReset();
  };

  const handleGetHelp = () => {
    if (selectedType) {
      onNavigateToGuide(selectedType);
    }
    handleClose();
  };

  const handleSocialMediaLink = () => {
    onNavigateToGuide("social");
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="scam-recogniser-backdrop" onClick={handleClose}>
      <div
        ref={dialogRef}
        className="scam-recogniser-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scam-recogniser-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="scam-recogniser-close" type="button" onClick={handleClose} aria-label={uiCopy.close}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Step: Type Picker */}
        {step === "type-picker" ? (
          <div className="scam-recogniser-step">
            <div className="scam-recogniser-header">
              <div className="scam-recogniser-header__icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 id="scam-recogniser-title" className="scam-recogniser-title">{uiCopy.title}</h2>
              <p className="scam-recogniser-subtitle">{uiCopy.pickType}</p>
            </div>

            <div className="scam-recogniser-grid">
              {(Object.keys(TYPE_CONFIG) as ScamType[]).map((type) => (
                <button
                  key={type}
                  className="scam-recogniser-type-card"
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                >
                  <span className="scam-recogniser-type-card__icon">
                    <TypeIcon type={TYPE_CONFIG[type].icon} />
                  </span>
                  <span className="scam-recogniser-type-card__label">{TYPE_CONFIG[type].label}</span>
                </button>
              ))}
            </div>

            <p className="scam-recogniser-social-link">
              {uiCopy.socialLead}{" "}
              <button type="button" className="scam-recogniser-text-link" onClick={handleSocialMediaLink}>
                {uiCopy.socialAction}
              </button>
            </p>
          </div>
        ) : null}

        {/* Step: Input Form */}
        {step === "input-form" && selectedType ? (
          <div className="scam-recogniser-step">
            <button className="scam-recogniser-back" type="button" onClick={handleBack}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>{uiCopy.back}</span>
            </button>

            <div className="scam-recogniser-header">
              <h2 id="scam-recogniser-title" className="scam-recogniser-title">{TYPE_CONFIG[selectedType].label}</h2>
              <p className="scam-recogniser-subtitle">{uiCopy.provideDetails}</p>
            </div>

            <div className="scam-recogniser-form">
              {TYPE_CONFIG[selectedType].fields.map((field) => {
                const value = formData[field.key] ?? "";
                const error = validationErrors[field.key];
                const charCount = field.type === "textarea" ? value.length : 0;

                return (
                  <div key={field.key} className="scam-recogniser-field">
                    <label className="scam-recogniser-label" htmlFor={field.key}>{field.label}</label>
                    {field.type === "textarea" ? (
                      <>
                        <textarea
                          id={field.key}
                          data-field-key={field.key}
                          className={`scam-recogniser-textarea${error ? " scam-recogniser-textarea--error" : ""}`}
                          placeholder={field.placeholder}
                          value={value}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        />
                        <span className={`scam-recogniser-char-count${charCount > MAX_CHARS ? " scam-recogniser-char-count--over" : ""}`}>
                          {charCount}/{MAX_CHARS.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <input
                        id={field.key}
                        data-field-key={field.key}
                        className={`scam-recogniser-input${error ? " scam-recogniser-input--error" : ""}`}
                        type="text"
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      />
                    )}
                    {error ? <p className="scam-recogniser-field-error">{error}</p> : null}
                  </div>
                );
              })}
            </div>

            <button className="scam-recogniser-analyse-btn" type="button" onClick={handleSubmit}>
              {uiCopy.analyse}
            </button>
          </div>
        ) : null}

        {/* Step: Analysing */}
        {step === "analysing" ? (
          <div className="scam-recogniser-step scam-recogniser-step--center">
            <div className="scam-recogniser-analysing">
              <div className="scam-recogniser-analysing__icon" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="scam-recogniser-analysing__text">{uiCopy.analysing}</p>
            </div>
          </div>
        ) : null}

        {/* Step: Result */}
        {step === "result" && verdict ? (
          <div className="scam-recogniser-step">
            <div className={`scam-recogniser-result ${verdict === "suspicious" ? "scam-recogniser-result--suspicious" : "scam-recogniser-result--clear"}`}>
              <div className="scam-recogniser-result__icon" aria-hidden="true">
                {verdict === "suspicious" ? (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ) : (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                )}
              </div>

              <h2 className="scam-recogniser-result__heading">
                {verdict === "suspicious" ? uiCopy.suspiciousHeading : uiCopy.clearHeading}
              </h2>

              <p className="scam-recogniser-result__body">
                {verdict === "suspicious"
                  ? uiCopy.suspiciousBody
                  : uiCopy.clearBody}
              </p>

              <div className="scam-recogniser-result__actions">
                {verdict === "suspicious" ? (
                  <>
                    <button className="scam-recogniser-btn--primary" type="button" onClick={handleGetHelp}>
                      {uiCopy.getHelp}
                    </button>
                    <button className="scam-recogniser-btn--secondary" type="button" onClick={handleCheckAnother}>
                      {uiCopy.checkAnother}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="scam-recogniser-btn--primary" type="button" onClick={handleCheckAnother}>
                      {uiCopy.checkAnother}
                    </button>
                    <button type="button" className="scam-recogniser-text-link" onClick={handleGetHelp}>
                      {uiCopy.stillNotSure}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
