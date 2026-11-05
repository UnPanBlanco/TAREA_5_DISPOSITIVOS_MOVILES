import type { IAddress } from "./IAddress.model";
import type { ICompany } from "./ICompany.model";

export interface IUser {
    id:       number;
    name:     string;
    username: string;
    email:    string;
    address:  IAddress;
    phone:    string;
    website:  string;
  company: ICompany;

  is_favorite?: boolean;
}
