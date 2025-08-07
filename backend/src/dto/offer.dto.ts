export interface CreateOfferDto{
    name: string;
    startDate: Date;
    endDate: Date;
    discount: number;
}

export interface OfferDto{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    discount: number;
}