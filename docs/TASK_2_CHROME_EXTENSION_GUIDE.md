# 🚀 Task 2: API Testing with Keploy Chrome Extension

This guide will help you complete Task 2 of the Keploy Fellowship Program - exploring API testing using the Keploy Chrome Extension.

## 📋 Task Requirements

- ✅ Install and use Keploy Chrome Extension
- ✅ Test at least **2 different websites** with APIs
- ✅ Write a blog post about your experience
- ✅ Publish on Dev.to, Medium, or LinkedIn
- ✅ Share on social media

## 🛠️ Step 1: Install Keploy Chrome Extension

### Installation Process

1. **Download the Extension**
   ```bash
   # Go to the GitHub releases page
   https://github.com/keploy/browser-extension/releases
   ```

2. **Download Latest Release**
   - Download `keploy-browser-extension-v0.1.4.zip` (or latest version)
   - Extract the ZIP file to a folder on your computer

3. **Install in Chrome**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right)
   - Click **Load unpacked**
   - Select the extracted extension folder
   - The Keploy extension should now appear in your extensions

4. **Verify Installation**
   - Look for the Keploy icon in your Chrome toolbar
   - If not visible, click the puzzle piece icon and pin Keploy

## 🎯 Step 2: Choose Websites for Testing

Here are **recommended websites** that make extensive API calls:

### Website Option 1: JSONPlaceholder (Beginner-Friendly)
- **URL**: https://jsonplaceholder.typicode.com/
- **Why**: Perfect for learning - simple REST API for testing
- **APIs to Test**: 
  - GET posts, users, comments
  - POST new data
  - PUT/PATCH updates

### Website Option 2: FakeStore API
- **URL**: https://fakestoreapi.com/
- **Why**: E-commerce simulation with multiple endpoints
- **APIs to Test**:
  - Product listings
  - Categories
  - Shopping cart operations

### Website Option 3: NewsAPI Demo
- **URL**: https://newsapi.org/
- **Why**: Real-world news data APIs
- **APIs to Test**:
  - Top headlines
  - Search articles
  - Source listings

### Website Option 4: Your Local Task Management API
- **URL**: http://localhost:5000 (from Task 1)
- **Why**: Test your own creation!
- **APIs to Test**:
  - Task CRUD operations
  - Statistics endpoints
  - Search and filtering

### Website Option 5: Social Media/Dashboard Sites
- **GitHub**: https://github.com (API calls when browsing repositories)
- **Dev.to**: https://dev.to (article loading, user interactions)
- **Reddit**: https://reddit.com (post loading, comments)

## 🧪 Step 3: Recording API Tests

### Testing Process

1. **Start the Extension**
   - Click the Keploy extension icon
   - Click "Start Recording"
   - The extension will begin capturing API calls

2. **Interact with Website 1** (e.g., JSONPlaceholder)
   ```bash
   # Visit the website
   https://jsonplaceholder.typicode.com/
   
   # Perform these actions:
   - Click on "Posts" to load all posts
   - Click on individual posts to see details
   - Try the "Users" section
   - Navigate through different pages
   ```

3. **Interact with Website 2** (e.g., FakeStore API)
   ```bash
   # Visit the demo page or build a simple frontend
   https://fakestoreapi.com/
   
   # Perform actions like:
   - Browse products
   - View product details
   - Add items to cart (if demo available)
   - Filter by categories
   ```

4. **Stop Recording**
   - Click "Stop Recording" in the extension
   - Export the captured API calls
   - Review the captured data

5. **Generate Tests**
   - Go to https://app.keploy.io
   - Upload your captured API calls
   - Use "Generate API Tests" feature
   - Review the AI-generated test cases

## 📝 Step 4: Write Your Blog Post

### Blog Post Template

```markdown
# From Manual to AI: My Journey with Keploy Chrome Extension

## Introduction
Share your background and why API testing matters

## The Challenge: Manual API Testing Struggles
- Time-consuming test creation
- Maintaining test cases
- Coverage gaps
- Repetitive work

## Enter Keploy Chrome Extension
Brief overview of what Keploy offers

## My Testing Experience

### Website 1: [Your First Website]
- What you tested
- APIs captured
- Challenges faced
- Results achieved

### Website 2: [Your Second Website]
- Different use case
- Comparison with first test
- Unique insights

## Key Insights
- Speed of test generation
- Accuracy of AI-generated tests
- Areas for improvement
- Real-world applicability

## From 0 to 100% Coverage in Minutes
- Before: Manual test writing process
- After: AI-generated comprehensive tests
- Time savings quantified

## Future of AI-Driven Testing
Your thoughts on the direction of testing

## Conclusion
Final thoughts and recommendations

## Call to Action
Encourage others to try Keploy
```

### Sample Blog Introduction

```markdown
# From Zero to Hero: How AI Transformed My API Testing Game

As a developer, I've always dreaded writing API tests. The repetitive nature, the constant maintenance, and the nagging feeling that I'm missing edge cases made testing feel more like a chore than a crucial part of development.

That all changed when I discovered the Keploy Chrome Extension.

In this post, I'll share my journey from spending hours writing manual tests to generating comprehensive test suites in minutes using AI. Spoiler alert: it's a game-changer.

## The Old Way: Manual Testing Blues

Before Keploy, my API testing workflow looked like this:
- Identify endpoints to test ⏰ 30 minutes
- Write test cases manually ⏰ 2-3 hours
- Create mock data ⏰ 1 hour
- Debug failing tests ⏰ 1-2 hours
- Maintain tests as APIs evolve ⏰ Ongoing headache

**Total time per API**: 4-6 hours minimum

## The New Way: AI-Powered Magic

With Keploy Chrome Extension:
- Install extension ⏰ 2 minutes
- Record API interactions ⏰ 5 minutes
- Generate tests with AI ⏰ 3 minutes
- Review and customize ⏰ 10 minutes

**Total time per API**: 20 minutes maximum

Let me show you exactly how this works...
```

## 📱 Step 5: Social Media Content

### Twitter/X Post Template

```
🚀 Just tested the @Keploy Chrome Extension and I'm blown away! 

From manual API testing that took hours to AI-generated tests in minutes:

✅ Recorded live API calls
✅ Generated comprehensive tests  
✅ 100% coverage automatically
✅ Zero boilerplate code

Game-changer for developers! 🔥

#APItesting #AI #DevTools #Testing #Keploy

[Link to your blog post]
```

### LinkedIn Post Template

```
🎯 The Future of API Testing is Here

I just spent the afternoon testing the Keploy Chrome Extension, and it's completely changed how I think about API testing.

**What I discovered:**

→ Manual test writing: 4-6 hours per API
→ AI-generated tests: 20 minutes per API
→ Coverage: From 40% to 100% automatically
→ Maintenance: Drastically reduced

**My Process:**
1. Installed the Chrome extension (2 mins)
2. Browsed websites with APIs 
3. Extension captured all API calls automatically
4. AI generated comprehensive test suites
5. Deployed tests to CI/CD pipeline

**The Results:**
✅ Tested JSONPlaceholder API: 15 endpoints covered
✅ Tested FakeStore API: Complete e-commerce flow
✅ Generated 50+ test cases automatically
✅ Found edge cases I would have missed

This isn't just about speed—it's about quality. The AI identifies patterns and edge cases that human testers often miss.

**For fellow developers:** If you're still writing API tests manually, you need to try this. The time savings alone are worth it, but the improved coverage and quality are the real game-changers.

Read my full experience: [Link to blog post]

#APITesting #ArtificialIntelligence #DeveloperTools #Testing #Automation #SoftwareDevelopment #DevOps
```

### Instagram/Facebook Post

```
🔥 AI just revolutionized my API testing workflow!

Swipe to see how I went from hours of manual testing to minutes of AI-generated comprehensive tests using @Keploy Chrome Extension.

The future of development is here, and it's incredibly exciting! 

#developer #API #testing #AI #productivity #coding

[Include screenshots of the extension in action]
```

## 📊 Step 6: Measuring Success

### Metrics to Track

1. **Time Savings**
   - Manual testing time vs AI-generated time
   - Setup time comparison
   - Maintenance effort reduction

2. **Coverage Improvement**
   - Number of test cases generated
   - Edge cases discovered
   - API endpoints covered

3. **Quality Metrics**
   - Bugs caught in testing
   - False positives/negatives
   - Test reliability

### Sample Results Table

| Metric | Manual Testing | Keploy AI | Improvement |
|--------|----------------|-----------|-------------|
| Setup Time | 30 minutes | 2 minutes | 93% faster |
| Test Creation | 3 hours | 5 minutes | 97% faster |
| Coverage | 60% | 100% | 67% increase |
| Edge Cases | 5 | 20 | 300% more |

## 🎯 Success Criteria

### Blog Post Requirements
- ✅ Minimum 800 words
- ✅ Include screenshots/code examples
- ✅ Personal experience and insights
- ✅ Specific metrics and comparisons
- ✅ Call-to-action for readers

### Publishing Platforms
- **Dev.to**: Great for developer community
- **Medium**: Broader tech audience
- **LinkedIn**: Professional network
- **Personal blog**: If you have one

### Social Media Engagement
- ✅ Twitter/X post with relevant hashtags
- ✅ LinkedIn professional post
- ✅ Include screenshots/GIFs
- ✅ Tag @Keploy in posts
- ✅ Engage with comments

## 💡 Pro Tips

1. **Extension Tips**
   - Clear browser cache before recording
   - Disable other extensions that might interfere
   - Use incognito mode for cleaner captures

2. **Blog Writing Tips**
   - Use screenshots to illustrate points
   - Include code snippets where relevant
   - Share actual metrics and results
   - Be honest about limitations

3. **Social Media Tips**
   - Use relevant hashtags (#APItesting #AI #DevTools)
   - Tag Keploy (@Keploy)
   - Include visuals (screenshots, GIFs)
   - Engage with the community

## 🔗 Useful Resources

- [Keploy Chrome Extension](https://github.com/keploy/browser-extension)
- [Keploy Console](https://app.keploy.io)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [FakeStore API](https://fakestoreapi.com/)
- [Dev.to Publishing Guide](https://dev.to/p/editor_guide)

## 📝 Submission Checklist

- [ ] Chrome extension installed and tested
- [ ] Tested at least 2 different websites
- [ ] Blog post written (800+ words)
- [ ] Blog post published on chosen platform
- [ ] Social media posts shared
- [ ] Screenshots/evidence collected
- [ ] Links shared with Keploy team

---

**Remember**: This task is about exploring and sharing your genuine experience with AI-powered API testing. Be authentic, share challenges and successes, and help the community learn from your journey! 