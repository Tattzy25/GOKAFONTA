# TaTTTy Fonts - AI Tattoo Font Generator

TaTTTy Fonts is a professional AI-powered tattoo design application specialized in typography. It is built with Next.js and powered by a custom Flux model via Replicate, designed to help artists and clients visualize their next masterpiece with high-fidelity tattoo concepts and a wide range of specialized font styles.

## ✨ Features

- **Specialized Font Gallery:** Over 90 curated tattoo-style fonts that can be instantly applied to your prompt.
- **High-Impact Tattoo Generation:** Powered by a specialized Flux model (`tattty_4_all`) for authentic urban, traditional, and realistic tattoo styles.
- **Font Preview & Selection:** Interactive carousel to browse and preview fonts in detail before generating.
- **Smart Downloads & Sharing:** Integrated support for downloading and sharing generated designs.
- **Mobile-First Design:** Fully responsive UI, perfect for studio use on tablets or phones.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **AI Provider:** [Replicate](https://replicate.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended)
- A [Replicate](https://replicate.com/) API Token

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tattzy25/GOKAFONTA.git
   cd GOKAFONTA/goka
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the `goka` directory and add your Replicate API token:
   ```env
   REPLICATE_API_TOKEN=your_token_here
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to start designing!

## 📄 License

This project is for personal and professional use in tattoo design visualization.
