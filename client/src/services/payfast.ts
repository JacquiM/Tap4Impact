import { ENV_CONFIG } from '../config/environment';

export interface DonorInfo {
  name: string;
  email: string;
}

export interface RecurringDonorInfo extends DonorInfo {
  amount: number;
  frequency: string;
}

class PayFastService {
    async processSinglePayment(
      amount: number,
      donorInfo: DonorInfo,
      itemDescription: string = 'Donation'
    ): Promise<void> {
      try {
        // Step 1: Prepare payload for signature
        const payload = {
          name_first: donorInfo.name.trim(),
          email_address: donorInfo.email.trim(),
          amount: amount.toFixed(2).replace('.', ',')
        };

        // Step 2: Call backend to get signature for single payment
        const signatureEndpoint = 'https://tap4functions-f5cxaebacke5etbu.southafricanorth-01.azurewebsites.net/api/GenerateSingleSignature?code=I_2sMdkLcMos3ixlowrcBqjv8kvTS8z0fN3xHE2YFH0LAzFu93m4VQ==';
        let response;
        try {
          response = await fetch(signatureEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (fetchError) {
          console.error('❌ Network error calling GenerateSingleSignature:', fetchError);
          throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Failed to fetch'}`);
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Signature endpoint error:', errorText);
          throw new Error(`Failed to get signature: ${response.status} - ${errorText}`);
        }

        const { signature } = await response.json();
        console.log('✅ Received single payment signature:', signature);
        debugger;
        // Step 3: Build form data for PayFast
        const formData = {
          merchant_id: ENV_CONFIG.PAYFAST_MERCHANT_ID,
          merchant_key: ENV_CONFIG.PAYFAST_MERCHANT_KEY,
          return_url: "https://tap4impact.co.za",
          cancel_url: "https://tap4impact.co.za",
          name_first: donorInfo.name.trim(),
          email_address: donorInfo.email.trim(),
          amount: amount.toFixed(2),
          item_name: "Donation",
          currency: "ZAR"
        };

        this.submitPaymentForm(formData);
      } catch (error) {
        console.error('❌ Single payment initiation failed:', error);
        throw error;
      }
    }
  private azureFunctionUrl = 'https://tap4functions-f5cxaebacke5etbu.southafricanorth-01.azurewebsites.net/api/GetSigniture?code=I_2sMdkLcMos3ixlowrcBqjv8kvTS8z0fN3xHE2YFH0LAzFu93m4VQ==';

  async processRecurringPayment(
    amount: number,
    frequency: string,
    donorInfo: RecurringDonorInfo,
    itemDescription: string = 'Monthly Donation'
  ): Promise<void> {
    try {
      // Step 1: Calculate billing date (tomorrow)
      const billingDate = new Date();
      billingDate.setDate(billingDate.getDate() + 1);
      const billing_date = billingDate.toISOString().split('T')[0];

      // Format amounts: comma for Azure, period for PayFast
      const amountForAzure = amount.toFixed(2).replace('.', ','); // "315,00"
      const amountForPayFast = amount.toFixed(2); // "315.00"

      // Step 2: Call Azure Function to get signature
      const azurePayload = {
        name_first: donorInfo.name.trim(),
        email_address: donorInfo.email.trim(),
        amount: amountForAzure,
        billing_date: billing_date
      };
      
      console.log('📞 Calling Azure Function with payload:', azurePayload);
      console.log('🔗 Azure Function URL:', this.azureFunctionUrl);
      
      let response;
      try {
        response = await fetch(this.azureFunctionUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(azurePayload)
        });
      } catch (fetchError) {
        console.error('❌ Network error calling Azure Function:', fetchError);
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Failed to fetch'}`);
      }

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Azure Function error:', errorText);
        throw new Error(`Failed to get signature from Azure Function: ${response.status} - ${errorText}`);
      }

      const { signature } = await response.json();
      console.log('✅ Received signature from Azure:', signature);

      // Step 3: Build complete PayFast form data
      const formData = {
        merchant_id: ENV_CONFIG.PAYFAST_MERCHANT_ID,
        merchant_key: ENV_CONFIG.PAYFAST_MERCHANT_KEY,
        return_url: "https://tap4impact.co.za",
        cancel_url: "https://tap4impact.co.za",
        name_first: donorInfo.name.trim(),
        email_address: donorInfo.email.trim(),
        amount: amountForPayFast,
        item_name: "Monthly Donation",
        subscription_type: "1",
        billing_date: billing_date,
        recurring_amount: amountForPayFast,
        frequency: "3",
        cycles: "0",
        signature: signature
      };

      console.log('📋 Form data being sent to PayFast:', formData);

      // Step 4: Submit to PayFast
      this.submitPaymentForm(formData);
    } catch (error) {
      console.error('❌ Payment initiation failed:', error);
      throw error;
    }
  }

  private submitPaymentForm(formData: Record<string, string>): void {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = ENV_CONFIG.PAYFAST_MODE === 'sandbox'
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    console.log('🚀 Submitting to PayFast...');
    form.submit();
  }
}

export const payFastService = new PayFastService();
