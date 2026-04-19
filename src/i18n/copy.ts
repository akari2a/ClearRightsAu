import { DEFAULT_LOCALE, type AppLocale } from "./config";

type UiCopy = {
  nav: {
    home: string;
    guide: string;
    cases: string;
    aibot: string;
    guideScam: string;
    guideRefund: string;
    guideUnsafe: string;
    languageLabel: string;
    localeSuggestionTitle: string;
    localeSuggestionBody: string;
    localeSuggestionSwitch: string;
    localeSuggestionStay: string;
  };
  footer: {
    navigateTitle: string;
    navigateLinks: {
      home: string;
      guide: string;
      cases: string;
      aibot: string;
    };
    brandCopy: string;
    meta: string;
  };
  breadcrumbs: {
    cases: string;
    caseDetails: string;
  };
  cases: {
    searchPlaceholder: string;
    searchButton: string;
    allFilter: string;
    filterAriaLabel: string;
    emptyTitle: string;
    emptyCopy: string;
  };
  caseDetail: {
    category: string;
    riskLevel: string;
    outcome: string;
    continueExploring: string;
    assessmentTitleNonScam: string;
    assessmentEyebrowNonScam: string;
  };
  guide: {
    checkYourSituation: string;
    whatToDoNext: string;
    questionnaireProgress: string;
    previousStep: string;
    continue: string;
    relatedCases: string;
    startAgain: string;
    saveAsPdf: string;
    showEnglishComparison: string;
    hideEnglishComparison: string;
    onThisPage: string;
    whatToPrepare: string;
    whereToGetHelp: string;
    riskLevelPrefix: string;
    resultFallback: string;
    recogniserEntryTitle: string;
    recogniserEntryBody: string;
    recogniserEntryAction: string;
    exitDialogTitle: string;
    exitDialogBody: string;
    exitDialogStay: string;
    exitDialogLeave: string;
    stepOf: (current: number, total: number) => string;
    scamIntro: string;
    refundIntro: string;
    unsafeIntro: string;
  };
  aibot: {
    askAi: string;
    newConversation: string;
    chatbotInputAria: string;
    suggestedQuestionsAria: string;
  };
  scamRecogniser: {
    close: string;
    title: string;
    pickType: string;
    socialLead: string;
    socialAction: string;
    back: string;
    provideDetails: string;
    analyse: string;
    analysing: string;
    suspiciousHeading: string;
    suspiciousBody: string;
    clearHeading: string;
    clearBody: string;
    getHelp: string;
    checkAnother: string;
    stillNotSure: string;
    required: string;
    tooLong: (max: number) => string;
    invalidUrl: string;
    types: {
      text: string;
      email: string;
      phone: string;
      website: string;
    };
    fields: {
      textSender: string;
      textSenderPlaceholder: string;
      textContent: string;
      textContentPlaceholder: string;
      emailSender: string;
      emailSenderPlaceholder: string;
      emailContent: string;
      emailContentPlaceholder: string;
      phoneNumber: string;
      phoneNumberPlaceholder: string;
      phoneDescription: string;
      phoneDescriptionPlaceholder: string;
      websiteUrl: string;
      websiteUrlPlaceholder: string;
    };
  };
};

const UI_COPY_BY_LOCALE: Record<AppLocale, UiCopy> = {
  en: {
    nav: {
      home: "Home",
      guide: "Guide",
      cases: "Cases",
      aibot: "AIBot",
      guideScam: "Scam",
      guideRefund: "Refund and replacement",
      guideUnsafe: "Unsafe products",
      languageLabel: "Language",
      localeSuggestionTitle: "Prefer Simplified Chinese?",
      localeSuggestionBody: "Your device language looks like Simplified Chinese. We can switch the site for you.",
      localeSuggestionSwitch: "Switch to 简体中文",
      localeSuggestionStay: "Stay in English"
    },
    footer: {
      navigateTitle: "Navigate",
      navigateLinks: {
        home: "Home",
        guide: "Guide",
        cases: "Cases",
        aibot: "AIBot"
      },
      brandCopy: "Clear, practical help for consumer problems, from first questions to next steps.",
      meta: "Designed to make consumer rights information easier to understand and act on."
    },
    breadcrumbs: {
      cases: "Cases",
      caseDetails: "Case details"
    },
    cases: {
      searchPlaceholder: "Search by topic, category, or situation",
      searchButton: "Search",
      allFilter: "All",
      filterAriaLabel: "Filter cases",
      emptyTitle: "No cases found",
      emptyCopy: "Try a different keyword or change the category filter."
    },
    caseDetail: {
      category: "Category",
      riskLevel: "Risk level",
      outcome: "Outcome",
      continueExploring: "Continue exploring cases",
      assessmentTitleNonScam: "What this could mean",
      assessmentEyebrowNonScam: "WHAT THIS COULD MEAN"
    },
    guide: {
      checkYourSituation: "Check your situation",
      whatToDoNext: "What to do next",
      questionnaireProgress: "Questionnaire progress",
      previousStep: "Previous step",
      continue: "Continue",
      relatedCases: "Related cases",
      startAgain: "Start again",
      saveAsPdf: "Save as PDF",
      showEnglishComparison: "English comparison",
      hideEnglishComparison: "English comparison",
      onThisPage: "On this page",
      whatToPrepare: "What to prepare",
      whereToGetHelp: "Where to get help",
      riskLevelPrefix: "Risk level",
      resultFallback: "Result",
      recogniserEntryTitle: "Need help checking a message?",
      recogniserEntryBody: "Paste the text, email, call details, or website you received and we can help you recognise suspicious scam patterns before you act.",
      recogniserEntryAction: "Recognise suspicious text",
      exitDialogTitle: "Leave this questionnaire?",
      exitDialogBody: "Your current answers will be lost if you leave now.",
      exitDialogStay: "Stay here",
      exitDialogLeave: "Leave page",
      stepOf: (current, total) => `Step ${current} of ${total}`,
      scamIntro: "Answer a few questions about what happened. We will use the facts you know to guide the next steps.",
      refundIntro: "Answer a few questions about what happened. We will use the facts you know to guide the next steps.",
      unsafeIntro: "Answer a few questions about the product. We will help you work out what to do next."
    },
    aibot: {
      askAi: "Ask AI",
      newConversation: "New conversation",
      chatbotInputAria: "Ask about your consumer rights",
      suggestedQuestionsAria: "Suggested questions"
    },
    scamRecogniser: {
      close: "Close",
      title: "Check if it's a scam",
      pickType: "Select the type of message or contact you received",
      socialLead: "Received something on social media?",
      socialAction: "Start guided check →",
      back: "Back",
      provideDetails: "Provide the details below for analysis",
      analyse: "Analyse",
      analysing: "Analysing your content...",
      suspiciousHeading: "This looks suspicious",
      suspiciousBody: "We detected patterns commonly associated with scams. This doesn't confirm it's a scam, but we recommend caution.",
      clearHeading: "No obvious scam indicators detected",
      clearBody: "We didn't find common scam patterns, but this doesn't guarantee it's safe. Stay cautious with any unexpected contact.",
      getHelp: "Get step-by-step help",
      checkAnother: "Check another",
      stillNotSure: "Still not sure? Start guided check →",
      required: "This field is required",
      tooLong: (max) => `Content is too long (max ${max.toLocaleString()} characters)`,
      invalidUrl: "Enter a valid URL starting with http:// or https://",
      types: {
        text: "Text / SMS",
        email: "Email",
        phone: "Phone call",
        website: "Website"
      },
      fields: {
        textSender: "Sender number",
        textSenderPlaceholder: "e.g. +61 400 000 000 or a short code",
        textContent: "Message content",
        textContentPlaceholder: "Paste or type the full message here...",
        emailSender: "Sender address",
        emailSenderPlaceholder: "e.g. noreply@example.com",
        emailContent: "Email content",
        emailContentPlaceholder: "Paste the email body here...",
        phoneNumber: "Phone number",
        phoneNumberPlaceholder: "e.g. +61 2 0000 0000",
        phoneDescription: "Describe the call",
        phoneDescriptionPlaceholder: "What did the caller say? What did they ask for?",
        websiteUrl: "Website URL",
        websiteUrlPlaceholder: "e.g. https://example.com"
      }
    }
  },
  "zh-Hans": {
    nav: {
      home: "首页",
      guide: "指南",
      cases: "案例",
      aibot: "AI 助手",
      guideScam: "诈骗",
      guideRefund: "退款与更换",
      guideUnsafe: "不安全产品",
      languageLabel: "语言",
      localeSuggestionTitle: "要切换到简体中文吗？",
      localeSuggestionBody:
        "你的设备语言看起来是简体中文，我们可以帮你切换网站语言。请注意，翻译内容可能存在准确性问题。",
      localeSuggestionSwitch: "切换到简体中文",
      localeSuggestionStay: "Stay in English"
    },
    footer: {
      navigateTitle: "导航",
      navigateLinks: {
        home: "首页",
        guide: "指南",
        cases: "案例",
        aibot: "AI 助手"
      },
      brandCopy: "为消费问题提供清晰、实用的帮助，从初步判断到下一步行动。",
      meta: "帮助用户更容易理解消费者权益信息，并采取行动。"
    },
    breadcrumbs: {
      cases: "案例",
      caseDetails: "案例详情"
    },
    cases: {
      searchPlaceholder: "按主题、分类或情境搜索",
      searchButton: "搜索",
      allFilter: "全部",
      filterAriaLabel: "筛选案例",
      emptyTitle: "没有找到相关案例",
      emptyCopy: "试试其他关键词，或切换分类筛选。"
    },
    caseDetail: {
      category: "分类",
      riskLevel: "风险等级",
      outcome: "结果",
      continueExploring: "继续浏览案例",
      assessmentTitleNonScam: "这可能意味着什么",
      assessmentEyebrowNonScam: "这可能意味着什么"
    },
    guide: {
      checkYourSituation: "先判断你的情况",
      whatToDoNext: "接下来怎么做",
      questionnaireProgress: "问卷进度",
      previousStep: "上一步",
      continue: "继续",
      relatedCases: "相关案例",
      startAgain: "重新开始",
      saveAsPdf: "保存为 PDF",
      showEnglishComparison: "英文对照",
      hideEnglishComparison: "英文对照",
      onThisPage: "本页导航",
      whatToPrepare: "需要准备什么",
      whereToGetHelp: "去哪里寻求帮助",
      riskLevelPrefix: "风险等级",
      resultFallback: "结果",
      recogniserEntryTitle: "还想再判断一段可疑内容吗？",
      recogniserEntryBody: "粘贴你收到的短信、邮件、通话内容或网站链接，我们可以在你采取下一步行动前，帮你识别常见诈骗迹象。",
      recogniserEntryAction: "识别诈骗文本",
      exitDialogTitle: "要离开这份问卷吗？",
      exitDialogBody: "如果现在离开，你当前填写的答案将会丢失。",
      exitDialogStay: "继续留在这里",
      exitDialogLeave: "离开页面",
      stepOf: (current, total) => `第 ${current} 步，共 ${total} 步`,
      scamIntro: "回答几个关于发生了什么的问题。我们会根据你已知的事实，给出下一步建议。",
      refundIntro: "回答几个关于发生了什么的问题。我们会根据你已知的事实，给出下一步建议。",
      unsafeIntro: "回答几个关于产品的问题。我们会帮助你判断接下来该怎么做。"
    },
    aibot: {
      askAi: "询问 AI",
      newConversation: "新建对话",
      chatbotInputAria: "询问你的消费者权益问题",
      suggestedQuestionsAria: "推荐问题"
    },
    scamRecogniser: {
      close: "关闭",
      title: "判断这是不是诈骗",
      pickType: "选择你收到的信息或联系类型",
      socialLead: "是在社交媒体上收到的吗？",
      socialAction: "开始引导式判断 →",
      back: "返回",
      provideDetails: "请填写下面的信息以进行分析",
      analyse: "开始分析",
      analysing: "正在分析你的内容……",
      suspiciousHeading: "这看起来有可疑之处",
      suspiciousBody: "我们检测到了一些常见诈骗特征。这并不能完全确认它就是诈骗，但建议你保持警惕。",
      clearHeading: "未发现明显诈骗特征",
      clearBody: "我们没有发现常见诈骗模式，但这并不代表它一定安全。对于任何意外联系仍然要保持谨慎。",
      getHelp: "查看分步骤帮助",
      checkAnother: "再检查一条",
      stillNotSure: "仍不确定？开始引导式判断 →",
      required: "此字段为必填项",
      tooLong: (max) => `内容过长（最多 ${max.toLocaleString()} 个字符）`,
      invalidUrl: "请输入以 http:// 或 https:// 开头的有效网址",
      types: {
        text: "短信 / 文本",
        email: "电子邮件",
        phone: "电话来电",
        website: "网站"
      },
      fields: {
        textSender: "发送号码",
        textSenderPlaceholder: "例如 +61 400 000 000 或短号码",
        textContent: "短信内容",
        textContentPlaceholder: "请粘贴或输入完整短信内容……",
        emailSender: "发件人地址",
        emailSenderPlaceholder: "例如 noreply@example.com",
        emailContent: "邮件内容",
        emailContentPlaceholder: "请粘贴邮件正文……",
        phoneNumber: "来电号码",
        phoneNumberPlaceholder: "例如 +61 2 0000 0000",
        phoneDescription: "描述通话内容",
        phoneDescriptionPlaceholder: "对方说了什么？要求你做什么？",
        websiteUrl: "网站链接",
        websiteUrlPlaceholder: "例如 https://example.com"
      }
    }
  }
};

export function getUiCopy(locale: AppLocale = DEFAULT_LOCALE): UiCopy {
  return UI_COPY_BY_LOCALE[locale] ?? UI_COPY_BY_LOCALE[DEFAULT_LOCALE];
}
