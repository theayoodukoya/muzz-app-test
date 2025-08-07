export declare const APP_NAME = "Muzz";
export declare const ROUTES: {
    readonly HOME: "home";
    readonly CHAT: "chat";
    readonly PROFILE: "profile";
};
export declare const MESSAGE_STATUS: {
    readonly SENDING: "sending";
    readonly SENT: "sent";
    readonly DELIVERED: "delivered";
    readonly READ: "read";
};
export declare const WEBSOCKET_CONFIG: {
    readonly URL: "http://localhost:3001";
    readonly TYPING_TIMEOUT: 1500;
    readonly MESSAGE_GROUP_TIMEOUT: 20;
};
export declare const UI_CONFIG: {
    readonly COLORS: {
        readonly PRIMARY: "#e8506e";
        readonly PRIMARY_HOVER: "#cc3d59";
    };
    readonly BREAKPOINTS: {
        readonly SM: "640px";
        readonly MD: "768px";
        readonly LG: "1024px";
        readonly XL: "1280px";
    };
};
