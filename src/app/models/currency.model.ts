export interface CurrencyModel {
  Cur_Abbreviation?: string;
  Cur_Code?: string;
  Cur_DateEnd?: string;
  Cur_DateStart?: string;
  Cur_ID?: number;
  Cur_Name?: string;
  Cur_NameMulti?: string;
  Cur_Name_Bel?: string;
  Cur_Name_BelMulti?: string;
  Cur_Name_Eng?: string;
  Cur_Name_EngMulti?: string;
  Cur_ParentID?: number;
  Cur_Periodicity?: number;
  Cur_QuotName?: string;
  Cur_QuotName_Bel?: string;
  Cur_QuotName_Eng?: string;
  Cur_Scale?: number;
  Cur_OfficialRate?: number;
}

export interface DbModel {
  amount: number;
  title: string;
  category: string;
  currency: string;
  date: string;
}
