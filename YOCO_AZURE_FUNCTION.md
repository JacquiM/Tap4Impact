# Yoco Azure Function Implementation Guide

## Overview
This Azure Function processes Yoco payments securely by handling the charge creation server-side, keeping your `YOCO_SECRET_KEY` secure.

## Function Details

**Function Name:** `ProcessYocoPayment`  
**HTTP Method:** POST  
**Authorization Level:** Anonymous (public endpoint)

---

## Environment Variables Required

Add these to your Azure Function App Settings:

```
YOCO_SECRET_KEY=sk_test_2db0fbe2gERa14Pfba5448884048
```

(Replace with your live secret key when deploying to production)

---

## Request Format

The frontend will send:

```json
{
  "token": "tok_...",
  "amountInCents": 31500,
  "currency": "ZAR",
  "metadata": {
    "donorName": "Brandon Lubbe",
    "donorEmail": "brandon.lubbe08@gmail.com",
    "donorPhone": "+27123456789"
  }
}
```

**Fields:**
- `token` (string, required): Payment token from Yoco SDK
- `amountInCents` (number, required): Amount in cents (e.g., 31500 = R315.00)
- `currency` (string, required): Currency code (always "ZAR")
- `metadata` (object, required): Donor information

---

## Response Format

**Success Response (200 OK):**
```json
{
  "success": true,
  "chargeId": "ch_...",
  "status": "successful"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Implementation (C# / .NET)

```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace YocoFunctions
{
    public static class ProcessYocoPayment
    {
        private static readonly HttpClient httpClient = new HttpClient();

        [FunctionName("ProcessYocoPayment")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Processing Yoco payment request");

            // Get Yoco secret key from environment
            string secretKey = Environment.GetEnvironmentVariable("YOCO_SECRET_KEY");
            if (string.IsNullOrEmpty(secretKey))
            {
                log.LogError("YOCO_SECRET_KEY not configured");
                return new BadRequestObjectResult(new { 
                    success = false, 
                    error = "Payment configuration error" 
                });
            }

            try
            {
                // Parse request body
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);

                // Extract required fields
                string token = data?.token;
                int? amountInCents = data?.amountInCents;
                string currency = data?.currency;
                dynamic metadata = data?.metadata;

                // Validate required fields
                if (string.IsNullOrEmpty(token))
                {
                    return new BadRequestObjectResult(new { 
                        success = false, 
                        error = "Missing payment token" 
                    });
                }

                if (!amountInCents.HasValue || amountInCents.Value <= 0)
                {
                    return new BadRequestObjectResult(new { 
                        success = false, 
                        error = "Invalid amount" 
                    });
                }

                if (string.IsNullOrEmpty(currency))
                {
                    return new BadRequestObjectResult(new { 
                        success = false, 
                        error = "Missing currency" 
                    });
                }

                // Build charge payload for Yoco API
                var chargePayload = new
                {
                    token = token,
                    amountInCents = amountInCents.Value,
                    currency = currency,
                    metadata = metadata
                };

                log.LogInformation($"Creating Yoco charge for amount: {amountInCents}");

                // Call Yoco API to create charge
                httpClient.DefaultRequestHeaders.Authorization = 
                    new AuthenticationHeaderValue("Bearer", secretKey);

                var response = await httpClient.PostAsJsonAsync(
                    "https://online.yoco.com/v1/charges/",
                    chargePayload
                );

                if (response.IsSuccessStatusCode)
                {
                    var resultString = await response.Content.ReadAsStringAsync();
                    dynamic charge = JsonConvert.DeserializeObject(resultString);

                    log.LogInformation($"Charge created successfully: {charge.id}");

                    return new OkObjectResult(new
                    {
                        success = true,
                        chargeId = charge.id,
                        status = charge.status
                    });
                }
                else
                {
                    var errorString = await response.Content.ReadAsStringAsync();
                    log.LogError($"Yoco API error: {errorString}");

                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        error = "Payment processing failed"
                    });
                }
            }
            catch (Exception ex)
            {
                log.LogError($"Error processing payment: {ex.Message}");
                return new BadRequestObjectResult(new
                {
                    success = false,
                    error = "An error occurred processing the payment"
                });
            }
        }
    }
}
```

---

## Implementation (Node.js)

```javascript
const axios = require('axios');

module.exports = async function (context, req) {
    context.log('Processing Yoco payment request');

    // Get Yoco secret key from environment
    const secretKey = process.env.YOCO_SECRET_KEY;
    if (!secretKey) {
        context.log.error('YOCO_SECRET_KEY not configured');
        context.res = {
            status: 400,
            body: { success: false, error: 'Payment configuration error' }
        };
        return;
    }

    try {
        // Extract required fields from request
        const { token, amountInCents, currency, metadata } = req.body;

        // Validate required fields
        if (!token) {
            context.res = {
                status: 400,
                body: { success: false, error: 'Missing payment token' }
            };
            return;
        }

        if (!amountInCents || amountInCents <= 0) {
            context.res = {
                status: 400,
                body: { success: false, error: 'Invalid amount' }
            };
            return;
        }

        if (!currency) {
            context.res = {
                status: 400,
                body: { success: false, error: 'Missing currency' }
            };
            return;
        }

        context.log(`Creating Yoco charge for amount: ${amountInCents}`);

        // Call Yoco API to create charge
        const response = await axios.post(
            'https://online.yoco.com/v1/charges/',
            {
                token,
                amountInCents,
                currency,
                metadata
            },
            {
                headers: {
                    'Authorization': `Bearer ${secretKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        context.log(`Charge created successfully: ${response.data.id}`);

        context.res = {
            status: 200,
            body: {
                success: true,
                chargeId: response.data.id,
                status: response.data.status
            }
        };
    } catch (error) {
        context.log.error(`Error processing payment: ${error.message}`);
        
        context.res = {
            status: 400,
            body: {
                success: false,
                error: 'Payment processing failed'
            }
        };
    }
};
```

---

## Testing Locally

1. **Install Azure Functions Core Tools**
2. **Create local.settings.json:**
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "dotnet",
       "YOCO_SECRET_KEY": "sk_test_2db0fbe2gERa14Pfba5448884048"
     }
   }
   ```

3. **Run locally:**
   ```bash
   func start
   ```

4. **Test with curl:**
   ```bash
   curl -X POST http://localhost:7071/api/ProcessYocoPayment \
     -H "Content-Type: application/json" \
     -d '{
       "token": "tok_test_...",
       "amountInCents": 31500,
       "currency": "ZAR",
       "metadata": {
         "donorName": "Test User",
         "donorEmail": "test@example.com",
         "donorPhone": "+27123456789"
       }
     }'
   ```

---

## Deployment

1. **Create Azure Function App** in Azure Portal
2. **Add Application Setting:**
   - Name: `YOCO_SECRET_KEY`
   - Value: Your Yoco secret key
3. **Deploy function code**
4. **Update frontend config** with production URL:
   ```typescript
   YOCO_AZURE_FUNCTION_URL: 'https://your-function-app.azurewebsites.net/api/ProcessYocoPayment'
   ```

---

## Security Notes

✅ **Secure:**
- `YOCO_SECRET_KEY` stored in Azure Function environment variables (encrypted)
- Never exposed to frontend
- Charge creation happens server-side only

✅ **Frontend Safe:**
- Only public key exposed (`pk_test_...`)
- Only sends payment token to Azure Function
- Cannot create charges without secret key

---

## Yoco API Documentation

- **API Docs:** https://developer.yoco.com/online/
- **Create Charge Endpoint:** `POST https://online.yoco.com/v1/charges/`
- **Authentication:** Bearer token with secret key

---

## Frontend Flow Summary

1. ✅ User clicks donate
2. ✅ Frontend shows Yoco popup (card details)
3. ✅ Yoco SDK generates payment token
4. ✅ Frontend sends token to Azure Function
5. ✅ Azure Function creates charge with Yoco API
6. ✅ Azure Function returns charge result
7. ✅ Frontend shows success/error message

**No backend API needed for payment processing!** 🎉
