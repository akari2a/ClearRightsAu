import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, OllamaStatus } from "../types/aibot";

const SYSTEM_PROMPT =
  "You are ClearRights AI, a helpful assistant for consumer rights in Australia. " +
  "You help users understand scams, refunds, product safety, and rental disputes. " +
  "You provide clear, practical guidance — not legal advice. " +
  "Always recommend consulting official sources (ACCC, ScamWatch, Fair Trading) for serious matters. " +
  "Keep responses concise and action-oriented.";

const MOCK_RESPONSES: Record<string, string> = {
  greeting: "Hello! I'm **ClearRights AI**, your consumer rights assistant for Australia. 👋\n\nI can help you with a range of consumer issues, including:\n\n- **Scam & fraud detection** — identifying suspicious messages, calls, or websites\n- **Refund & replacement rights** — understanding when you're entitled to your money back\n- **Product safety concerns** — what to do if a product seems dangerous\n- **Rental & bond disputes** — navigating landlord disagreements\n- **Warranty claims** — knowing what manufacturers owe you\n- **Online shopping issues** — delivery, returns, and dispute resolution\n\nJust describe your situation and I'll do my best to guide you. What's on your mind?",
  thanks: "You're welcome! I'm glad I could help. 😊\n\nIf anything else comes up — whether it's a new issue or a follow-up on what we discussed — feel free to ask anytime.\n\nRemember, for serious matters you can always reach out to:\n- **ACCC** (Australian Competition & Consumer Commission)\n- **Scamwatch** at scamwatch.gov.au\n- Your state's **Fair Trading** office\n\nTake care!",
  capabilities: "Great question! Here's what I can help you with:\n\n**🔍 Scam Detection**\nDescribe a suspicious message, call, or website and I'll help you assess whether it's a scam.\n\n**💰 Refunds & Returns**\nUnsure if you're entitled to a refund? Tell me what happened and I'll explain your rights.\n\n**⚠️ Product Safety**\nWorried about a product's safety? I'll guide you through the reporting and recall process.\n\n**🏠 Rental & Bond Disputes**\nDealing with a landlord issue? I can walk you through the dispute resolution process.\n\n**🛒 Online Shopping**\nProblems with delivery, wrong items, or online sellers? I know the rules.\n\n**📋 Warranty & Guarantees**\nI can explain what the Australian Consumer Law says about warranties.\n\nJust describe your situation in your own words — no legal jargon needed!",
  scam: "Based on what you've described, this sounds like a common phone or text scam. Here's what I'd recommend:\n\n1. **Do not respond** to the message or call back\n2. **Do not click** any links or provide personal information\n3. **Report it** to Scamwatch at scamwatch.gov.au\n4. **Block the number** on your phone\n5. **Tell someone you trust** — scams work best when victims feel isolated\n\nIf you've already shared any personal details, take these steps immediately:\n- Contact your **bank** to secure your accounts\n- Change your **passwords** on all important accounts\n- Enable **two-factor authentication** where possible\n- Consider placing a **credit ban** via Equifax, Experian, or illion\n\nCommon scam patterns in Australia include fake Australia Post delivery texts, ATO threats, and bank impersonation calls. For more detailed guidance, check our **Scam Check** tool.",
  refund: "Under Australian Consumer Law, you may have the right to a refund, repair, or replacement if:\n\n- The product is **faulty or defective**\n- It **doesn't match** the description or sample\n- It's **not fit for purpose**\n- It doesn't do what the seller said it would\n\n**Recommended next steps:**\n1. Gather your **receipt** and any evidence (photos, emails)\n2. Contact the seller **in writing** first — email is best for record-keeping\n3. Clearly state the issue and **what remedy you want** (refund, replacement, or repair)\n4. Give the seller a **reasonable timeframe** to respond (7–14 days)\n5. If the seller refuses, lodge a complaint with your state's **Fair Trading** office\n\n**Important to know:**\n- For **major failures**, you can choose a refund or replacement — the seller can't insist on repair only\n- For **minor failures**, the seller can choose the remedy\n- Change-of-mind returns are **not guaranteed** under the law, though many stores offer them as policy\n- Keep all **written communication** — it strengthens your case if you need to escalate",
  product: "Product safety is taken very seriously under Australian law. If you suspect a product is unsafe:\n\n1. **Stop using it** immediately\n2. **Keep the product** and packaging — don't throw it away\n3. **Check for recalls** at productsafety.gov.au\n4. **Report the issue** to the ACCC or your state's Fair Trading office\n5. **Contact the retailer** for a refund or replacement\n6. **Take photos** of any damage or safety issues\n\n**Signs a product may be unsafe:**\n- Unusual smells (burning, chemical)\n- Overheating or sparking\n- Physical defects or sharp edges\n- Missing safety labels or warnings\n- Unexpected behaviour during normal use\n\nIf someone has been **injured**, seek medical attention first, then:\n- Document the injury with photos\n- Keep the product exactly as it is\n- Report to the ACCC's Product Safety division\n\nAll of these concerns are valid and worth reporting — product safety reports help protect other consumers too.",
  bond: "Bond disputes are one of the most common tenancy issues. Here's what you should know:\n\n- Landlords can only deduct for **damage beyond fair wear and tear**\n- The **condition report** (start and end of tenancy) is key evidence\n- You have the right to **dispute any deduction** you believe is unfair\n- Normal wear (scuff marks, minor nail holes, faded paint) is generally **not deductible**\n\n**Steps to take:**\n1. Request a **detailed breakdown** of the deduction in writing\n2. Compare with your **move-in condition report**\n3. Gather **photos** from when you moved in and out\n4. Respond in writing with your objections, referencing the condition report\n5. If unresolved, apply to your state's **tenancy tribunal** (e.g., NCAT in NSW, VCAT in VIC)\n\n**Useful tips:**\n- Tribunal applications usually cost $20–$50 and are designed for self-representation\n- The **landlord must prove** damage, not you\n- Fair wear and tear increases with the **length of tenancy**\n- Keep all receipts for any cleaning or repairs you did\n\nMany disputes can be resolved through clear, evidence-based communication.",
  online_shopping: "Online shopping in Australia comes with strong consumer protections. Here's what you need to know:\n\n**Your rights when shopping online:**\n- Products must **match the description** on the website\n- Items must arrive within any **stated timeframe**, or within a reasonable time\n- You have the same **consumer guarantee rights** as in-store purchases\n- This applies to both Australian and **overseas sellers** operating in Australia\n\n**If your order didn't arrive:**\n1. Check the **tracking information** and estimated delivery date\n2. Contact the seller — they're responsible until you receive the item\n3. If it's significantly late, you may be entitled to a **refund**\n4. For credit card purchases, consider a **chargeback** if the seller is unresponsive\n\n**If the item is wrong or defective:**\n1. **Take photos** immediately upon opening\n2. Contact the seller with evidence\n3. You're entitled to a **refund, replacement, or repair**\n4. The seller must cover **return shipping** costs for faulty items\n\n**Buying from overseas?** Australian Consumer Law may not apply to overseas-only sellers, but your credit card provider may still offer **chargeback** protection.",
  warranty: "Under Australian Consumer Law (ACL), you have **automatic consumer guarantees** that exist alongside any manufacturer warranty:\n\n**Consumer Guarantees (your legal rights):**\n- Products must be of **acceptable quality**\n- They must be **fit for purpose**\n- They must **match the description**\n- These guarantees **cannot be excluded** by any warranty terms\n\n**Important distinctions:**\n- A manufacturer's warranty is **in addition to** your ACL rights\n- Even after a warranty expires, you may still have rights if the product **should have lasted longer**\n- The expected lifespan depends on the product type and price\n\n**If a product fails during warranty:**\n1. Contact the **manufacturer or retailer** — either can help\n2. Provide your **proof of purchase**\n3. For major failures: you choose **refund or replacement**\n4. For minor failures: the seller can choose to **repair** first\n\n**If a product fails after warranty:**\n- You may still have rights — a $2,000 fridge should last more than 2 years\n- Contact the retailer and reference **consumer guarantee** rights under ACL\n- If they refuse, escalate to your state's **Fair Trading** office",
  chargeback: "If you've been wrongly charged or a seller won't cooperate, here's how to handle it:\n\n**When to consider a chargeback:**\n- Product never arrived and seller is unresponsive\n- You were **charged incorrectly** (wrong amount, duplicate charge)\n- The product was **significantly different** from what was described\n- Seller refuses a legitimate **refund request**\n\n**Steps to dispute a transaction:**\n1. Try resolving with the **seller first** — banks require this\n2. Gather evidence: receipts, emails, screenshots\n3. Contact your **bank or card provider** to initiate the dispute\n4. Most banks allow disputes within **120 days** of the transaction\n5. The bank investigates and may issue a **provisional credit**\n\n**Important to know:**\n- Debit and credit cards have **different** dispute processes\n- PayPal, Afterpay, and similar services have their **own dispute systems** — use those first\n- Keep copies of **all correspondence** with the seller\n- Don't wait too long — there are **time limits** for disputes\n\nIf the charge is **unauthorised** (you didn't make it), report it to your bank immediately as potential **fraud**.",
  travel: "Travel and booking disputes can be stressful, but you do have rights. Here's a breakdown:\n\n**Flights within/to Australia:**\n- Airlines must provide what was **advertised** (route, class, inclusions)\n- If a flight is **cancelled by the airline**, you're typically entitled to a refund or rebooking\n- Significant delays may entitle you to **compensation** depending on the airline's conditions of carriage\n- **Lost baggage** — the airline is liable up to certain limits\n\n**Hotel and accommodation:**\n- The room must **match the listing** (photos, amenities, location description)\n- If it doesn't, document the differences and **request a remedy**\n- For platforms like Airbnb or Booking.com, use their **resolution centre** first\n\n**Tour operators and travel agents:**\n- Services must be delivered with **acceptable care and skill**\n- If a tour is significantly different from what was sold, you may claim a refund\n\n**Steps to take:**\n1. Document everything — **photos, emails, booking confirmations**\n2. Complain to the provider first in writing\n3. If unresolved, contact your **state Fair Trading** office\n4. For international disputes, your credit card's **chargeback** option may help",
  subscription: "Cancelling a subscription or membership? Here's what Australian Consumer Law says:\n\n**Your cancellation rights:**\n- You generally have the right to cancel, but terms depend on your **contract**\n- Unfair contract terms can be **voided** under ACL, even if you signed them\n- Auto-renewals must be **clearly disclosed** — hidden renewals can be challenged\n\n**Gym memberships specifically:**\n- Most states have **cooling-off periods** (often 7 days from signing)\n- After the minimum term, you can usually cancel with **written notice**\n- Medical exemptions may allow **early termination** — check your contract\n- The gym can't keep charging after you've properly cancelled\n\n**Steps to cancel:**\n1. Review your **contract terms** for the cancellation process\n2. Cancel **in writing** (email is fine) — don't just stop going\n3. Keep a copy of your **cancellation notice**\n4. Check your bank statements to confirm **charges have stopped**\n5. If they keep charging, dispute with your **bank** and report to Fair Trading\n\n**Tip:** If a business makes cancellation unreasonably difficult, this may constitute an **unfair business practice** under ACL.",
  car: "Buying a car — whether new or used — is protected under Australian Consumer Law. Here's what you need to know:\n\n**Your rights:**\n- The car must be of **acceptable quality** and fit for purpose\n- It must **match any description** the dealer provided\n- These rights apply to **dealers** (not private sales between individuals)\n- A statutory warranty applies to used cars from dealers in most states\n\n**Common issues and what to do:**\n\n*Undisclosed problems:*\n1. Get an **independent mechanic's report**\n2. Contact the dealer in writing with your findings\n3. For major failures, demand a **refund or replacement**\n\n*Odometer tampering:*\n- This is **illegal** — report to your state's Fair Trading and police\n- You may be entitled to a **full refund** plus compensation\n\n**Private sales:**\n- Fewer protections — the car must match the description but consumer guarantees are limited\n- Always get a **pre-purchase inspection**\n- Check the **PPSR** (Personal Property Securities Register) for outstanding finance\n\n**Dealer refusing to help?**\n- Escalate to your state's **Fair Trading** or motor vehicle ombudsman\n- In most states, tribunal claims for vehicles are straightforward",
  identity: "Identity theft is serious — here's what to do if your personal information has been compromised:\n\n**Immediate steps:**\n1. **Contact your bank** and any financial institutions — freeze accounts if needed\n2. **Change passwords** on all important accounts (email, banking, social media)\n3. Enable **two-factor authentication** everywhere possible\n4. Place a **credit ban** with the three credit bureaus:\n   - Equifax: 13 83 32\n   - Experian: 1300 783 684\n   - illion: 13 23 33\n\n**Reporting:**\n- Report to **ReportCyber** at cyber.gov.au (Australian Cyber Security Centre)\n- Report to **IDCARE** at idcare.org — Australia's national identity support service (free)\n- File a police report if financial loss has occurred\n- Notify **Services Australia** if your Medicare, tax file number, or Centrelink details were exposed\n\n**Ongoing protection:**\n- Monitor your **credit reports** regularly (free annual report from each bureau)\n- Watch for unexpected bills, letters, or account notifications\n- Consider a **credit alert** that notifies you of any new credit applications\n\nIDCARE (1800 595 160) provides **free, expert support** for identity theft victims — they can guide you through the entire recovery process.",
  telemarketing: "Unwanted calls and spam in Australia are regulated. Here's how to deal with them:\n\n**Do Not Call Register:**\n- Register your number for **free** at donotcall.gov.au\n- It takes up to **30 days** to take effect\n- Covers telemarketing calls and faxes\n- Some organisations are **exempt** (charities, political parties, educational institutions)\n\n**Spam messages and emails:**\n- Report spam SMS by forwarding to **0429 999 888**\n- Report spam emails to the **ACMA** at acma.gov.au\n- Never reply or click links in spam — it confirms your number is active\n\n**If calls continue after registering:**\n1. Note the **date, time, and company name**\n2. Lodge a complaint at **donotcall.gov.au**\n3. Businesses face fines of up to **$2.1 million** for breaches\n\n**Robocalls and scam calls:**\n- These are usually **illegal** regardless of the Do Not Call Register\n- Report to **Scamwatch** at scamwatch.gov.au\n- Use your phone's **call blocking** features\n- Consider a call-screening app\n\n**Tip:** Legitimate businesses will always identify themselves and respect your request to stop calling.",
  insurance: "Dealing with an insurance issue? Here's how the system works in Australia:\n\n**Your rights as a policyholder:**\n- Insurers must handle claims **promptly and fairly**\n- Policy terms must be **clear and not misleading**\n- You have the right to receive **reasons for any denial** in writing\n\n**If your claim is denied:**\n1. Request the **denial reason in writing**\n2. Review your **Product Disclosure Statement** (PDS) carefully\n3. Lodge an **internal complaint** with the insurer — they must respond within 30 days\n4. If unsatisfied, escalate to the **Australian Financial Complaints Authority** (AFCA)\n\n**AFCA (free dispute resolution):**\n- Phone: 1800 931 678\n- Website: afca.org.au\n- Can award compensation and require insurers to pay claims\n- Completely **free** for consumers\n\n**Common dispute areas:**\n- **Underinsurance** — check your sum insured regularly\n- **Non-disclosure** — always answer questions honestly when applying\n- **Natural disasters** — special rules apply for flood, storm, and bushfire claims\n- **Total loss** — you're entitled to the **agreed or market value**, not the replacement cost (unless specified)\n\nKeep copies of **all correspondence** and **photos** of damage for your records.",
  utilities: "Disputes about electricity, gas, or water bills? Here's what you can do:\n\n**Your rights with utility providers:**\n- Bills must be **accurate and based on actual usage** (or reasonable estimates)\n- You must receive **adequate notice** before disconnection\n- Hardship programs must be offered if you're struggling to pay\n- You can request a **meter test** if you suspect faulty readings\n\n**If you receive an unexpectedly high bill:**\n1. Compare with **previous bills** — look for usage spikes\n2. Check for **leaks** (water) or faulty appliances (electricity/gas)\n3. Contact your provider and request a **bill review**\n4. Ask for a **meter test** — if the meter is faulty, the cost is covered by the provider\n\n**If you can't pay:**\n- Contact your provider **before** the due date\n- Ask about their **hardship program** — all major providers must have one\n- Request a **payment plan** — providers must offer reasonable terms\n- You may be eligible for **government concessions** or rebates\n\n**Escalation:**\n- Each state has an **energy/water ombudsman** (free dispute resolution)\n- NSW: EWON | VIC: EWOV | QLD: EWOQ | SA: EWOSA\n- They can investigate complaints and order remedies\n\nProviders **cannot disconnect** you while a complaint is being investigated by the ombudsman.",
  employment: "While I specialise in consumer rights, I can point you in the right direction for workplace issues:\n\n**⚠️ Important:** Employment law is separate from consumer law. For workplace issues, the best resource is:\n\n**Fair Work Ombudsman (FWO):**\n- Website: fairwork.gov.au\n- Phone: **13 13 94** (Mon–Fri, 8am–5:30pm)\n- Free advice and dispute resolution\n\n**They can help with:**\n- Unpaid wages or underpayment\n- Unfair dismissal\n- Workplace bullying\n- Leave entitlements\n- Contract disputes\n\n**If you're an international student working in Australia:**\n- You have the **same workplace rights** as Australian workers\n- Visa status **doesn't affect** your entitlement to minimum wage and conditions\n- FWO has a dedicated page for **visa holders**\n- Exploitation of visa holders is a **serious offence** — don't be afraid to report it\n\n**Steps to take:**\n1. Check your entitlements on the **FWO Pay Calculator**\n2. Raise the issue with your employer in writing\n3. If unresolved, contact **Fair Work** for free mediation\n4. Keep records of all hours worked, pay slips, and communications\n\nIs there a consumer-related issue I can help you with instead?",
  privacy: "Your personal information is protected under Australian law. Here's what you should know:\n\n**Australian Privacy Act:**\n- Applies to businesses with **annual turnover over $3 million** (and some others)\n- Organisations must tell you **what data they collect and why**\n- You have the right to **access** your personal information\n- You can request **corrections** to inaccurate data\n\n**If your data has been misused:**\n1. Contact the organisation's **privacy officer** directly\n2. Request details of what data they hold about you\n3. Ask them to **delete or correct** it\n4. If they don't comply, lodge a complaint with the **OAIC**\n\n**Office of the Australian Information Commissioner (OAIC):**\n- Website: oaic.gov.au\n- Can investigate and make determinations\n- Free to lodge a complaint\n\n**Data breaches:**\n- Organisations must notify you of **eligible data breaches**\n- If notified, follow their recommended steps immediately\n- Change passwords and monitor accounts\n- Contact **IDCARE** (1800 595 160) for free identity protection support\n\n**Tips:**\n- Read privacy policies before signing up (focus on data sharing clauses)\n- Use different passwords for different services\n- Be cautious about what you share on social media",
  tribunal: "Taking a matter to a tribunal or small claims court can be more straightforward than you think:\n\n**What is a tribunal?**\n- A less formal alternative to court for resolving disputes\n- Designed for **self-representation** — you don't need a lawyer\n- Lower costs (usually $20–$100 filing fee)\n- Faster resolution than traditional courts\n\n**State tribunals:**\n- **NSW:** NCAT (ncat.nsw.gov.au)\n- **VIC:** VCAT (vcat.vic.gov.au)\n- **QLD:** QCAT (qcat.qld.gov.au)\n- **WA:** State Administrative Tribunal\n- **SA:** SACAT\n\n**When to go to a tribunal:**\n- Seller refuses a legitimate refund\n- Bond dispute with landlord\n- Faulty product and seller won't cooperate\n- Amounts typically up to **$25,000–$40,000** (varies by state)\n\n**How to prepare:**\n1. Gather **all evidence** — receipts, photos, emails, contracts\n2. Write a clear **timeline** of events\n3. Know exactly **what outcome** you want (refund amount, specific action)\n4. Bring **copies** of everything (originals + copies for the other party)\n5. Practice explaining your case **clearly and briefly**\n\n**Tips:**\n- Many tribunals offer **free mediation** before the hearing\n- Be factual and calm — tribunals respond to evidence, not emotion\n- The other party usually must comply with the tribunal's decision",
  consumer_law: "Here's an overview of the **Australian Consumer Law (ACL)** — your key rights as a consumer:\n\n**Consumer Guarantees:**\nWhen you buy goods or services, they must:\n- Be of **acceptable quality**\n- Be **fit for purpose**\n- **Match the description** or sample\n- Come with **full title and ownership**\n\n**These guarantees:**\n- Apply **automatically** — no need to buy extended warranties for basic protection\n- **Cannot be excluded** by sellers (even with signs saying \"no refunds\")\n- Apply to goods and services under **$100,000** (or over, if for personal use)\n\n**When things go wrong:**\n- **Major failure:** You choose — refund, replacement, or compensation\n- **Minor failure:** Seller can choose to repair, replace, or refund\n\n**Key protections:**\n- **Misleading conduct** — businesses can't deceive or mislead you\n- **Unfair contract terms** — standard form contracts can be challenged\n- **Unsolicited supplies** — you don't have to pay for things you didn't order\n- **Product safety** — unsafe products can be recalled\n\n**Who enforces it:**\n- **ACCC** — federal level\n- **State Fair Trading** offices — state level\n- Both offer free complaint handling\n\nWant to know more about a specific area? Just ask!",
  default: "Thank you for your question. I want to make sure I give you the most helpful guidance.\n\nBased on the information you've provided, here are some general steps you can take:\n\n1. **Document everything** — keep receipts, screenshots, emails, and photos\n2. **Know your rights** — Australian Consumer Law protects buyers of goods and services\n3. **Contact the other party** in writing first — this creates a record\n4. **Set a deadline** — give them a reasonable timeframe to respond (7–14 days)\n5. **Seek help** if direct contact doesn't resolve the issue:\n   - **ACCC** for national consumer issues\n   - **State Fair Trading** for local disputes\n   - **Scamwatch** for scam-related concerns\n\nCould you tell me more about your situation? I can give more specific advice if I know whether it's about:\n- A **scam or fraud** concern\n- A **refund or faulty product**\n- A **rental or bond** dispute\n- An **online shopping** issue\n- A **warranty** problem\n- Something else entirely\n\nThe more detail you provide, the better I can help!"
};

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

type ResponseRule = {
  readonly key: string;
  readonly keywords: readonly string[];
};

const RESPONSE_RULES: readonly ResponseRule[] = [
  { key: "greeting", keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "howdy", "g'day", "gday"] },
  { key: "thanks", keywords: ["thank you", "thanks", "cheers", "appreciate", "helpful", "great help"] },
  { key: "capabilities", keywords: ["what can you", "help me with", "what do you", "what are you", "how can you", "your capabilities", "what topics"] },
  { key: "identity", keywords: ["identity", "stolen identity", "data breach", "personal information", "hacked", "someone used my", "identity theft"] },
  { key: "chargeback", keywords: ["credit card", "chargeback", "charged", "transaction", "bank charge", "disputed charge", "unauthorised", "unauthorized"] },
  { key: "telemarketing", keywords: ["telemarketer", "spam", "do not call", "unsolicited", "cold call", "robocall", "junk mail", "spam text", "spam sms"] },
  { key: "scam", keywords: ["scam", "phish", "fraud", "suspicious", "fake", "impersonat", "too good to be true", "nigerian", "lottery", "prize"] },
  { key: "online_shopping", keywords: ["online", "website", "delivery", "shipping", "parcel", "tracking", "ebay", "amazon", "aliexpress", "wish", "temu", "didn't arrive", "wrong item"] },
  { key: "warranty", keywords: ["warranty", "guarantee", "repair", "manufacturer", "extended warranty", "broken after", "stopped working", "lasted"] },
  { key: "travel", keywords: ["flight", "airline", "travel", "hotel", "booking", "cancel flight", "delayed flight", "lost baggage", "airbnb", "qantas", "jetstar"] },
  { key: "subscription", keywords: ["subscription", "gym", "membership", "recurring", "cancel subscription", "auto renew", "unsubscribe", "keep charging", "streaming"] },
  { key: "car", keywords: ["car", "vehicle", "dealer", "second hand", "used car", "mechanic", "odometer", "lemon", "dealership", "test drive"] },
  { key: "insurance", keywords: ["insurance", "claim", "policy", "insurer", "premium", "cover", "pds", "not covered", "denied claim"] },
  { key: "utilities", keywords: ["electricity", "gas", "water", "utility", "bill", "meter", "energy", "power bill", "disconnection", "high bill"] },
  { key: "employment", keywords: ["employer", "wage", "pay", "fired", "job", "unfair dismissal", "underpaid", "work rights", "workplace"] },
  { key: "privacy", keywords: ["privacy", "personal data", "personal info", "gdpr", "collected my", "data collection", "cookies", "tracking me"] },
  { key: "tribunal", keywords: ["tribunal", "court", "sue", "small claims", "legal action", "ncat", "vcat", "qcat", "take them to"] },
  { key: "consumer_law", keywords: ["consumer law", "rights", "acl", "australian consumer law", "consumer guarantee", "what are my rights"] },
  { key: "refund", keywords: ["refund", "return", "seller", "refused", "broken", "faulty", "money back", "exchange", "store credit", "won't refund"] },
  { key: "product", keywords: ["unsafe", "product safety", "safety", "recall", "dangerous", "overheating", "sparks", "defect", "chemical smell", "injury"] },
  { key: "bond", keywords: ["bond", "landlord", "rent", "tenant", "deposit", "lease", "real estate", "moving out", "condition report", "wear and tear"] },
];

function getMockResponse(question: string): string {
  const q = question.toLowerCase();

  for (const rule of RESPONSE_RULES) {
    if (rule.keywords.some((kw) => q.includes(kw))) {
      return MOCK_RESPONSES[rule.key] ?? MOCK_RESPONSES.default;
    }
  }

  return MOCK_RESPONSES.default;
}

async function simulateStream(text: string, onChunk: (accumulated: string) => void, signal: AbortSignal): Promise<void> {
  const words = text.split(" ");
  let accumulated = "";
  for (let i = 0; i < words.length; i++) {
    if (signal.aborted) return;
    accumulated += (i === 0 ? "" : " ") + words[i];
    onChunk(accumulated);
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
  }
}

type UseOllamaChatOptions = {
  model?: string;
};

const STORAGE_KEY = "clearrights-aibot-messages";

export function useOllamaChat({ model = "llama3.2" }: UseOllamaChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<OllamaStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const baseUrlRef = useRef<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const useMockRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* storage unavailable */ }
  }, [messages]);

  const detectBaseUrl = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/tags", { signal: AbortSignal.timeout(3000) });
      if (res.ok) return "/api";
    } catch { /* proxy not available */ }

    try {
      const res = await fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(3000) });
      if (res.ok) return "http://localhost:11434";
    } catch { /* direct not available */ }

    return null;
  }, []);

  const checkConnection = useCallback(async () => {
    setStatus("connecting");
    const url = await detectBaseUrl();
    baseUrlRef.current = url;
    useMockRef.current = !url;
    setStatus("idle");
    setError(null);
  }, [detectBaseUrl]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = text ?? input.trim();
      if (!messageText) return;
      if (abortRef.current) return;

      const userMessage: ChatMessage = {
        id: makeId(),
        role: "user",
        content: messageText,
        createdAt: Date.now()
      };

      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: "",
        createdAt: Date.now()
      };

      const currentMessages = messagesRef.current;
      const updatedMessages = [...currentMessages, userMessage];
      setMessages([...updatedMessages, assistantMessage]);
      setInput("");
      setStatus("streaming");
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      // Use mock responses if Ollama is not available
      if (useMockRef.current || !baseUrlRef.current) {
        const mockText = getMockResponse(messageText);
        try {
          // Simulate LLM thinking delay
          setStatus("thinking");
          await new Promise((r) => setTimeout(r, 1000 + Math.random() * 2000));
          if (controller.signal.aborted) { abortRef.current = null; return; }

          setStatus("streaming");
          await simulateStream(mockText, (accumulated) => {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last && last.role === "assistant") {
                copy[copy.length - 1] = { ...last, content: accumulated };
              }
              return copy;
            });
          }, controller.signal);
          setStatus("idle");
        } catch {
          setStatus("idle");
        } finally {
          abortRef.current = null;
        }
        return;
      }

      // Real Ollama streaming
      const apiMessages = [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...updatedMessages.map((m) => ({ role: m.role, content: m.content }))
      ];

      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      try {
        const res = await fetch(`${baseUrlRef.current}/v1/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages: apiMessages, stream: true }),
          signal: controller.signal
        });

        if (!res.ok) {
          // Fallback to mock if Ollama fails
          useMockRef.current = true;
          const mockText = getMockResponse(messageText);
          await simulateStream(mockText, (accumulated) => {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last && last.role === "assistant") {
                copy[copy.length - 1] = { ...last, content: accumulated };
              }
              return copy;
            });
          }, controller.signal);
          setStatus("idle");
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setError("No response stream");
          setStatus("error");
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = "";

        timeoutId = setTimeout(() => {
          controller.abort();
          setError("Response timed out.");
          setStatus("error");
        }, 30000);

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            controller.abort();
            setError("Response timed out.");
            setStatus("error");
          }, 30000);

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                const finalContent = accumulated;
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === "assistant") {
                    copy[copy.length - 1] = { ...last, content: finalContent };
                  }
                  return copy;
                });
              }
            } catch { /* skip malformed */ }
          }
        }

        setStatus("idle");
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setStatus((prev) => (prev === "error" ? "error" : "idle"));
        } else {
          setError("Connection lost.");
          setStatus("error");
        }
      } finally {
        clearTimeout(timeoutId);
        abortRef.current = null;
      }
    },
    [input, model, detectBaseUrl]
  );

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
  }, []);

  const clearMessages = useCallback(() => {
    stopGeneration();
    setMessages([]);
    setError(null);
    setStatus("idle");
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, [stopGeneration]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isThinking: status === "thinking",
    isStreaming: status === "streaming" || status === "thinking",
    status,
    error,
    clearMessages,
    stopGeneration,
    retryConnection: checkConnection
  };
}
