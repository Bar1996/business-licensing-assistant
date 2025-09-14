# Business Licensing Assistant (Restaurants – Israel)

## Overview
A comprehensive MVP system that helps food businesses in Israel understand key licensing and compliance requirements. The application processes official regulatory data, collects business information through a digital questionnaire, matches relevant requirements using intelligent algorithms, and generates personalized Hebrew reports powered by AI language models.

## 🎯 Goal
Transform complex regulatory requirements into clear, actionable guidance for restaurant owners by combining structured data processing with AI-powered report generation in Hebrew.

## 🏗️ Architecture

### System Components
- **Frontend**: React + Vite + Tailwind CSS (RTL Hebrew interface)
- **Backend**: Node.js + Express API
- **AI Integration**: Google Gemini (with fallback to plain text)
- **Data Layer**: JSON-based structured requirements
- **Matching Engine**: Rule-based requirement filtering

### Data Flow
```
PDF/Word → JSON Processing → Matching Engine → AI Report Generation → Hebrew Report
```

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI framework
- **Vite 7.1.5** - Fast build tool and dev server
- **Tailwind CSS 4.1.13** - Utility-first styling
- **React Markdown** - Report rendering
- **html2pdf.js** - PDF generation

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### AI Integration
- **Google Generative AI** - Primary LLM provider
- **Gemini 1.5 Flash** - Language model for Hebrew report generation
- **Fallback System** - Plain text generation if AI fails

## 📁 Project Structure
```
business-licensing-assistant/
├── client/                    # React frontend
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── api.js            # API communication
│   │   └── assets/           # Static assets
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   │   ├── reportController.js
│   │   │   └── requirementsController.js
│   │   ├── routes/           # API routes
│   │   │   ├── report.js
│   │   │   └── requirements.js
│   │   ├── services/         # Business logic
│   │   │   ├── aiService.js  # AI integration
│   │   │   └── matcher.js    # Requirement matching
│   │   ├── data/             # Data layer
│   │   │   ├── raw/          # Original PDF source
│   │   │   └── processed/    # Normalized JSON
│   │   └── index.js          # Server entry point
│   └── package.json
├── README.md
└── משימה.md                  # Hebrew task specification
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key (optional, for AI features)

### Installation & Setup

1. **Clone and navigate to project**
   ```bash
   git clone <repository-url>
   cd business-licensing-assistant
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env  # Configure environment variables
   npm run dev          # Starts on http://localhost:3000
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev          # Starts on http://localhost:5173
   ```

4. **Configure AI (Optional)**
   ```bash
   # In server/.env
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-1.5-flash
   LLM_PROVIDER=gemini
   ```

### Running the Application
1. Start both servers (backend on :3000, frontend on :5173)
2. Open http://localhost:5173 in your browser
3. Fill out the business questionnaire
4. Click "התאם דרישות" to see matched requirements
5. Click "צור דוח" to generate AI-powered Hebrew report

## 📊 Data Structure

### Business Questionnaire
The system collects the following business information:
- **Business Name** (text)
- **Seating Capacity** (number)
- **Area in Square Meters** (number)
- **Serves Alcohol** (boolean)
- **Uses Gas** (boolean)
- **Offers Deliveries** (boolean)
- **Serves Meat** (boolean)

### Requirements Schema
```json
{
  "id": "unique_identifier",
  "title": "Requirement Title in Hebrew",
  "appliesWhen": {
    "areaM2": { "gte": 1 },
    "servesAlcohol": true
  },
  "authority": "Regulatory Authority",
  "priority": "high|medium|low",
  "steps": ["Action step 1", "Action step 2"],
  "legalRef": "Legal reference"
}
```

## 🔌 API Documentation

### Endpoints

#### GET `/requirements`
Returns all available requirements
- **Response**: Array of requirement objects

#### POST `/requirements/match`
Matches requirements based on business characteristics
- **Body**: Business questionnaire answers
- **Response**: 
  ```json
  {
    "matched": [/* filtered requirements */],
    "answers": {/* original answers */}
  }
  ```

#### POST `/report`
Generates AI-powered Hebrew report
- **Body**: Business questionnaire answers
- **Response**:
  ```json
  {
    "provider": "gemini|fallback",
    "report": "Markdown formatted Hebrew report",
    "answers": {/* original answers */},
    "matched": [/* matched requirements */]
  }
  ```

## 🤖 AI Integration

### Language Model Configuration
- **Primary**: Google Gemini 1.5 Flash
- **Fallback**: Plain text generation
- **Language**: Hebrew (RTL support)

### AI Prompts
The system uses structured prompts for report generation:

#### System Prompt
```
מטרתך: להכין דוח רישוי מותאם לעסק מזון בישראל בעברית, בפורמט Markdown.
- בכותרת הראשונה השתמש בשם העסק אם סופק (answers.businessName).
- כלול: תקציר, דרישות לפי עדיפות ורשות, צעדים מעשיים (bullets), אסמכתאות אם קיימות, ולבסוף הסתייגות.
- הסגנון תמציתי ונגיש לבעלי עסקים.
```

#### User Prompt Template
```
כותרת מומלצת: "{businessName}"

מאפייני עסק:
{JSON.stringify(answers, null, 2)}

דרישות מותאמות:
{JSON.stringify(matched, null, 2)}

בנה דוח Markdown בהתאם להנחיות.
```

### AI Tools Used in Development
- **Cursor AI** - Primary development assistant
- **GitHub Copilot** - Code completion and suggestions
- **Manual prompt engineering** - Custom prompt development

## 🎨 Features

### Frontend Features
- **RTL Hebrew Interface** - Native right-to-left support
- **Responsive Design** - Mobile and desktop optimized
- **Real-time Validation** - Form validation and feedback
- **Report Export** - PDF and Markdown download
- **Modern UI** - Gradient backgrounds and smooth animations

### Backend Features
- **Intelligent Matching** - Rule-based requirement filtering
- **AI Integration** - Seamless LLM integration with fallback
- **Error Handling** - Comprehensive error management
- **CORS Support** - Cross-origin request handling

### AI Features
- **Hebrew Report Generation** - Native Hebrew language support
- **Personalized Content** - Business-specific recommendations
- **Structured Output** - Markdown formatting for readability
- **Legal Disclaimers** - Automatic disclaimer inclusion

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
PORT=3000

# AI Configuration
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
LLM_PROVIDER=gemini
```

### Dependencies

#### Server Dependencies
- `@google/generative-ai: ^0.24.1` - Google Gemini integration
- `cors: ^2.8.5` - Cross-origin resource sharing
- `dotenv: ^17.2.2` - Environment variable management
- `express: ^5.1.0` - Web framework

#### Client Dependencies
- `react: ^19.1.1` - UI framework
- `react-dom: ^19.1.1` - React DOM rendering
- `react-markdown: ^10.1.0` - Markdown rendering
- `html2pdf.js: ^0.12.0` - PDF generation
- `tailwindcss: ^4.1.13` - CSS framework

## 🧪 Development

### Available Scripts

#### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

#### Client
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Development Workflow
1. Make changes to source code
2. Backend auto-reloads with nodemon
3. Frontend hot-reloads with Vite
4. Test AI integration with real API calls
5. Export reports to verify output quality

## 📝 Legal & Compliance

### Disclaimer
All generated reports include the following legal disclaimer:
> ⚠️ המידע אינו ייעוץ משפטי; יש לאמת מול הרשויות.

### Data Sources
- Requirements based on official Israeli regulatory documents
- Processed and normalized for system consumption
- Regular updates recommended for accuracy

## 🚀 Future Enhancements

### Planned Features
- **Multi-language Support** - English interface option
- **Additional Business Types** - Beyond restaurants
- **Advanced AI Models** - Integration with additional LLMs
- **User Accounts** - Save and manage multiple businesses
- **Regulatory Updates** - Automated requirement updates

### Technical Improvements
- **Database Integration** - Replace JSON with proper database
- **Caching Layer** - Improve response times
- **API Rate Limiting** - Production-ready API protection
- **Comprehensive Testing** - Unit and integration tests

## 📚 Documentation

### Additional Resources
- **משימה.md** - Complete Hebrew task specification
- **API Documentation** - Detailed endpoint documentation
- **Data Schema** - Complete data structure reference
- **AI Prompts** - All prompts used in development

### Development Log
- **AI Tools Used**: Cursor AI, GitHub Copilot
- **Primary LLM**: Google Gemini 1.5 Flash
- **Development Approach**: AI-first development with traditional coding
- **Key Challenges**: Hebrew RTL support, AI prompt engineering
- **Solutions**: Custom CSS for RTL, structured prompt templates

## 🤝 Contributing

### Development Guidelines
- Follow existing code style and patterns
- Test AI integration thoroughly
- Maintain Hebrew language quality
- Update documentation for new features

### AI Development Notes
- Document all AI tools used in development
- Include prompt engineering decisions
- Test fallback mechanisms
- Validate Hebrew output quality

---

**Note**: This system prioritizes functionality over visual polish, focusing on delivering accurate, actionable regulatory guidance for Israeli food businesses.
