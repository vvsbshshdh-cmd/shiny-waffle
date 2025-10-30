import { Runtime } from 'webextension-polyfill-ts';

export const sendMessage = <T>(message: T): Promise<any> => {
    return new Promise((resolve, reject) => {
        Runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(response);
            }
        });
    });
};

export const onMessage = (callback: (message: any, sender: Runtime.MessageSender, sendResponse: (response?: any) => void) => void) => {
    Runtime.onMessage.addListener((message, sender, sendResponse) => {
        callback(message, sender, sendResponse);
        return true; // Indicates that the response will be sent asynchronously
    });
};