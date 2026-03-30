export type OnboardingData = {
  diets: string;
  allergies: string[];
  cuisines: string[];
  goal: string;
};

export type StepProps = {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
};
