export interface FavoriteRecipe {
	title: string;
	servings?: string;
	times?: {
	  prepMinutes?: number;
	  cookMinutes?: number;
	  totalMinutes?: number;
	};
	difficulty?: string;
	cuisine?: string;
	ingredients?: Array<{
	  name: string;
	  amount?: string;
	  unit?: string;
	  notes?: string;
	}>;
	steps?: Array<{
	  step: number;
	  description: string;
	  durationMinutes?: number;
	}>;
	nutrition?: {
	  calories?: number;
	  proteinGrams?: number;
	  fatGrams?: number;
	  carbsGrams?: number;
	};
	equipment?: string[];
	tips?: string[];
  }