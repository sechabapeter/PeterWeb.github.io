import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    public permission: Permission;

    constructor() {

        this.permission = this.isSupported() ? 'default' : 'denied';
    }
    public isSupported(): boolean {
        return 'Notification' in window;
    }
    requestPermission(): void {
        const self = this;
        if ('Notification' in window) {
            Notification.requestPermission((status) => self.permission = status);
        }
    }
    create(title: string, options?: PushNotification): any {
        const self = this;
        return new Observable((obs) => {
            if (!('Notification' in window)) {
                console.log('Notifications are not available in this environment');
                obs.complete();
            }
            if (self.permission !== 'granted') {
                console.log('The user hasn\'t granted you permission to send push notifications');
                obs.complete();
            }
            const notify = new Notification(title, options);
            notify.onshow = (e) => {
                return obs.next({
                    notification: notify,
                    event: e
                });
            };
            notify.onclick = (e) => {
                return obs.next({
                    notification: notify,
                    event: e
                });
            };
            notify.onerror = (e) => {
                return obs.error({
                    notification: notify,
                    event: e
                });
            };
            notify.onclose = () => {
                return obs.complete();
            };
        });
    }
    generateNotification(source: Array<any>): void {
        const self = this;
        source.forEach((item) => {
            const options = {
                body: item.alertContent,
                icon: 'https://tradinginsider.fr/wp-content/uploads/2018/03/Accenture-Javelin-Strategy-Logo.png ',
                vibrate: [100, 50, 100],
                to: '1:649002536133:web:6b3eae045a74bead',
                onClick: () => {
                    window.focus();
                }
            };
            const notify = self.create(item.title, options).subscribe();
        });
    }
}
export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
    body?: string;
    icon?: string;
    tag?: string;
    data?: any;
    renotify?: boolean;
    silent?: boolean;
    sound?: string;
    noscreen?: boolean;
    sticky?: boolean;
    dir?: 'auto' | 'ltr' | 'rtl';
    lang?: string;
    vibrate?: number[];
}
