// Yoco Payment Service
import { ENV_CONFIG } from '@/config/environment';

declare global {
  interface Window {
    YocoSDK: any;
    yocoSDKLoaded?: boolean;
    yocoSDKError?: string;
  }
}

export interface DonorInfo {
  name: string;
  email: string;
  phone: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  amount: number;
  currency: string;
  donorInfo: DonorInfo;
}

const YOCO_PUBLIC_KEY = ENV_CONFIG.YOCO_PUBLIC_KEY;

export class YocoService {
  private sdk: any = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      // Check if SDK is available
      if (typeof window.YocoSDK === 'undefined') {
        throw new Error('Yoco SDK not loaded. Please check your internet connection and try again.');
      }

      this.sdk = new window.YocoSDK({
        publicKey: YOCO_PUBLIC_KEY,
      });

      this.isInitialized = true;
      console.log('Yoco SDK initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Yoco SDK:', error);
      this.isInitialized = false;
      return false;
    }
  }

  async processPayment(amount: number, donorInfo: DonorInfo): Promise<PaymentResult> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Payment system is currently unavailable. Please check your internet connection and try again.');
      }
    }

    try {
      // Create payment on backend first
      const response = await fetch('/api/yoco/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          metadata: {
            donorName: donorInfo.name,
            donorEmail: donorInfo.email,
            donorPhone: donorInfo.phone,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const paymentData = await response.json();

      // Show Yoco popup
      return new Promise((resolve, reject) => {
        this.sdk.showPopup({
          amountInCents: amount * 100,
          currency: 'ZAR',
          name: 'Tap4Impact Donation',
          description: `Donation to Agri Securitas Trust Fund`,
          callback: async (result: any) => {
            if (result.error) {
              reject(new Error(result.error.message || 'Payment failed'));
              return;
            }

            try {
              // Verify payment on backend
              const verifyResponse = await fetch('/api/yoco/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  paymentId: result.id,
                  donorInfo,
                }),
              });

              if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
              }

              const verifyData = await verifyResponse.json();
              resolve({
                success: true,
                paymentId: result.id,
                amount: amount,
                currency: 'ZAR',
                donorInfo,
              });
            } catch (error) {
              reject(error);
            }
          },
        });
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  getSDKStatus(): { loaded: boolean; initialized: boolean; error?: string } {
    return {
      loaded: typeof window.YocoSDK !== 'undefined',
      initialized: this.isInitialized,
      error: window.yocoSDKError,
    };
  }
}

// Export singleton instance
export const yocoService = new YocoService();
