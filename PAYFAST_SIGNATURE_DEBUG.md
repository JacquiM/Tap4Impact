# PayFast Signature Debugging Guide

## Common Signature Issues

### Error: "Generated signature does not match submitted signature"

This error occurs when PayFast receives a different signature than what they calculate on their end.

## Debugging Steps

### 1. Check Server Logs

When you submit a payment, look for these logs in your terminal:

```
📝 Generating signature for data: { merchant_id: ..., ... }
PayFast signature string: amount=315.00&billing_date=2025-10-23&...
Generated signature: abc123def456...
✅ Generated signature: abc123def456...
```

### 2. Verify Data Being Sent

In the browser console, you should see:
```javascript
PayFast form data before signature: {...}
PayFast form data with signature: {...}
```

### 3. Common Causes

#### A. Passphrase Mismatch
- **Problem:** Server uses a passphrase, but PayFast merchant account doesn't have one (or vice versa)
- **Solution:** 
  - Check your PayFast merchant dashboard settings
  - Remove passphrase from server OR add it to PayFast dashboard

#### B. URL Encoding Issues
- **Problem:** Spaces encoded as `%20` instead of `+`
- **Solution:** Already handled in code with `.replace(/%20/g, '+')`

#### C. Empty Fields
- **Problem:** Including empty/null fields in signature
- **Solution:** Already handled - we skip undefined/null/empty values

#### D. Field Order
- **Problem:** Fields not in alphabetical order
- **Solution:** Already handled - we sort keys alphabetically

#### E. Extra Fields
- **Problem:** Including fields that shouldn't be in signature
- **Solution:** We exclude `signature` field itself

### 4. Manual Testing

To test signature generation manually:

```bash
# In PowerShell
$data = @{
    merchant_id = "10000100"
    merchant_key = "46f0cd694581a"
    amount = "100.00"
    item_name = "Test"
}

# Sort keys and build string
$sorted = $data.GetEnumerator() | Sort-Object Name
$string = ($sorted | ForEach-Object { "$($_.Name)=$([System.Web.HttpUtility]::UrlEncode($_.Value).Replace('%20','+'))" }) -join '&'
Write-Host "String: $string"

# Calculate MD5
$md5 = New-Object System.Security.Cryptography.MD5CryptoServiceProvider
$bytes = [System.Text.Encoding]::UTF8.GetBytes($string)
$hash = $md5.ComputeHash($bytes)
$signature = [System.BitConverter]::ToString($hash).Replace('-','').ToLower()
Write-Host "MD5: $signature"
```

### 5. PayFast Sandbox Test

For PayFast sandbox (merchant ID: 10000100), they typically **don't require a passphrase**.

Example working signature for:
```
merchant_id=10000100
merchant_key=46f0cd694581a
amount=100.00
item_name=Test
```

String: `amount=100.00&item_name=Test&merchant_id=10000100&merchant_key=46f0cd694581a`
MD5: `5a8d16e9ba1304f7fcbdd5144be21218`

### 6. Fix Checklist

- [ ] No passphrase set in environment variables (for sandbox)
- [ ] All required fields are present
- [ ] No empty/null fields included
- [ ] URLs are accessible (return_url, cancel_url, notify_url)
- [ ] Amount formatted with 2 decimals (e.g., "100.00" not "100")
- [ ] Billing date in YYYY-MM-DD format

## Current Implementation Status

✅ MD5 hash generation working
✅ Field sorting (alphabetical)
✅ URL encoding (spaces as +)
✅ Empty field exclusion
✅ Signature field exclusion
✅ Logging enabled for debugging

## Next Steps If Error Persists

1. **Check browser console** - Look for the logged form data
2. **Check server logs** - See the signature string and generated hash
3. **Compare with PayFast** - Use their signature tester (if available)
4. **Verify merchant credentials** - Ensure merchant_id and merchant_key are correct
5. **Test without passphrase** - Remove PAYFAST_PASSPHRASE from environment

## Quick Fix

The most common issue is having a passphrase in your code but not in PayFast dashboard (or vice versa).

**To remove passphrase from server:**
1. Delete or comment out `PAYFAST_PASSPHRASE` in your `.env` file
2. Restart the server
3. Try payment again

**To add passphrase to PayFast:**
1. Log into PayFast merchant dashboard
2. Go to Settings > Integration
3. Set passphrase to match your server
4. Save and try payment again
