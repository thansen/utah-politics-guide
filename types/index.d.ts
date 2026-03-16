export namespace API {
  /** GET /api/currentUser */
  export type GET_API_CURRENT_USER_QUERY = {
    /** example:  123 */
    token: string;
  };

  export type GET_API_CURRENT_USER_PAYLOAD = Record<string, any>;

  export type GET_API_CURRENT_USER_RES = {
    /** example: {"name": "Serati Ma", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png", "userid": "00000001", "email": "antdesign@alipay.com", "signature": "All rivers run into the sea", "title": "Interaction Expert", "group": "Ant Financial - Business Group - Platform Dept - Tech Dept - UED", "tags": [{"key": "0", "label": "Creative"}, {"key": "1", "label": "Design Focused"}, {"key": "2", "label": "Spicy"}, {"key": "3", "label": "Tall"}, {"key": "4", "label": "Adventurous"}, {"key": "5", "label": "Open-minded"}], "notifyCount": 12, "unreadCount": 11, "country": "China", "geographic": {"province": {"label": "Zhejiang", "key": "330000"}, "city": {"label": "Hangzhou", "key": "330100"}}, "address": "77 Gongzhuan Road, Xihu District", "phone": "0752-268888888"} */
    data: {
      name: string;
      avatar: string;
      userid: string;
      email: string;
      signature: string;
      title: string;
      group: string;
      tags: {
        key: string;
        label: string;
      }[];
      notifyCount: number;
      unreadCount: number;
      country: string;
      geographic: {
        province: {
          label: string;
          key: string;
        };
        city: {
          label: string;
          key: string;
        };
      };
      address: string;
      phone: string;
    };
  };

  /** GET /api/rule */
  export type GET_API_RULE_QUERY = {
    /** example:  123 */
    token: string;
    /** example: 1 */
    current: string;
    /** example: 20 */
    pageSize: string;
  };

  export type GET_API_RULE_PAYLOAD = Record<string, any>;

  export type GET_API_RULE_RES = {
    /** example: [{"key": 99, "disabled": false, "href": "https://ant.design", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png", "name": "TradeCode 99", "owner": "Lily", "desc": "This is a description", "callNo": 503, "status": "0", "updatedAt": "2022-12-06T05:00:57.040Z", "createdAt": "2022-12-06T05:00:57.040Z", "progress": 81}] */
    data: {
      key: number;
      disabled: boolean;
      href: string;
      avatar: string;
      name: string;
      owner: string;
      desc: string;
      callNo: number;
      status: string;
      updatedAt: string;
      createdAt: string;
      progress: number;
    }[];
    /** example: 100 */
    total: number;
    /** example: true */
    success: boolean;
    /** example: 20 */
    pageSize: number;
    /** example: 1 */
    current: number;
  };

  /** POST /api/login/outLogin */
  export type POST_API_LOGIN_OUT_LOGIN_QUERY = {
    /** example:  123 */
    token: string;
  };

  export type POST_API_LOGIN_OUT_LOGIN_PAYLOAD = Record<string, any>;

  export type POST_API_LOGIN_OUT_LOGIN_RES = {
    /** example: {} */
    data: Record<string, any>;
    /** example: true */
    success: boolean;
  };

  /** POST /api/login/account */
  export type POST_API_LOGIN_ACCOUNT_QUERY = {
    /** example:  123 */
    token: string;
  };

  export type POST_API_LOGIN_ACCOUNT_PAYLOAD = {
    /** example: admin */
    username: string;
    /** example: ant.design */
    password: string;
    /** example: true */
    autoLogin: boolean;
    /** example: account */
    type: string;
  };

  export type POST_API_LOGIN_ACCOUNT_RES = {
    /** example: ok */
    status: string;
    /** example: account */
    type: string;
    /** example: admin */
    currentAuthority: string;
  };
}
