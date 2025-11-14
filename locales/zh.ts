// locales/zh.ts
export const zh = {
  appName: "健康生活助手",
  languageSwitch: "English",
  calorieCalculator: "个人档案", // Now used for profile form title
  age: "年龄 (岁)",
  gender: "性别",
  male: "男",
  female: "女",
  height: "身高 (厘米)",
  weight: "体重 (千克)",
  // Removed activity level related strings
  // activityLevel: "活动水平",
  // sedentary: "久坐不动 (很少或不运动)",
  // lightlyActive: "轻度活跃 (每周运动1-3天)",
  // moderatelyActive: "中度活跃 (每周运动3-5天)",
  // veryActive: "高度活跃 (每周运动6-7天)",
  // superActive: "超级活跃 (每天剧烈运动或体力工作)",

  // Profile management
  profileManagerTitle: "用户档案管理",
  createNewProfile: "创建新档案",
  selectProfile: "选择档案", // Keep for button text when not selected
  activeProfile: "当前档案:",
  noProfileSelected: "未选择档案。",
  profileName: "档案名称",
  enterProfileName: "输入档案名称",
  addProfile: "添加档案",
  updateProfile: "更新档案",
  deleteProfile: "删除档案",
  confirmDeleteProfile: "您确定要删除档案“{profileName}”吗？",
  maxProfilesReached: "已达到最大档案数量 (3个)。请删除现有档案后再创建。",
  selectProfileLabel: "选择 {profileName} 为活跃档案", // New string for aria-label when not selected
  deselectProfileLabel: "取消选择 {profileName} (当前活跃)", // New string for aria-label 当活跃时

  calculateCalories: "计算基础代谢率 (BMR)", // Updated text for BMR
  calculating: "计算中...",
  yourCalorieNeeds: "您的热量需求 (BMR)", // Updated text
  bmr: "基础代谢率 (BMR):",
  // TDEE removed
  // tdee: "每日总能量消耗 (TDEE):",
  bmrDescription: "您的基础代谢率是身体在静息状态下维持基本生命功能所需的卡路里估算值。",
  // TDEE description removed
  // tdeeDescription: "您的每日总能量消耗是您每天消耗的卡路里估算值，包括体力活动。",

  nutritionAdvisor: "营养建议",
  nutritionAdvisorSubtitle: "从AI获取个性化健康饮食建议。",
  dailyCalorieNeedIs: "您预估的基础代谢率 (BMR) 是:", // Updated text
  calculateCaloriesFirst: "请先选择或创建个人档案以获取个性化建议。", // Updated text
  yourGoal: "您的目标 (例如：减肥、增肌、保持健康)",
  goalPlaceholder: "例如：减肥、提高精力",
  dietaryPreferences: "饮食偏好/限制 (例如：素食、低碳水、不含乳制品)",
  dietaryPlaceholder: "例如：素食、无麸质、不含坚果",
  getAdvice: "获取健康饮食建议",
  gettingAdvice: "获取建议中...",
  advicePlaceholder: "请先选择或创建个人档案。", // Updated text
  personalizedAdvice: "您的个性化建议:",
  apiBillingLink: "了解 Gemini API 计费。",
  alertApiKey: "请选择一个API密钥以使用此功能。",
  alertApiIssue: "API密钥或模型似乎存在问题。请确保您的API密钥配置正确并重试。有关计费的更多信息，请参阅链接。",
  failedToCalculateCalories: "基础代谢率计算失败：", // Updated text
  failedToFetchAdvice: "获取营养建议失败。请重试。",
  foodImageAnalyzerTitle: "食物图片分析器",
  uploadImage: "上传图片",
  captureImage: "拍摄照片",
  analyzeFood: "分析食物",
  analyzingFood: "分析中...",
  imageUploadPlaceholder: "未选择图片。请上传或拍摄一张食物图片。",
  imageAnalysisResult: "食物分析结果",
  estimatedCalories: "预估热量:",
  evaluation: "评价:",
  advice: "饮食建议:",
  noImageSelected: "未选择图片。",
  failedToAnalyzeImage: "分析图片失败。请重试。",
  cameraPermissionDenied: "相机权限被拒绝。请在浏览器设置中允许相机访问以使用此功能。",
  errorGeneric: "发生未知错误。请重试。",
};