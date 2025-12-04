# 💧 Rainwater Harvesting Calculator

A comprehensive web application for calculating rainwater harvesting potential, designing sustainable water management solutions, and generating detailed feasibility reports for properties in India.

## 🌟 Features

- **📍 Location-Based Analysis**: Input any address to fetch location-specific rainfall and hydrogeology data
- **🌧️ Rainfall Prediction**: Get detailed monthly rainfall patterns based on IMD (India Meteorological Department) data
- **🏗️ Smart Calculations**: Calculate harvesting potential using property dimensions, roof type, soil type, and water consumption
- **💰 Cost-Benefit Analysis**: Estimate implementation costs and ROI using CPWD standards
- **📊 Interactive Dashboard**: Visualize results with charts and graphs powered by Recharts
- **📄 PDF Report Generation**: Download comprehensive analysis reports with jsPDF
- **🎨 Modern UI**: Beautiful, responsive interface built with shadcn/ui and Tailwind CSS
- **🌓 Dark Mode Support**: Toggle between light and dark themes

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing

### UI Components
- **shadcn/ui** - Beautiful, accessible components built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Clean, consistent icons

### Data Visualization
- **Recharts** - Composable charting library
- **date-fns** - Modern date utility library

### State Management & Forms
- **React Hook Form** - Performant form validation
- **Zod** - TypeScript-first schema validation
- **TanStack Query** - Powerful data synchronization

### PDF Generation
- **jsPDF** - Client-side PDF generation
- **html2canvas** - HTML to canvas rendering

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** package manager

## 🏃‍♂️ Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd rainwaterharvestingproject-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
# or
bun build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
bun preview
```

## 📖 How to Use

1. **Enter Location**: Input your property address to fetch rainfall and hydrogeology data
2. **Fill Property Details**: 
   - Property name/owner
   - Number of dwellers
   - Roof area (sq. meters)
   - Roof type (concrete, metal, tiled)
   - Soil type (sandy, clayey, loamy, rocky)
   - Monthly water consumption
   - Available budget
3. **View Analysis**: Review rainfall patterns, soil conditions, and aquifer information
4. **Calculate Results**: Get harvesting potential, recommended structure dimensions, and cost estimates
5. **Download Report**: Generate a comprehensive PDF report with all findings

## 🎯 Key Calculations

The application uses industry-standard formulas:

- **Runoff Calculation**: `V = P × A × Cr`
  - V = Volume of water collected (liters)
  - P = Annual rainfall (mm)
  - A = Catchment area (sq. meters)
  - Cr = Runoff coefficient (varies by roof type)

- **Structure Sizing**: Based on soil percolation rates and local hydrogeology
- **Cost Estimation**: CPWD (Central Public Works Department) standard rates
- **ROI Analysis**: Payback period and annual savings calculations

## 📊 Data Sources

- **India Meteorological Department (IMD)** - Historical rainfall data
- **Central Ground Water Board (CGWB)** - Hydrogeology information
- **NAQUIM** - National Aquifer Mapping and Management
- **CPWD** - Construction cost standards

## 🗂️ Project Structure

```
rainwaterharvestingproject-main/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Route pages
│   ├── services/        # Business logic and utilities
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Helper functions
│   └── assets/          # Images and static files
├── public/              # Static assets
└── dataset/             # Data files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- India Meteorological Department for rainfall data
- Central Ground Water Board for hydrogeology resources
- shadcn/ui for the beautiful component library
- All open-source contributors

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

