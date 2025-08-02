// App constants
export const APP_NAME = 'Muzz';

export const ROUTES = {
  HOME: 'home' as const,
  CHAT: 'chat' as const,
  PROFILE: 'profile' as const,
} as const;

export const MESSAGE_STATUS = {
  SENDING: 'sending' as const,
  SENT: 'sent' as const,
  DELIVERED: 'delivered' as const,
  READ: 'read' as const,
} as const;

export const WEBSOCKET_CONFIG = {
  URL: 'http://localhost:3001',
  TYPING_TIMEOUT: 1500,
  MESSAGE_GROUP_TIMEOUT: 20, // seconds
} as const;

export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#e8506e',
    PRIMARY_HOVER: '#cc3d59',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const;
