import { FinalDay } from './final-day';

export class FinalDiet {
    idDiet: number;
    finalDays: FinalDay[];

    dietFileUrl: string | undefined;
    shoppingListFileUrl: string | undefined;

    constructor(idDiet: number, finalDays: FinalDay[]) {
        this.idDiet = idDiet;
        this.finalDays = finalDays;
    }
}
