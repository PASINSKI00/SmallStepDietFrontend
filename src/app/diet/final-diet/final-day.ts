import { FinalMeal } from './final-meal';

export class FinalDay {
    idFinalDay: number;
    finalMeals: Array<FinalMeal>;
    calories: number;
    protein: number;
    fats: number;
    carbs: number;

    modified: boolean = false;
    applicableForReset: boolean = false;

    constructor(idFindalDay: number, finalMeals: Array<FinalMeal>, calories: number, protein: number, fats: number, carbs: number) {
        this.idFinalDay = idFindalDay;
        this.finalMeals = finalMeals;
        this.calories = calories;
        this.protein = protein;
        this.fats = fats;
        this.carbs = carbs;
    }
}
