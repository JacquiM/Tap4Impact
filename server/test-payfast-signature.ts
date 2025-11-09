/**
 * PayFast Signature Test Utility
 * 
 * This helps verify that signature generation matches PayFast's requirements
 */

import { generatePayFastSignature } from './payfast-utils';

// Test with PayFast sandbox example data
const testData = {
  merchant_id: '10000100',
  merchant_key: '46f0cd694581a',
  return_url: 'http://www.example.com/return',
  cancel_url: 'http://www.example.com/cancel',
  notify_url: 'http://www.example.com/notify',
  name_first: 'John',
  email_address: 'test@example.com',
  amount: '100.00',
  item_name: 'Test Product',
  item_description: 'Test Description'
};

console.log('='.repeat(60));
console.log('PayFast Signature Test');
console.log('='.repeat(60));

// Test without passphrase
console.log('\n1. Testing without passphrase:');
const signatureWithoutPassphrase = generatePayFastSignature(testData);
console.log('Result:', signatureWithoutPassphrase);

// Test with passphrase
console.log('\n2. Testing with passphrase "jt7NOE43FZPn":');
const signatureWithPassphrase = generatePayFastSignature(testData, 'jt7NOE43FZPn');
console.log('Result:', signatureWithPassphrase);

// Test with subscription data
const subscriptionData = {
  merchant_id: '10000100',
  merchant_key: '46f0cd694581a',
  return_url: 'http://localhost:5173/donation/success',
  cancel_url: 'http://localhost:5173/donation/cancelled',
  notify_url: 'http://localhost:3000/api/payfast/notify',
  name_first: 'John',
  email_address: 'john@example.com',
  amount: '315.00',
  item_name: 'Recurring Donation',
  item_description: 'Tap4Impact Recurring Donation',
  subscription_type: '1',
  billing_date: '2025-10-23',
  recurring_amount: '315.00',
  frequency: '3',
  cycles: '0'
};

console.log('\n3. Testing subscription data:');
const subscriptionSignature = generatePayFastSignature(subscriptionData);
console.log('Result:', subscriptionSignature);

console.log('\n' + '='.repeat(60));
console.log('Test complete');
console.log('='.repeat(60));
