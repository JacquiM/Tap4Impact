// Yoco Payment Service - Frontend Only with Azure Function
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
  chargeId: string;
  amount: number;
  currency: string;
  donorInfo: DonorInfo;
}

class YocoService {
  private sdk: any = null;
  private isInitialized = false;
  private publicKey: string;
  private azureFunctionUrl: string;

  constructor() {
    this.publicKey = ENV_CONFIG.YOCO_PUBLIC_KEY;
    this.azureFunctionUrl = ENV_CONFIG.YOCO_AZURE_FUNCTION_URL || 'http://localhost:7071/api/ProcessYocoPayment';
  }

  async initialize(): Promise<boolean> {
    try {
      // Check if SDK is available
      if (typeof window.YocoSDK === 'undefined') {
        throw new Error('Yoco SDK not loaded. Please check your internet connection and try again.');
      }

      this.sdk = new window.YocoSDK({
        publicKey: this.publicKey,
      });

      this.isInitialized = true;
      console.log('✅ Yoco SDK initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Yoco SDK:', error);
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
      return new Promise((resolve, reject) => {
        let callbackCalled = false;
        
        // Monitor for the Yoco overlay removal (modal closed)
        const checkModalClosed = setInterval(() => {
          const yocoOverlay = document.querySelector('.yoco-popup-overlay, .yoco-modal, [class*="yoco"]');
          if (!yocoOverlay && !callbackCalled) {
            clearInterval(checkModalClosed);
            console.log('🚫 Yoco modal closed by user');
            reject(new Error('Payment cancelled'));
          }
        }, 500);
        
        // Cleanup interval after 5 minutes
        const timeoutId = setTimeout(() => {
          clearInterval(checkModalClosed);
          if (!callbackCalled) {
            reject(new Error('Payment timed out'));
          }
        }, 300000);
        
        console.log('💳 Showing Yoco payment popup...');
        this.sdk.showPopup({
          amountInCents: amount * 100,
          currency: 'ZAR',
          name: 'Tap4Impact Donation',
          description: `Donation to Agri Securitas Trust Fund`,
          metadata: {
            donorName: donorInfo.name,
            donorEmail: donorInfo.email,
            donorPhone: donorInfo.phone,
          },
          callback: async (result: any) => {
            callbackCalled = true;
            clearInterval(checkModalClosed);
            clearTimeout(timeoutId);
            
            if (result.error) {
              console.error('❌ Yoco popup error:', result.error);
              reject(new Error(result.error.message || 'Payment failed'));
              return;
            }

            try {
              // Step 1: Got payment token from Yoco SDK
              console.log('✅ Received payment token from Yoco:', result.id);

              // Step 2: Send token to Azure Function to process charge
              const azurePayload = {
                token: result.id,
                amountInCents: amount * 100,
                currency: 'ZAR',
                metadata: {
                  donorName: donorInfo.name,
                  donorEmail: donorInfo.email,
                  donorPhone: donorInfo.phone,
                }
              };

              console.log('📞 Calling Azure Function to process Yoco charge...');
              console.log('🔗 URL:', this.azureFunctionUrl);
              console.log('📦 Payload:', azurePayload);

              const response = await fetch(this.azureFunctionUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(azurePayload),
              });

              console.log('📡 Response status:', response.status);

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Payment processing failed' }));
                throw new Error(errorData.error || 'Payment processing failed');
              }

              const chargeResult = await response.json();
              console.log('✅ Charge successful:', chargeResult);

              if (chargeResult.success) {
                resolve({
                  success: true,
                  paymentId: result.id,
                  chargeId: chargeResult.chargeId,
                  amount: amount,
                  currency: 'ZAR',
                  donorInfo,
                });
              } else {
                throw new Error(chargeResult.error || 'Payment was not successful');
              }
            } catch (error: any) {
              console.error('❌ Yoco payment processing error:', error);
              reject(error);
            }
          },
        });
      });
    } catch (error) {
      console.error('❌ Payment processing error:', error);
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
