// locales/en.ts
export const en = {
  appName: "Healthy Life Assistant",
  languageSwitch: "中文",
  calorieCalculator: "Calorie Calculator", // Now used for profile form title
  age: "Age (years)",
  gender: "Gender",
  male: "Male",
  female: "Female",
  height: "Height (cm)",
  weight: "Weight (kg)",
  // Removed activity level related strings
  // activityLevel: "Activity Level",
  // sedentary: "Sedentary (little to no exercise)",
  // lightlyActive: "Lightly Active (light exercise 1-3 days/week)",
  // moderatelyActive: "Moderately Active (moderate exercise 3-5 days/week)",
  // veryActive: "Very Active (hard exercise 6-7 days/week)",
  // superActive: "Super Active (very hard exercise & physical job)",
  
  // Profile management
  profileManagerTitle: "User Profiles",
  createNewProfile: "Create New Profile",
  selectProfile: "Select Profile", // Keep for button text when not selected
  activeProfile: "Active Profile:",
  noProfileSelected: "No profile selected.",
  profileName: "Profile Name",
  enterProfileName: "Enter profile name",
  addProfile: "Add Profile",
  updateProfile: "Update Profile",
  deleteProfile: "Delete Profile",
  confirmDeleteProfile: "Are you sure you want to delete profile '{profileName}'?",
  maxProfilesReached: "Maximum of 3 profiles reached. Please delete an existing profile to create a new one.",
  selectProfileLabel: "Select {profileName} as active profile", // New string for aria-label when not selected
  deselectProfileLabel: "Deselect {profileName} (currently active)", // New string for aria-label when active

  calculateCalories: "Calculate BMR", // Updated text for BMR
  calculating: "Calculating...",
  yourCalorieNeeds: "Your Calorie Needs (BMR)", // Updated text
  bmr: "Basal Metabolic Rate (BMR):",
  // TDEE removed
  // tdee: "Total Daily Energy Expenditure (TDEE):",
  bmrDescription: "Your BMR is the estimated number of calories your body needs at rest to perform basic life-sustaining functions.",
  // TDEE description removed
  // tdeeDescription: "Your TDEE is the estimated number of calories you burn each day, including physical activity.",
  
  nutritionAdvisor: "Nutrition Advisor",
  nutritionAdvisorSubtitle: "Get personalized healthy eating advice from AI.",
  dailyCalorieNeedIs: "Your estimated BMR is:", // Updated text
  calculateCaloriesFirst: "Please select or create a profile to get personalized advice.", // Updated text
  yourGoal: "Your Goal (e.g., lose weight, gain muscle, maintain health)",
  goalPlaceholder: "e.g., lose weight, improve energy",
  dietaryPreferences: "Dietary Preferences/Restrictions (e.g., vegetarian, low-carb, no dairy)",
  dietaryPlaceholder: "e.g., vegetarian, gluten-free, no nuts",
  getAdvice: "Get Healthy Eating Advice",
  gettingAdvice: "Getting Advice...",
  advicePlaceholder: "Please select or create a profile first.", // Updated text
  personalizedAdvice: "Your Personalized Advice:",
  apiBillingLink: "Learn about Gemini API billing.",
  alertApiKey: "Please select an API key to use this feature.",
  alertApiIssue: "It seems there was an issue with the API key or model. Please ensure your API key is correctly configured and try again. See billing link for more info.",
  failedToCalculateCalories: "Failed to calculate BMR:", // Updated text
  failedToFetchAdvice: "Failed to fetch nutrition advice. Please try again.",
  foodImageAnalyzerTitle: "Food Image Analyzer",
  uploadImage: "Upload Image",
  captureImage: "Capture Image",
  analyzeFood: "Analyze Food",
  analyzingFood: "Analyzing Food...",
  imageUploadPlaceholder: "No image selected. Upload or capture an image of your food.",
  imageAnalysisResult: "Food Analysis Result",
  estimatedCalories: "Estimated Calories:",
  evaluation: "Evaluation:",
  advice: "Dietary Advice:",
  noImageSelected: "No image selected.",
  failedToAnalyzeImage: "Failed to analyze image. Please try again.",
  cameraPermissionDenied: "Camera permission denied. Please allow camera access in your browser settings to use this feature.",
  errorGeneric: "An unexpected error occurred. Please try again.",
};