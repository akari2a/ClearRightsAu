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
    }
  }
};

export function getUiCopy(locale: AppLocale = DEFAULT_LOCALE): UiCopy {
  return UI_COPY_BY_LOCALE[locale] ?? UI_COPY_BY_LOCALE[DEFAULT_LOCALE];
}
