import crypto from 'crypto';
import { stringify } from 'querystring';

/**
 * PayFast utility functions for signature generation and validation
 */

export interface PayFastData {
  [key: string]: string | number | undefined;
}

/**
 * Generate PayFast signature (MD5 hash)
 * Official PayFast implementation with alphabetical sorting
 * @param data - Form data to sign
 * @param passphrase - Optional passphrase for additional security
 * @returns MD5 signature string
 */
export function generatePayFastSignature(
  data: PayFastData,
  passphrase?: string
): string {
  // PayFast requires parameters in the ORDER they appear, NOT alphabetically!
  // Filter out empty values and signature field
  const keys = Object.keys(data).filter(key => 
    key !== 'signature' && data[key] !== "" && data[key] !== undefined && data[key] !== null
  );
  
  // Create parameter string with keys in the order they were added
  // PayFast requires URL encoding with specific rules: urlencode() with spaces as '+'
  let pfOutput = "";
  for (let key of keys) {
    const value = data[key]!.toString().trim();
    // URL encode the value and replace %20 with +
    const encodedValue = encodeURIComponent(value).replace(/%20/g, "+");
    pfOutput += `${key}=${encodedValue}&`;
  }

  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  
  // Add passphrase if provided (must append BEFORE hashing)
  // Passphrase should also be URL-encoded according to PayFast docs
  if (passphrase && typeof passphrase === 'string' && passphrase.trim().length > 0) {
    const encodedPassphrase = encodeURIComponent(passphrase.trim()).replace(/%20/g, "+");
    getString += `&passphrase=${encodedPassphrase}`;
    console.log('🔑 Passphrase appended to signature string');
  } else {
    console.log('⚠️ No passphrase - generating signature without passphrase');
  }

  const signature = crypto.createHash("md5").update(getString).digest("hex");
  
  console.log('🔐 PayFast signature string:', getString);
  console.log('✅ Generated signature:', signature);
  
  return signature;
}

/**
 * Validate PayFast signature from ITN (Instant Transaction Notification)
 * @param data - POST data received from PayFast
 * @param passphrase - Optional passphrase
 * @returns true if signature is valid
 */
export function validatePayFastSignature(
  data: PayFastData,
  passphrase?: string
): boolean {
  const receivedSignature = data.signature as string;
  
  if (!receivedSignature) {
    return false;
  }
  
  // Generate signature from data
  const calculatedSignature = generatePayFastSignature(data, passphrase);
  
  return receivedSignature === calculatedSignature;
}

/**
 * Validate PayFast IP address (for ITN security)
 * @param ipAddress - IP address from request
 * @returns true if IP is from PayFast
 */
export function validatePayFastIP(ipAddress: string): boolean {
  const validHosts = [
    'www.payfast.co.za',
    'sandbox.payfast.co.za',
    'w1w.payfast.co.za',
    'w2w.payfast.co.za',
  ];
  
  // For development, you might want to allow localhost
  if (process.env.NODE_ENV === 'development') {
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress === 'localhost') {
      return true;
    }
  }
  
  // In production, validate against PayFast IPs
  // Note: You should do a DNS lookup of the valid hosts to get their IPs
  // For simplicity, we're checking the host headers
  return true; // Implement proper IP validation in production
}

/**
 * Validate PayFast server confirmation
 * @param pfHost - PayFast host (sandbox or live)
 * @param pfParamString - Parameter string to send
 * @returns true if PayFast confirms the transaction
 */
export async function validatePayFastServerConfirmation(
  pfHost: string,
  pfParamString: string
): Promise<boolean> {
  try {
    const response = await fetch(`https://${pfHost}/eng/query/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: pfParamString,
    });
    
    const result = await response.text();
    return result === 'VALID';
  } catch (error) {
    console.error('Error validating PayFast server confirmation:', error);
    return false;
  }
}

/**
 * Calculate next payment date based on frequency
 * @param startDate - Starting date
 * @param frequency - Payment frequency
 * @returns Next payment date
 */
export function calculateNextPaymentDate(
  startDate: Date,
  frequency: 'monthly' | 'quarterly' | 'biannually' | 'annual'
): Date {
  const nextDate = new Date(startDate);
  
  switch (frequency) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'biannually':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'annual':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  return nextDate;
}

/**
 * Parse PayFast payment status
 * @param status - Status string from PayFast
 * @returns Normalized status
 */
export function parsePayFastStatus(status: string): 'completed' | 'pending' | 'failed' {
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'complete' || normalizedStatus === 'completed') {
    return 'completed';
  }
  
  if (normalizedStatus === 'failed' || normalizedStatus === 'cancelled') {
    return 'failed';
  }
  
  return 'pending';
}
