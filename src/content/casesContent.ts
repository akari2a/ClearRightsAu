import { DEFAULT_LOCALE, type AppLocale } from "../i18n/config";
import casesEn from "../locales/en/cases.json";
import type { CasesPageContent, SuccessCase } from "../types/case";

type CaseTranslationZh = {
  persona?: Partial<SuccessCase["persona"]>;
  situation?: string;
  riskLabel?: string;
  riskHeadline?: string;
  riskExplanation?: string;
  actionCards?: SuccessCase["actionCards"];
  outcome?: Partial<SuccessCase["outcome"]>;
  takeaway?: Partial<SuccessCase["takeaway"]>;
};

const CASE_CATEGORY_LABEL_ZH: Record<string, string> = {
  scam: "诈骗",
  refund: "退款",
  tenancy: "租房",
  "product-safety": "不安全产品"
};

const CASE_TITLE_ZH: Record<string, string> = {
  "zhang-san-scam": "我点开了快递短信链接，但没有输入任何信息",
  "ching-refund": "商店把误导性品牌名的靴子卖给了我",
  "mrs-wang-heater": "我买的便携取暖器有塑料味，而且烫得危险",
  "simon-wang-bond": "我搬走后，房东以清洁为由扣了我的押金",
  "fake-job-text": "我在 WhatsApp 上收到了一份高薪工作邀请，但连面试都没有",
  "tax-office-call": "我接到自动电话，说我的税号已被暂停",
  "rental-scam-fb": "房东在我看房前就要求我先付押金",
  "broken-laptop": "我新买的笔记本屏幕坏了，但商店说是人为损坏",
  "gym-membership-cancel": "我取消健身房会员后，他们还在继续扣款",
  "mold-ignored": "房东一直不处理我卧室里的黑色霉菌",
  "rent-increase-notice": "我只提前两周就被通知房租要涨 150 澳元",
  "water-leak-repair": "我自己先支付了紧急水管维修费用"
};

const CASE_SUMMARY_ZH: Record<string, string> = {
  "zhang-san-scam": "一名学生点开了钓鱼快递链接，但在输入任何信息之前停下来了。看看他如何判断风险，以及之后采取了什么步骤。",
  "ching-refund": "一名游客买了自己以为是正品 UGG 的靴子，但现场展示具有误导性，商家也拒绝退款。看看她如何选择更实际的处理路径。",
  "mrs-wang-heater": "一位年长访客买到的取暖器散发塑料味，还变得异常烫手。看看她如何把它当作安全问题处理并最终解决。",
  "simon-wang-bond": "一名国际学生被告知押金中的一部分会因清洁问题被扣除。看看他如何判断这项扣款是否合理，并提出质疑。",
  "fake-job-text": "一条 WhatsApp 工作邀请承诺高薪、任务简单。看看识别其中的红旗是如何帮人避免经济损失的。",
  "tax-office-call": "一通带有恐吓意味的电话声称你欠税，并威胁逮捕。",
  "rental-scam-fb": "一名学生在网上找房时，被要求在未看房的情况下先转押金。",
  "broken-laptop": "笔记本出现了已知硬件故障，但零售商拒绝承担责任。",
  "gym-membership-cancel": "一种常见的问题：订阅看似取消了，但平台仍不断扣费。",
  "mold-ignored": "长期潮湿最终发展成了严重的霉菌问题。",
  "rent-increase-notice": "中介试图在没有足够通知的情况下强行大幅涨租。",
  "water-leak-repair": "周日突发水管爆裂，浴室被淹。"
};

const CASE_TRANSLATIONS_ZH: Record<string, CaseTranslationZh> = {
  "zhang-san-scam": {
    persona: {
      background: "悉尼大学一年级国际学生"
    },
    situation:
      "一天课间，张三查看手机时，看到一条看起来像来自澳大利亚邮政的短信。短信说包裹派送出现问题，并附上了一个重新安排投递的链接。因为他当时确实在等一个包裹，这条消息显得很可信，他几乎没多想就点开了链接。\n\n页面一开始看上去很像官方网站，并要求填写个人信息和银行卡信息。就在那一刻，他意识到事情不对劲了。他停了下来，更仔细地看了一遍，然后在没有提交任何内容的情况下关闭了页面。\n\n即使已经关闭网页，他仍然没有完全放心。他不确定只是打开链接这一行为，是否已经让自己的手机、银行账户或个人信息面临风险。",
    riskLabel: "低风险，但值得继续留意",
    riskHeadline: "只点击链接而没有输入信息，通常风险较低，但仍然值得进一步检查。",
    riskExplanation:
      "大多数钓鱼网站需要你主动提交信息后，才会造成实际损害。只是打开链接又立刻关闭，通常不太可能直接泄露银行账户或身份信息。不过，有些链接可能会尝试收集设备数据或安装跟踪内容，因此在接下来几天里留意账户和设备状态，仍然是合理的预防措施。",
    actionCards: [
      {
        id: "signals",
        number: "1",
        eyebrow: "他注意到什么",
        title: "警示信号",
        items: [
          "短信使用了关于快递异常的紧急措辞。",
          "页面要求填写个人信息和银行卡信息，而澳大利亚邮政绝不会通过短信这样做。",
          "链接网址与澳大利亚邮政官网并不一致。"
        ]
      },
      {
        id: "actions",
        number: "2",
        eyebrow: "他接着做了什么",
        title: "立即采取的行动",
        items: [
          "没有再次点击链接，也没有回复这条短信。",
          "查看了银行账户，确认没有异常交易。",
          "出于谨慎，更改了电子邮箱和银行应用的密码。",
          "屏蔽了发送短信的号码。"
        ],
        ordered: true
      },
      {
        id: "evidence",
        number: "3",
        eyebrow: "他保留了什么",
        title: "保留的证据",
        items: [
          "短信内容和发送号码的截图。",
          "关闭页面前拍下的钓鱼页面截图。",
          "可疑链接的网址。",
          "短信到达的日期和时间记录。"
        ]
      },
      {
        id: "escalation",
        number: "4",
        eyebrow: "他向哪里报告",
        title: "升级处理路径",
        items: [
          "通过 Scamwatch（scamwatch.gov.au）的在线表单报告了这条可疑短信。",
          "把短信转发给澳大利亚邮政的诈骗举报渠道。",
          "联系银行说明情况，并确认账户目前安全。"
        ]
      }
    ],
    outcome: {
      headline: "没有造成实际损失，也为下一次做好了准备",
      description:
        "张三确认自己的账户中没有未经授权的交易。他把这条钓鱼短信报告给了 Scamwatch，对方也标记了相关号码。整个处理过程不到一小时。更重要的是，当他下一次再收到类似的快递短信时，他已经知道该如何判断真假，也不会再贸然点击。"
    },
    takeaway: {
      items: [
        "只点击钓鱼链接而没有输入信息，通常风险较低，但事后留意账户仍然是明智的。",
        "澳大利亚邮政绝不会通过短信要求你提供银行卡信息。",
        "一旦感觉不对劲，先停下来再核实，即使只多花几秒钟，也可能避免真正的损失。",
        "向 Scamwatch 举报诈骗，有助于保护其他人不再收到同样的信息。",
        "更改密码并屏蔽发件人，是成本很低但很有效的后续预防措施。"
      ]
    }
  },
  "ching-refund": {
    persona: {
      background: "来澳洲度假两周的上班族"
    },
    situation:
      "旅行购物时，Ching 走进了一家商店，店门口和店内显眼位置都写着很大的“UGG”字样。她因此以为自己买到的是大家熟悉的那个品牌。\n\n付款之后，她才注意到，产品标签上真正的品牌名称用很小的字体印在一旁，和她原本理解的品牌并不一样。\n\n她还觉得，这双靴子的材质和做工与这个价位不太相符。回到店里要求退款时，店员拒绝了她，并坚持称商品已经“写得很清楚”。\n\n谈话变得越来越不愉快。Ching 需要决定，自己是否值得再花更多时间继续争执。她不想让剩下的假期都被这件事影响，但也不愿意就这样接受损失。",
    riskLabel: "值得争取，但要权衡现实成本",
    riskHeadline: "如果商品展示或描述确实具有误导性，澳大利亚消费者法可能支持你的主张。",
    riskExplanation:
      "根据澳大利亚消费者法，商家不能用会造成错误印象的方式展示商品，包括商品的性质、来源或品质。如果店内显著的品牌展示与实际售卖商品并不一致，这可能构成误导性行为。但对短期游客来说，更现实的问题往往是：如何在不打乱行程的情况下继续维权。信用卡拒付或正式投诉，都可能在离开澳洲后继续推进。",
    actionCards: [
      {
        id: "signals",
        number: "1",
        eyebrow: "她注意到什么",
        title: "警示信号",
        items: [
          "商店用醒目的“UGG”招牌吸引顾客，但商品上的实际品牌名称完全不同，而且字体很小。",
          "产品材质和做工与她期待的品质及价格不符。",
          "商家拒绝承认展示方式可能具有误导性，也拒绝退款。"
        ]
      },
      {
        id: "actions",
        number: "2",
        eyebrow: "她接着做了什么",
        title: "立即采取的行动",
        items: [
          "保留商品和包装原状，不再继续使用。",
          "拍下店铺招牌、商品标签和收据的对照照片。",
          "联系信用卡公司，询问是否可以发起拒付流程。",
          "向 NSW Fair Trading 提交投诉，说明商店展示方式具有误导性。"
        ],
        ordered: true
      },
      {
        id: "evidence",
        number: "3",
        eyebrow: "她保留了什么",
        title: "保留的证据",
        items: [
          "店内显著“UGG”招牌与商品实际标签的对照照片。",
          "包含日期、金额和商店信息的购物收据。",
          "信用卡交易记录。",
          "一份简单的时间线，记录购买经过、发现问题的时刻以及退款被拒的过程。"
        ]
      },
      {
        id: "escalation",
        number: "4",
        eyebrow: "她如何升级处理",
        title: "升级处理路径",
        items: [
          "通过信用卡公司发起拒付，并附上照片和误导展示的书面说明。",
          "通过在线表单向 NSW Fair Trading 正式投诉。",
          "为了不再消耗旅行时间，她决定不再回店里现场交涉，而是远程继续处理。"
        ]
      }
    ],
    outcome: {
      headline: "通过拒付拿回退款，也没有再耗掉更多假期时间",
      description:
        "Ching 的信用卡公司在审核证据后接受了拒付申请。整个流程花了几周时间，但不需要她再回店里处理。她提交给 NSW Fair Trading 的投诉也被记录下来，成为有关该商家的投诉模式的一部分。她没有再因为这件事打乱行程，并在回国后顺利收到了退款。"
    },
    takeaway: {
      items: [
        "根据澳大利亚消费者法，商品展示和品牌信息不能制造错误印象，即使细小标签看起来“技术上没错”。",
        "对于无法频繁回店处理的游客来说，信用卡拒付是很实用的工具。",
        "把店铺招牌与商品真实标签拍在同一组证据里，往往非常有说服力。",
        "特别是在旅行中，权衡时间、精力和情绪成本，是很合理的决定。",
        "即使个案金额不算特别大，向 Fair Trading 投诉仍然有价值，因为它会累积成监管线索。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "mrs-wang-heater": {
    persona: {
      background: "退休人士，在澳洲探亲"
    },
    situation:
      "王女士在天气变冷时住在女儿家里。一次帮家里采购时，她在附近商店买了一台便携取暖器。\n\n第一次使用时，她闻到一股明显的塑料味，同时感觉外壳发热得异常厉害，远远超出她的预期。\n\n这让她感到不安，但她又不确定这是新取暖器刚开始使用时的正常现象、质量一般的表现，还是一个真正的安全隐患。\n\n由于英语能力有限，视力也不太好，她很难仔细阅读产品说明书，也不方便自己上网查资料。她不想给女儿添太多麻烦，但也不愿继续使用一件可能存在危险的电器。",
    riskLabel: "属于安全疑虑，应立即停用并继续核查",
    riskHeadline: "明显的塑料味和外壳过热，可能意味着产品存在缺陷或安全隐患。",
    riskExplanation:
      "对电器来说，异常气味和过热都是公认的警示信号。即使产品还没有正式召回，这类现象也可能意味着制造缺陷、绝缘问题或材料不合格。最安全的做法是立即停止使用，并在继续决定是否退货或投诉之前先核实更多信息。",
    actionCards: [
      {
        id: "signals",
        number: "1",
        eyebrow: "她注意到什么",
        title: "警示信号",
        items: [
          "第一次使用时就出现强烈且持续的塑料味。",
          "机器外壳比预期烫得多，摸上去不舒服。",
          "她对继续使用感到不安，但一开始不确定这是否正常。"
        ]
      },
      {
        id: "actions",
        number: "2",
        eyebrow: "她接着做了什么",
        title: "立即采取的行动",
        items: [
          "立刻停止使用取暖器，并从插座拔掉电源。",
          "把取暖器放到远离家具和窗帘的安全位置。",
          "保留了原包装和收据。",
          "请女儿帮忙联系商店。"
        ],
        ordered: true
      },
      {
        id: "evidence",
        number: "3",
        eyebrow: "她保留了什么",
        title: "保留的证据",
        items: [
          "带有商店名称、日期和产品信息的购物收据。",
          "产品型号和序列号标签的照片。",
          "包装和安全认证标识的照片。",
          "一份简短记录，说明问题是什么、何时发生、使用时的感受。"
        ]
      },
      {
        id: "escalation",
        number: "4",
        eyebrow: "她向哪里求助",
        title: "升级处理路径",
        items: [
          "把收据和照片发给商店，说明取暖器出现塑料味和过热问题。",
          "查看 productsafety.gov.au，确认该型号是否曾发布召回信息。",
          "如果商店拒绝处理，下一步可以联系 ACCC 或州级 Fair Trading。"
        ]
      }
    ],
    outcome: {
      headline: "商店全额退款，同时相关问题也被记录下来",
      description:
        "王女士在女儿的帮助下联系了商店，并提供了收据和产品照片。商店承认产品有问题，很快同意全额退款，也表示会核查该型号是否有类似报告。王女士因此更放心地确认，自己及时停用这个取暖器是正确的，也更有信心在以后识别类似的危险信号。"
    },
    takeaway: {
      items: [
        "当产品在使用过程中让你觉得不安全时，应立刻停止使用，不必等到百分之百确定才行动。",
        "异常气味和明显过热，都是电器产品的常见安全警示。",
        "你可以在 productsafety.gov.au 上查询某个产品是否已经被召回。",
        "即使英语有限，只要拍下产品、收据和型号信息，也足够和商店进行清楚沟通。",
        "如果商店不愿处理，ACCC 和各州 Fair Trading 都能受理产品安全投诉。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "simon-wang-bond": {
    persona: {
      background: "在悉尼读书的国际学生"
    },
    situation:
      "搬离租住房后，Simon 收到通知，说他的押金里有一部分会因为“清洁问题”被扣除。\n\n这让他非常意外，因为他在搬走前花了很多时间打扫，也一直认为自己已经把房子整理得很干净。\n\nSimon 没有立刻回应，而是先试着弄清楚情况。他重新翻看了租赁合同，也上网查了相关信息。\n\n虽然他平时日常英语没什么问题，但遇到正式条款和法律表达时，就很难判断这些扣款在当地规则下到底是否合理。\n\n他不确定自己是否应该为了避免冲突而接受扣款，还是说自己其实有理由提出异议。",
    riskLabel: "值得争议，先弄清楚自己的位置",
    riskHeadline: "押金扣款必须合理且有证据支持。租客有权对不公平的扣款提出争议。",
    riskExplanation:
      "在澳大利亚大多数州，房东不能在没有适当理由的情况下随意扣押金。清洁费用只有在房屋状况比“正常使用造成的合理损耗”更差时才可能成立。租住开始和结束时的 condition report 是最关键的文件。如果扣款看起来不合理，租客可以通过州里的押金机构或仲裁庭正式提出争议。",
    actionCards: [
      {
        id: "signals",
        number: "1",
        eyebrow: "他注意到什么",
        title: "警示信号",
        items: [
          "扣款理由很模糊，只写了“清洁”，没有具体指出哪里不合格。",
          "他搬走前已经做了充分清洁，也有照片可以证明当时状况。",
          "对方提出的金额高于他认为合理的清洁成本。"
        ]
      },
      {
        id: "actions",
        number: "2",
        eyebrow: "他接着做了什么",
        title: "立即采取的行动",
        items: [
          "没有立刻同意扣款，而是要求房东书面说明明细。",
          "把入住和退租的 condition report 对照起来逐项查看。",
          "重新阅读租约，确认自己真正需要承担的清洁义务。",
          "起草书面回复，说明为什么他认为这项扣款不合理。"
        ],
        ordered: true
      },
      {
        id: "evidence",
        number: "3",
        eyebrow: "他保留了什么",
        title: "保留的证据",
        items: [
          "入住时的 condition report，以及相关照片（如有）。",
          "搬出当天拍摄的房屋照片，显示清洁后的实际状态。",
          "标出相关条款的租赁合同副本。",
          "与房东或中介关于扣款问题的书面沟通记录。"
        ]
      },
      {
        id: "escalation",
        number: "4",
        eyebrow: "他如何升级处理",
        title: "升级处理路径",
        items: [
          "把入住/退租 condition report 和照片一起提交给房东，书面说明扣款没有依据。",
          "如果房东不接受，下一步可以向 NSW Rental Bond Board 提出争议，或向 NCAT 申请处理。",
          "当地社区法律中心也可以提供免费的租房法律建议。"
        ]
      }
    ],
    outcome: {
      headline: "在清楚、基于证据的回复后，大部分扣款被退回",
      description:
        "Simon 向房东发送了一份书面回复，把入住和退租时的 condition report 以及自己搬离当天拍摄的照片放在一起进行说明。他指出，房屋状态属于合理使用范围内的正常状况。房东在查看证据后，同意退回大部分原本打算扣除的金额。整个过程持续了大约一周的邮件往来。Simon 觉得，清晰的证据和冷静、事实导向的表达起到了关键作用。"
    },
    takeaway: {
      items: [
        "如果你不确定押金扣款是否公平，不要立刻同意，先要求对方给出明细。",
        "入住和退租时的 condition report 是押金争议中最重要的文件。",
        "“合理损耗”指的是正常使用下自然产生的磨损，房东不能据此收费。",
        "书面沟通比口头争论更有效，也能留下清楚记录。",
        "如果房东不愿意解决，州押金机构和仲裁庭提供正式、成本较低的争议处理渠道。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "fake-job-text": {
    persona: {
      background: "打工度假签证持有者"
    },
    situation: "Maria 在 WhatsApp 上收到一条消息，对方自称是招聘人员，提供一份工资很高、内容却非常简单的线上工作。",
    riskLabel: "高风险，应立即停止接触",
    riskHeadline: "求职过程中如果被要求先付钱，是非常危险的红旗。",
    riskExplanation: "正规的雇主不会要求候选人为培训、账号开通或入职流程先支付费用。",
    outcome: {
      headline: "拉黑对方，成功避免了经济损失",
      description: "Maria 搜索了这位“招聘人员”的名字，随后在网上找到多条警告信息。"
    },
    takeaway: {
      items: [
        "如果一份工作看起来好得不真实，那它大概率就不真实。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "tax-office-call": {
    persona: {
      background: "大学生"
    },
    situation: "David 接到一通自动语音电话，随后被转接给一名所谓的“工作人员”，对方声称他的税务出了严重问题。",
    riskLabel: "高风险，立即挂断",
    riskHeadline: "政府机构绝不会要求你用礼品卡付款。",
    riskExplanation: "ATO 和警方都不会通过电话要求你立刻付款，更不会接受礼品卡。",
    outcome: {
      headline: "挂断电话，并通过正规渠道完成核实",
      description: "David 挂断电话后登录自己的 myGov 账户，确认税务状态一切正常。"
    },
    takeaway: {
      items: [
        "ATO 绝不会要求你用礼品卡支付任何费用。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "rental-scam-fb": {
    persona: {
      background: "国际学生"
    },
    situation: "Elena 在 Facebook Marketplace 上看到一套看起来非常理想的公寓，对方随后要求她在看房前先转押金。",
    riskLabel: "高风险，不要转账",
    riskHeadline: "在没有看房的情况下先付押金，本身就是高风险行为。",
    riskExplanation: "诈骗者经常盗用真实房源的照片，制作虚假的租房广告来骗取押金。",
    outcome: {
      headline: "避开了一次高额金钱陷阱",
      description: "Elena 坚持要求进行视频看房，对方拒绝后，她把这条房源信息举报了。"
    },
    takeaway: {
      items: [
        "在看房之前，永远不要先支付押金。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "broken-laptop": {
    persona: {
      background: "本地居民"
    },
    situation: "Tom 的新笔记本电脑屏幕开始闪烁，但商店却声称这是人为损坏。",
    riskLabel: "值得继续追究，维护你的法定权利",
    riskHeadline: "消费者保障应在合理时间内适用。",
    riskExplanation: "零售商不能用简单一句“不是我们的问题”就回避制造缺陷。",
    outcome: {
      headline: "成功获得免费维修",
      description: "Tom 引用了 ACCC 关于消费者保障的说明作为依据。"
    },
    takeaway: {
      items: [
        "零售商不能忽视法定消费者保障。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "gym-membership-cancel": {
    persona: {
      background: "上班族"
    },
    situation: "Sarah 搬到外州后取消了健身房会员，但扣费仍在继续。",
    riskLabel: "低风险，通常可解决",
    riskHeadline: "未经授权的持续扣费可以被撤销。",
    riskExplanation: "如果你有取消记录，商家就无权继续从你的账户中扣款。",
    outcome: {
      headline: "银行发起了拒付处理",
      description: "Sarah 向银行提交了取消会员的邮件记录。"
    },
    takeaway: {
      items: [
        "取消订阅时，最好始终保留书面记录。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "mold-ignored": {
    persona: {
      background: "学生"
    },
    situation: "Anita 发现卧室天花板上的黑色霉菌越来越严重，但房东一直没有处理。",
    riskLabel: "健康相关问题，应要求维修",
    riskHeadline: "房东有义务维护房屋达到可居住标准。",
    riskExplanation: "如果霉菌来自房屋结构或维修问题，责任通常不在租客。"
    ,
    outcome: {
      headline: "维修要求最终被正式推进",
      description: "Anita 发出了正式的违约通知（Notice of Breach）。"
    },
    takeaway: {
      items: [
        "由房屋结构问题引起的霉菌，不应由租客承担责任。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "rent-increase-notice": {
    persona: {
      background: "自由设计师"
    },
    situation: "James 收到一封邮件，通知他的房租即将上涨。",
    riskLabel: "可以争议，关键在于通知期是否合法",
    riskHeadline: "房租上涨必须遵守正式通知要求。",
    riskExplanation: "房东或中介不能仅靠非正式邮件就随意提高租金。",
    outcome: {
      headline: "涨租被推迟执行",
      description: "James 指出了必须提前 60 天通知的法定要求。"
    },
    takeaway: {
      items: [
        "对于涨租这类事项，普通邮件往往不等于已经满足法律上的正式通知要求。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  },
  "water-leak-repair": {
    persona: {
      background: "四口之家"
    },
    situation: "Wei 家的浴室水管爆裂，但那天是周末，中介处于关闭状态。",
    riskLabel: "紧急情况，应先防止损失扩大",
    riskHeadline: "租客在紧急维修情况下可以自行授权处理。",
    riskExplanation: "法律通常允许租客在一定金额范围内先自行安排紧急维修。",
    outcome: {
      headline: "维修费用获得全额报销",
      description: "Wei 联系了水管工处理问题，并妥善保存了发票。"
    },
    takeaway: {
      items: [
        "提前了解紧急维修的金额上限和规则，会让你在真正出事时更有把握。"
      ],
      relatedGuideLabel: "查看更多案例"
    }
  }
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
      cases: base.cases.map((caseItem) => {
        const translation = CASE_TRANSLATIONS_ZH[caseItem.id];

        return {
          ...caseItem,
          categoryLabel: CASE_CATEGORY_LABEL_ZH[caseItem.category] ?? caseItem.categoryLabel,
          title: CASE_TITLE_ZH[caseItem.id] ?? caseItem.title,
          summary: CASE_SUMMARY_ZH[caseItem.id] ?? caseItem.summary,
          persona: {
            ...caseItem.persona,
            ...translation?.persona
          },
          situation: translation?.situation ?? caseItem.situation,
          riskLabel: translation?.riskLabel ?? caseItem.riskLabel,
          riskHeadline: translation?.riskHeadline ?? caseItem.riskHeadline,
          riskExplanation: translation?.riskExplanation ?? caseItem.riskExplanation,
          actionCards: translation?.actionCards ?? caseItem.actionCards,
          outcome: {
            ...caseItem.outcome,
            ...translation?.outcome
          },
          takeaway: {
            ...caseItem.takeaway,
            ...translation?.takeaway,
            relatedGuideLabel:
              translation?.takeaway?.relatedGuideLabel ??
              (caseItem.category === "scam" ? "想判断你自己的情况吗？" : "想查看适合你情况的指南吗？")
          }
        };
      })
    };
  })()
};

export function getCasesPageContent(locale: AppLocale = DEFAULT_LOCALE): CasesPageContent {
  return CASES_CONTENT_BY_LOCALE[locale] ?? CASES_CONTENT_BY_LOCALE[DEFAULT_LOCALE];
}

export function getCaseById(content: CasesPageContent, caseId: string): SuccessCase | undefined {
  return content.cases.find((c) => c.id === caseId);
}
