import { FinalDay } from './final-day';

export class FinalDiet {
    idDiet: number;
    finalDays: FinalDay[];

    constructor(idDiet: number, finalDays: FinalDay[]) {
        this.idDiet = idDiet;
        this.finalDays = finalDays;
    }
}
