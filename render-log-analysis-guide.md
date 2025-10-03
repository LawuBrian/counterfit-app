# 🔍 Render Log Analysis Guide

## 🎯 What to Search For in Render Logs

### **🚨 Critical Error Patterns:**

#### **1. Order Creation Without Payment**
Look for these log patterns:
```
✅ Order created successfully
❌ No corresponding Yoco checkout log
❌ No payment processing log
```

#### **2. Yoco Checkout Failures**
Search for:
```
"yoco checkout"
"checkout creation failed"
"YOCO_SECRET_KEY"
"payment system not configured"
```

#### **3. Authentication Issues**
Look for:
```
"Unauthorized"
"No session found"
"access token"
"authentication failed"
```

#### **4. API Endpoint Errors**
Search for:
```
"POST /api/checkout"
"POST /api/orders"
"500 Internal Server Error"
"Failed to create order"
```

## 🔍 Step-by-Step Log Analysis:

### **Step 1: Find Order Creation Logs**
Search for your order numbers or timestamps around Sept 29th:
```
Search terms:
- "Order created successfully"
- "POST /api/orders"
- Your customer email addresses
- Order amounts (e.g., "R299", "R150")
```

### **Step 2: Trace Payment Flow**
For each order, look for this sequence:
```
1. "POST /api/checkout" - Customer started checkout
2. "Creating YOCO checkout" - Yoco integration called
3. "YOCO checkout created" - Yoco responded successfully  
4. "Order created successfully" - Order saved to database
```

### **Step 3: Identify Missing Steps**
If you see:
```
✅ "Order created successfully"
❌ No "Creating YOCO checkout" log
```
**= Orders created without payment (BUG)**

If you see:
```
✅ "Creating YOCO checkout"
❌ "YOCO checkout creation failed"
✅ "Order created successfully"
```
**= Payment failed but order still created (BUG)**

## 🚨 Common Error Scenarios:

### **Scenario A: Environment Variable Missing**
```
Log shows: "YOCO_SECRET_KEY not set"
Problem: Payment system not configured
Result: Orders created without payment processing
```

### **Scenario B: Yoco API Failure**
```
Log shows: "Yoco checkout creation failed: 401 Unauthorized"
Problem: Invalid Yoco credentials
Result: Payment fails but order still created
```

### **Scenario C: Session/Auth Issues**
```
Log shows: "No session found" or "Unauthorized"
Problem: User authentication failed
Result: Orders created without proper user validation
```

### **Scenario D: Database Issues**
```
Log shows: "Supabase error" or "Database connection failed"
Problem: Order creation partially failed
Result: Incomplete order data
```

## 🔧 How to Filter Render Logs:

### **Time-based Filtering:**
1. Set date range to September 29, 2025
2. Look at hours when orders were created
3. Focus on checkout-related timestamps

### **Keyword Filtering:**
Search for these terms one by one:
- `checkout`
- `yoco`
- `payment`
- `order`
- `error`
- `failed`
- `unauthorized`

### **Log Level Filtering:**
- **ERROR**: Critical failures
- **WARN**: Potential issues  
- **INFO**: Normal operations
- **DEBUG**: Detailed flow

## 🎯 Expected vs Actual Log Flow:

### **✅ Normal Payment Flow Should Show:**
```
[INFO] POST /api/checkout - Customer started checkout
[INFO] Creating YOCO checkout with data: {...}
[INFO] YOCO checkout created: {id: "checkout_xxx"}
[INFO] Order created successfully: {orderNumber: "CF-xxx"}
[INFO] Payment confirmation received via webhook
[INFO] Order status updated to confirmed
```

### **❌ Problematic Flow Might Show:**
```
[INFO] POST /api/checkout - Customer started checkout
[ERROR] YOCO checkout creation failed: API key invalid
[INFO] Order created successfully: {orderNumber: "CF-xxx"}
[WARN] No payment processing completed
```

## 🚨 Red Flags in Logs:

1. **Orders created without checkout logs**
2. **Multiple error messages around order creation time**
3. **Missing environment variables**
4. **Authentication failures**
5. **Database connection issues**
6. **Yoco API errors**

## 🔧 Next Steps Based on Log Analysis:

### **If Logs Show Payment Errors:**
1. Fix the specific error (API keys, config, etc.)
2. Contact customers to retry payment
3. Don't ship orders without confirmed payment

### **If Logs Show Orders Created Without Payment Attempt:**
1. Critical bug in checkout flow
2. Orders bypass payment system entirely
3. Need immediate code review and fix

### **If Logs Are Missing/Incomplete:**
1. Logging might not be properly configured
2. Check Render service health during that time
3. Possible service restart or downtime

---

**🎯 The logs will tell you exactly what went wrong on September 29th!**
