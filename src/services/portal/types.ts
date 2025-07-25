export interface IUserInfo {
  user_id: string;
  user_name: string;
  picture_url?: string;
  permissions?: string[] | null;
  env: string;
  phone: string;
  tenant_id: number;
  account_type: number;
  product_id?: number;
  account_name: string;
  app_id: number;
  app_names: string[];
  handle_id: number;
  ip: string;
  nonce: number;
  open_id: string;
  org_list: string[];
  token_md5: string;
  token_version: string | null;
  user_xh_id: string;
}
