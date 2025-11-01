import { injectable } from "inversify";
import Otp, { IOtp } from "../models/otp.model";
import { BaseRepository } from "./base.repository";
import { IOtpRepository } from "./interfaces/IOtpRepository";

@injectable()
export class OtpRepository extends BaseRepository<IOtp> implements IOtpRepository {
    constructor(){
        super(Otp)
    }
}