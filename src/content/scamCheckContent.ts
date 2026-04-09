import type { DetailSectionMeta, ScamActionCard, ScamJourney, ScamJourneyKey } from "../types/scam";

export const SCAM_DETAIL_SECTIONS: DetailSectionMeta[] = [
  {
    id: "choose-path",
    number: "1",
    eyebrow: "Choose your path",
    title: "What best matches your situation?"
  },
  {
    id: "first-judgement",
    number: "2",
    eyebrow: "First judgement",
    title: "How serious does this look?"
  },
  {
    id: "action-plan",
    number: "3",
    eyebrow: "Action plan",
    title: "What to do next"
  },
  {
    id: "real-situations",
    number: "4",
    eyebrow: "Real situations",
    title: "Cases like this"
  }
];

export const SCAM_JOURNEYS: ScamJourney[] = [
  {
    key: "unsure",
    optionLabel: "I'm not sure if this is a scam yet",
    optionDescription: "You received a text, call, or link that feels suspicious, but you have not clearly lost money yet.",
    summary: "Use this path if something feels wrong and you need a fast first judgement before you decide what to do next.",
    riskLabel: "Suspicious: check now",
    riskTone: "warning",
    headline: "If it asks for urgency, payment, or personal details, treat it as suspicious until proven otherwise.",
    cardText: "This is the safer path for users who are still unsure. The goal is to lower risk quickly, not to wait for perfect certainty.",
    signals: [
      "The message asks for urgent action, payment, or personal details.",
      "The caller or sender pressures you to act immediately.",
      "The link, sender, or story feels unusual or does not match what you expected."
    ],
    actions: [
      "Do not click the link again or reply to the message.",
      "If you opened the link but entered nothing, monitor your accounts and stay alert for follow-up messages.",
      "If you typed details into the site, change passwords and contact your bank or provider immediately."
    ],
    evidence: ["Screenshots of the text or chat", "Phone number, sender name, or email", "Link URL if visible", "Any warning signs you noticed at the time"],
    escalation: [
      "Report the suspicious message to the relevant official scam reporting service.",
      "Contact your bank immediately if card or account details may have been exposed.",
      "Seek more formal support if the scam is tied to a purchase, booking, or service dispute."
    ],
    cases: [
      "I clicked a parcel delivery link but did not enter any details.",
      "Someone called saying my visa had expired and asked me to act immediately.",
      "I got a text asking me to pay a small fee to release a package."
    ]
  },
  {
    key: "affected",
    optionLabel: "I already sent money or shared details",
    optionDescription: "You already paid, gave bank details, shared passwords, or sent identity information.",
    summary: "Use this path if the scam has already caused harm or may have exposed your money, accounts, or personal details.",
    headline: "If money or personal details have already been shared, stop the damage first and document everything.",
    cardText: "This path focuses on urgent loss reduction. The right first step is usually to protect accounts and gather evidence before doing anything else.",
    signals: [
      "You transferred money, approved a payment, or entered your banking details.",
      "You shared passwords, verification codes, passport details, or other identity information.",
      "The person or website cut off contact after you paid or started behaving differently."
    ],
    actions: [
      "Contact your bank or payment provider immediately and explain that you may have been scammed.",
      "Change affected passwords and secure any linked email or phone accounts.",
      "Stop further communication with the scammer and take screenshots before anything disappears."
    ],
    evidence: ["Screenshots of messages and payment requests", "Transaction receipts or bank reference numbers", "Names, numbers, links, and account details used", "A timeline of what happened and when"],
    escalation: [
      "Report the scam to the relevant official scam reporting service as soon as possible.",
      "Follow your bank's fraud or dispute process if money was transferred.",
      "Seek formal consumer or legal support if the scam overlaps with goods, services, or rental issues."
    ],
    cases: [
      "I paid after a threatening call and realised too late it was fake.",
      "I entered my bank details into a delivery website that turned out to be fraudulent.",
      "I shared a verification code and then lost access to my account."
    ]
  }
];

export function getScamSectionTitle(sectionId: string, journeyKey: ScamJourneyKey): string {
  if (sectionId === "first-judgement") {
    return journeyKey === "unsure" ? "How serious does this look?" : "What matters most right now?";
  }

  return SCAM_DETAIL_SECTIONS.find((section) => section.id === sectionId)?.title ?? "";
}

export function getScamActionCards(journey: ScamJourney): ScamActionCard[] {
  return [
    {
      id: "signals",
      number: "1",
      eyebrow: journey.key === "unsure" ? "What this looks like" : "What this usually involves",
      title: journey.key === "unsure" ? "Signals to check" : "What this means now",
      items: journey.signals
    },
    {
      id: "actions",
      number: "2",
      eyebrow: "What to do now",
      title: "Immediate next steps",
      items: journey.actions,
      ordered: true
    },
    {
      id: "evidence",
      number: "3",
      eyebrow: "Prepare this first",
      title: "Evidence checklist",
      items: journey.evidence
    },
    {
      id: "escalation",
      number: "4",
      eyebrow: "If you need more help",
      title: "Escalation path",
      items: journey.escalation
    }
  ];
}
