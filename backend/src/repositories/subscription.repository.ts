import Subscription, { ISubscription } from "../models/subscription.model";
import { BaseRepository } from "./base.repository";
import { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository";

export class SubscriptionRepository extends BaseRepository<ISubscription> implements ISubscriptionRepository{
    constructor(){
        super(Subscription)
    }
}