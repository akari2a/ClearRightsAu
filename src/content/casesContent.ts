import { DEFAULT_LOCALE, type AppLocale } from "../i18n/config";
import casesEn from "../locales/en/cases.json";
import type { CasesPageContent, SuccessCase } from "../types/case";

const CASE_CATEGORY_LABEL_ZH: Record<string, string> = {
  scam: "诈骗",
  refund: "退款",
  tenancy: "租房",
  "product-safety": "不安全产品"
};

const CASES_CONTENT_BY_LOCALE: Record<AppLocale, CasesPageContent> = {
  en: casesEn as CasesPageContent,
  "zh-Hans": (() => {
    const base = casesEn as CasesPageContent;

    return {
      ...base,
      pageTitle: "成功案例",
      pageDescription: "真实案例帮助你识别熟悉情境，并看看别人采取了哪些步骤。",
      sections: base.sections.map((section) => {
        if (section.id === "situation") {
          return { ...section, eyebrow: "发生了什么", title: "事情经过" };
        }

        if (section.id === "assessment") {
          return { ...section, eyebrow: "风险判断", title: "事情有多严重？" };
        }

        if (section.id === "action-plan") {
          return { ...section, eyebrow: "他们做了什么", title: "采取的步骤" };
        }

        if (section.id === "outcome") {
          return { ...section, eyebrow: "结果", title: "最后怎么样了" };
        }

        if (section.id === "takeaway") {
          return { ...section, eyebrow: "关键收获", title: "你可以学到什么" };
        }

        return section;
      }),
      groups: base.groups.map((group) => {
        if (group.categoryKey === "scam") {
          return {
            ...group,
            categoryLabel: "诈骗案例",
            description: "展示人们如何处理可疑短信、电话和钓鱼链接的案例。"
          };
        }

        if (group.categoryKey === "refund-replacement") {
          return {
            ...group,
            categoryLabel: "退款与更换案例",
            description: "展示人们如何处理退款、误导销售、更换商品和住房纠纷的案例。"
          };
        }

        if (group.categoryKey === "product-safety") {
          return {
            ...group,
            categoryLabel: "不安全产品",
            description: "展示人们如何应对产品安全问题和危险缺陷的案例。"
          };
        }

        return group;
      }),
      cases: base.cases.map((caseItem) => ({
        ...caseItem,
        categoryLabel: CASE_CATEGORY_LABEL_ZH[caseItem.category] ?? caseItem.categoryLabel,
        takeaway: {
          ...caseItem.takeaway,
          relatedGuideLabel:
            caseItem.category === "scam"
              ? "想判断你自己的情况吗？"
              : "想查看适合你情况的指南吗？"
        }
      }))
    };
  })()
};

export function getCasesPageContent(locale: AppLocale = DEFAULT_LOCALE): CasesPageContent {
  return CASES_CONTENT_BY_LOCALE[locale] ?? CASES_CONTENT_BY_LOCALE[DEFAULT_LOCALE];
}

export function getCaseById(content: CasesPageContent, caseId: string): SuccessCase | undefined {
  return content.cases.find((c) => c.id === caseId);
}
