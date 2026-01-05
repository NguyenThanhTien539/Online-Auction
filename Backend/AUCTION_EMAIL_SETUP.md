# Auction End Email Automation Setup

## Overview
Hệ thống tự động gửi email khi đấu giá kết thúc cho 3 loại nhân vật: Winner, Seller, và Losers.

## Files Created

### 1. Migration SQL
**File:** `Backend/data/migrations/add_auction_end_email_sent.sql`
- Thêm cột `auction_end_email_sent` vào bảng `products`
- Tạo index để tối ưu query

### 2. Email Templates
**File:** `Backend/src/helpers/mail.helper.ts`
- `getWinnerEmailTemplate()` - Email cho người thắng
- `getSellerWithWinnerEmailTemplate()` - Email cho seller khi có winner
- `getSellerNoWinnerEmailTemplate()` - Email cho seller khi không có winner
- `getLoserEmailTemplate()` - Email cho người thua

### 3. Service Layer
**File:** `Backend/src/services/auction-end-mail.service.ts`
- Logic xử lý gửi email cho từng loại người dùng
- Lấy danh sách sản phẩm đã hết hạn
- Đánh dấu sản phẩm đã gửi email

### 4. Cron Job
**File:** `Backend/src/jobs/auction-end.job.ts`
- Chạy mỗi 2 phút để kiểm tra sản phẩm hết hạn
- Tự động gửi email và đánh dấu đã gửi

### 5. Server Integration
**File:** `Backend/src/server.ts`
- Khởi động cron job khi server start

## Setup Instructions

### Step 1: Run Migration
```bash
# Connect to your database and run:
psql -U your_username -d your_database -f Backend/data/migrations/add_auction_end_email_sent.sql
```

Hoặc copy nội dung file SQL và chạy trực tiếp trong database client của bạn.

### Step 2: Add Environment Variable
Thêm vào file `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### Step 3: Restart Server
```bash
npm run dev
```

## How It Works

### Flow Diagram
```
Server Start
    ↓
Cron Job Active (every 2 minutes)
    ↓
Query: end_time < NOW() AND auction_end_email_sent = FALSE
    ↓
For each expired product:
    ↓
    ├─ Has Winner? (price_owner_id != NULL)
    │   ├─ YES → Send to: Winner, Seller, Losers
    │   └─ NO  → Send to: Seller only
    ↓
Mark auction_end_email_sent = TRUE
```

### Email Content

#### Winner Email
- Subject: "Congratulations! You Won: {product_name}"
- Content: Winning price, payment instructions, product link
- Color: Purple gradient

#### Seller Email (With Winner)
- Subject: "Sold! Auction Ended: {product_name}"
- Content: Winner info, final price, next steps
- Color: Green gradient

#### Seller Email (No Winner)
- Subject: "Auction Ended (No Winner): {product_name}"
- Content: Suggestions for relisting
- Color: Orange gradient

#### Loser Email
- Subject: "Auction Ended: {product_name}"
- Content: Final price, similar product suggestions
- Color: Gray gradient

## Configuration

### Adjust Cron Schedule
Edit `Backend/src/jobs/auction-end.job.ts`:
```typescript
const cronSchedule = '*/2 * * * *'; // Every 2 minutes

// Change to:
// '*/5 * * * *'  → Every 5 minutes
// '0 * * * *'    → Every hour
// '0 0 * * *'    → Every day at midnight
```

### Rate Limiting
- Between products: 1 second delay
- Between loser emails: 500ms delay
- Max 50 products per run

## Testing

### Manual Test
Trong console của server (hoặc tạo route test):
```typescript
import { runAuctionEndEmailJobManually } from './jobs/auction-end.job.ts';

// Run manually
await runAuctionEndEmailJobManually();
```

### Check Logs
Server sẽ log:
- Số lượng sản phẩm được xử lý
- Email gửi thành công/thất bại
- Thời gian chạy
- Chi tiết từng product

## Monitoring

Cron job sẽ log thông tin chi tiết:
```
======================================================================
[CRON] Auction End Email Job Started: 05/01/2026 10:00:00
======================================================================
[INFO] Found 5 expired products to process

[1/5] Processing product: iPhone 15 Pro (ID: 123)
[✓] Successfully processed product 123

...

======================================================================
[SUMMARY] Auction End Email Job Completed
----------------------------------------------------------------------
Total products processed: 5
Successful: 4
Failed: 1
Duration: 12.5s
Completed at: 05/01/2026 10:00:12
======================================================================
```

## Troubleshooting

### Emails not sending?
1. Check `.env` có GMAIL_ADDRESS và GMAIL_APP_PASSWORD
2. Check database có cột `auction_end_email_sent`
3. Check cron job có running: xem logs trong console

### Duplicate emails?
- Cột `auction_end_email_sent` đảm bảo chỉ gửi 1 lần
- Nếu vẫn duplicate, check xem có chạy nhiều instance server không

### Want to resend emails?
```sql
-- Reset flag to resend
UPDATE products 
SET auction_end_email_sent = FALSE 
WHERE product_id = 123;
```

## Production Recommendations

1. **Increase cron interval:** Change to 5-10 minutes
2. **Add retry mechanism:** Implement exponential backoff for failed emails
3. **Use queue system:** Consider using Bull/BullMQ for better scalability
4. **Add monitoring:** Integrate with monitoring tools (Sentry, DataDog)
5. **Rate limit emails:** Gmail has limits, use SendGrid/AWS SES for production

## Support
For issues or questions, check the logs first. Most errors will be logged with clear messages.
