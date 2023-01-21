import { FinalIngredient } from './final-ingredient';

export class FinalMeal {
    idFinalMeal: number;
    name: string;
    finalIngredients: Array<FinalIngredient>;
    
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    percentOfDay: number | null;
    imageUrl: string | undefined;

    percentModified: boolean = false;

    constructor(id: number, name: string, finalIngredients: Array<FinalIngredient>, calories: number, protein: number, fats: number, carbs: number, percentOfDay: number) {
        this.idFinalMeal = id;
        this.name = name;
        this.finalIngredients = finalIngredients;
        this.calories = calories;
        this.protein = protein;
        this.fats = fats;
        this.carbs = carbs;
        this.percentOfDay = percentOfDay;
    }
}