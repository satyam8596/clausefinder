# ClauseFinder - AI Contract Analyzer

ClauseFinder is an AI-powered contract analysis web application built with Next.js. It helps users analyze legal contracts, identify risks, get plain English explanations, and compare different versions of contracts using Google Gemini AI.

## Features

- **Clause Intelligence:** Advanced AI understanding of clause types (e.g., indemnity, arbitration, termination)
- **Risk Detection & Red Flags:** Automatic detection of high-risk clauses with explanations
- **Plain English Summary:** Makes contracts understandable for non-lawyers
- **Comparative Analysis:** Compare different versions of contracts and identify key differences
- **Real-Time Suggestions:** Get alternative, safer wording for problematic clauses
- **Support for Multiple File Types:** Upload contracts in PDF, DOCX, or TXT formats

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **AI/ML:** Google Gemini 1.5 Flash API
- **File Parsing:** pdf-parse, mammoth.js
- **Utils:** uuid

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/clausefinder.git
   cd clausefinder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Gemini API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Analyze a Contract:**
   - Navigate to the Dashboard
   - Upload a contract file (PDF, DOCX, or TXT)
   - Review the AI-generated analysis including parties, clauses, risks, and suggestions

2. **Compare Contracts:**
   - Navigate to the Compare page
   - Upload two contracts to compare
   - Review the differences, risk level changes, and clause-by-clause comparison

## Project Structure

```
clausefinder/
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   ├── lib/                   # Library code
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
└── ...
```

## Deployment

The application can be easily deployed to Vercel:

```bash
npm install -g vercel
vercel
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini for providing the AI API
- Next.js team for the amazing framework 