import { FinalMeal } from './final-meal';

export class FinalDay {
    finalMeals: Array<FinalMeal>;
    calories: number;
    protein: number;
    fats: number;
    carbs: number;

    modified: boolean = false;

    constructor(finalMeals: Array<FinalMeal>, calories: number, protein: number, fats: number, carbs: number) {
        this.finalMeals = finalMeals;
        this.calories = calories;
        this.protein = protein;
        this.fats = fats;
        this.carbs = carbs;
    }
}
