import crypto from 'crypto';

interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: string;
}

const getConfig = (): PayTRConfig => {
  return {
    merchantId: process.env.PAYTR_MERCHANT_ID || '',
    merchantKey: process.env.PAYTR_MERCHANT_KEY || '',
    merchantSalt: process.env.PAYTR_MERCHANT_SALT || '',
    testMode: process.env.NEXT_PUBLIC_PAYTR_TEST_MODE || '1',
  };
};

export interface PayTRPaymentParams {
  email: string;
  payment_amount: number; // in kuruş (amount * 100)
  merchant_oid: string;
  user_name: string;
  user_address: string;
  user_phone: string;
  merchant_ok_url: string;
  merchant_fail_url: string;
  user_basket: string; // JSON string [ [name, price, quantity], ... ]
  user_ip: string;
  currency?: string;
  no_installment?: number;
  max_installment?: number;
  lang?: 'tr' | 'en';
  iframe_v2?: string;
}

export interface PayTRSubscriptionParams {
  email: string;
  plan_id: string; // The ID of the plan created in PayTR panel
  subscriber_external_id: string; // The ID of the user in your system
  merchant_ok_url: string;
  merchant_fail_url: string;
  user_ip: string;
  lang?: 'tr' | 'en';
}

/**
 * Generate PayTR Token and Request iFrame Token
 */
export const getPayTRToken = async (params: PayTRPaymentParams) => {
  const { merchantId, merchantKey, merchantSalt, testMode } = getConfig();

  const currency = params.currency || 'TL';
  const no_installment = params.no_installment ?? 0;
  const max_installment = params.max_installment ?? 0;
  const lang = params.lang || 'tr';
  const timeout_limit = 30;
  const debug_on = 1;

  // Hash calculation order: merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + merchant_salt
  const hashSTR = `${merchantId}${params.user_ip}${params.merchant_oid}${params.email}${params.payment_amount}${params.user_basket}${no_installment}${max_installment}${currency}${testMode}`;
  const paytrToken = crypto
    .createHmac('sha256', merchantKey)
    .update(hashSTR + merchantSalt)
    .digest('base64');

  const formData = new URLSearchParams();
  formData.append('merchant_id', merchantId);
  formData.append('user_ip', params.user_ip);
  formData.append('merchant_oid', params.merchant_oid);
  formData.append('email', params.email);
  formData.append('payment_amount', params.payment_amount.toString());
  formData.append('paytr_token', paytrToken);
  formData.append('user_basket', params.user_basket);
  formData.append('debug_on', '1');
  formData.append('no_installment', no_installment.toString());
  formData.append('max_installment', max_installment.toString());
  formData.append('user_name', params.user_name);
  formData.append('user_address', params.user_address);
  formData.append('user_phone', params.user_phone);
  formData.append('merchant_ok_url', params.merchant_ok_url);
  formData.append('merchant_fail_url', params.merchant_fail_url);
  formData.append('timeout_limit', timeout_limit.toString());
  formData.append('currency', currency);
  formData.append('test_mode', testMode);
  formData.append('lang', lang);
  formData.append('iframe_v2', params.iframe_v2 || '1');

  const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  const data = await response.json();
  return data;
};

/**
 * Validates the hash coming from PayTR Callback (Standard Payment)
 */
export const validatePayTRHash = (
  merchant_oid: string,
  status: string,
  total_amount: string,
  hash: string
) => {
  const { merchantKey, merchantSalt } = getConfig();
  
  // Hash calculation for callback: merchant_oid + merchant_salt + status + total_amount
  const hashSTR = `${merchant_oid}${merchantSalt}${status}${total_amount}`;
  const expectedHash = crypto
    .createHmac('sha256', merchantKey)
    .update(hashSTR)
    .digest('base64');

  return expectedHash === hash;
};
