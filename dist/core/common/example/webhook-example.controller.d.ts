export declare class WebhookExampleController {
    paymentWebhook(paymentData: any): Promise<{
        status: string;
        message: string;
    }>;
    notificationWebhook(notificationData: any): Promise<{
        status: string;
        message: string;
    }>;
    getWebhookStatus(): Promise<{
        status: string;
        endpoints: string[];
    }>;
}
