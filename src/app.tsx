import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async (): Promise<API.CurrentUser | undefined> => {
    return { name: 'Guest', access: 'guest' };
  };

  return {
    fetchUserInfo,
    currentUser: { name: 'Guest', access: 'guest' },
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    actionsRender: () => [],
    menuHeaderRender: undefined,
    footerRender: false,
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  timeout: 30000,
};
