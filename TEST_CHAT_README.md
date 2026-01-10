# Chat Testing Scripts - Role-Based Permissions

यह comprehensive test scripts हैं जो chat functionality को test करती हैं Boss, HOD, Team Leader, और BD roles के बीच।

## 📋 Features

- ✅ Fresh token generation सभी roles के लिए
- ✅ Chat creation different role combinations के बीच
- ✅ Bidirectional messaging test
- ✅ Message retrieval और verification
- ✅ User chats listing

## 🚀 How to Run

### Option 1: Node.js Script (Recommended)

```bash
# Navigate to project directory
cd CRM-100acress

# Run the test script
node test-chat-role-based.js
```

### Option 2: PowerShell Script (Windows)

```powershell
# Navigate to project directory
cd CRM-100acress

# Run the test script
.\test-chat-role-based.ps1
```

## 🔧 Configuration

Scripts में default credentials हैं। अगर आपके credentials different हैं तो script में update करें:

### Node.js Script (`test-chat-role-based.js`)
```javascript
const USERS = {
  boss: {
    email: 'info@100acress.com',
    password: 'boss123',
    // ...
  },
  // ... other users
};
```

### PowerShell Script (`test-chat-role-based.ps1`)
```powershell
$users = @{
    boss = @{
        email = "info@100acress.com"
        password = "boss123"
        # ...
    }
    # ... other users
}
```

## 📝 Test Flow

Script automatically चलाती है:

1. **STEP 1**: सभी users (Boss, HOD, Team Leader, BD) के लिए login करके fresh tokens generate करती है

2. **STEP 2**: Test lead fetch करती है (या placeholder use करती है)

3. **STEP 3**: निम्नलिखित role combinations के बीच chat create करती है:
   - Boss ↔ HOD
   - Boss ↔ Team Leader
   - Boss ↔ BD
   - HOD ↔ Team Leader
   - HOD ↔ BD
   - Team Leader ↔ BD

4. **STEP 4**: Bidirectional messaging test करती है (Boss ↔ HOD example)

5. **STEP 5**: हर user के लिए सभी chats list करती है

## ✅ Expected Results

यदि सब कुछ ठीक है तो आपको दिखना चाहिए:

```
✅ Boss login successful!
✅ HOD login successful!
✅ Team Leader login successful!
✅ BD login successful!
✅ Chat created/found: <chat-id>
✅ Message sent: "Hello HOD from Boss!"
✅ Retrieved <n> messages
✅ Found <n> chats
```

## 🐛 Troubleshooting

### Login Failed
- Check credentials हैं सही
- Verify API URL सही है (`https://bcrm.100acress.com`)
- Check network connection

### Chat Creation Failed
- Verify दोनों users successfully login हुए हैं
- Check test lead ID valid है
- Verify backend chatController.js fix apply हुआ है

### Messages Not Sending
- Check chat ID valid है
- Verify sender token valid है
- Check backend `/api/chats/send` endpoint working है

## 📊 Test Matrix

Script test करती है:

| From Role | To Roles |
|-----------|----------|
| Boss | HOD, Team Leader, BD |
| HOD | Boss, Team Leader, BD |
| Team Leader | BD, Boss, HOD |
| BD | Team Leader, HOD, Boss |

## 🔍 What Gets Tested

1. **Role-Based Permissions**: Boss, HOD, Team Leader, BD को आपस में chat करने की permission है
2. **Chat Creation**: Different role combinations के बीच chat successfully create हो रही है
3. **Message Sending**: Messages successfully send हो रहे हैं
4. **Message Retrieval**: Messages correctly retrieve हो रहे हैं
5. **Bidirectional Flow**: Messages दोनों directions में flow हो रहे हैं
6. **Chat Listing**: Users अपने सभी chats देख सकते हैं

## 📝 Notes

- Script rate limiting avoid करने के लिए delays use करती है
- Test lead ID automatically fetch होता है (पहला available lead)
- अगर कोई lead नहीं मिलता तो placeholder ID use होता है
- सभी API calls production URL (`https://bcrm.100acress.com`) use करती हैं

## 🎯 Next Steps

1. Script run करें और results verify करें
2. अगर कोई issue है तो error messages check करें
3. Backend logs check करें detailed debugging के लिए
4. Frontend में भी manually test करें same role combinations के साथ

---

**Happy Testing! 🚀**


