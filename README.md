# 🗺️ Maps Clone

A modern, production-grade Google Maps clone built with **React**, **Leaflet**, and **Tailwind CSS**. Features real-time search, routing, satellite view, and a premium mobile-first UI.

![Maps Clone](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🔍 **Search & Geocoding**

- Real-time location search with **Nominatim API**
- Debounced input (500ms) for optimal performance
- Auto-search on typing with instant feedback

### 🧭 **Navigation & Routing**

- Two-point routing with **OSRM**
- Turn-by-turn directions
- Distance and duration estimates
- Visual route display on map

### 📍 **User Location**

- Auto-detect GPS location on load
- Pulsing blue "My Location" marker
- One-click re-center to current position

### 🛠️ **Tools**

- **Distance Calculator** (Ruler mode) - Measure between multiple points
- **Satellite View** - Toggle between Street and Satellite tiles
- **Right-click** to clear selections

### 🎨 **Premium UI/UX**

- Mobile-first bottom sheet design
- Smooth spring animations (60fps)
- Toast notifications for user feedback
- Floating action buttons for controls
- Swipeable panels with gestures

### 💾 **Saved Places**

- Save favorite locations to LocalStorage
- Quick access to starred places
- One-click navigation to saved points

## 🚀 Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4 (PostCSS)
- **Map Library**: Leaflet.js + react-leaflet
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **APIs**:
  - [Nominatim](https://nominatim.openstreetmap.org/) - Geocoding
  - [OSRM](http://project-osrm.org/) - Routing
  - [OpenStreetMap](https://www.openstreetmap.org/) - Street tiles
  - [Esri World Imagery](https://www.arcgis.com/) - Satellite tiles

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Rishab11250/maps.git
cd maps-clone

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Usage

1. **Search for a location**: Type in the search bar at the top
2. **Get directions**:
   - Click "Directions" button
   - Enter start and destination
   - Click "Start Navigation"
3. **Measure distances**: Click the ruler icon to enter measurement mode
4. **Switch map view**: Click layers icon to toggle Street/Satellite
5. **Save places**: Click star icon on any location card

## 🎯 Keyboard Shortcuts

- **Escape**: Close active panel or tool
- **Right-click**: Clear current selection/route

## 📱 Mobile Support

Fully responsive with touch gestures:

- Swipe up/down on bottom panel to expand/collapse
- Pinch to zoom on map
- Tap and hold for context menu

## 🏗️ Project Structure

```
maps-clone/
├── src/
│   ├── components/
│   │   ├── MapContainer.jsx      # Main map wrapper
│   │   ├── SearchBar.jsx          # Search interface
│   │   ├── Controls.jsx           # Map controls (zoom, location, etc.)
│   │   ├── BottomPanel.jsx        # Mobile bottom sheet
│   │   ├── UserLocationMarker.jsx # GPS marker
│   │   └── DistanceCalculator.jsx # Ruler tool
│   ├── utils/
│   │   └── Icons.js               # Custom map icons
│   ├── lib/
│   │   └── utils.js               # Helper functions
│   ├── App.jsx                    # Main app logic
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── public/                        # Static assets
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
└── vite.config.js                 # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License**.

## 🙏 Acknowledgments

- [OpenStreetMap Contributors](https://www.openstreetmap.org/copyright)
- [Leaflet.js](https://leafletjs.com/) for the mapping library
- [OSRM](http://project-osrm.org/) for routing engine
- [Nominatim](https://nominatim.org/) for geocoding

## 📧 Contact

**Rishab** - [@Rishab11250](https://github.com/Rishab11250)

Project Link: [https://github.com/Rishab11250/maps](https://github.com/Rishab11250/maps)

---

Made with ❤️ using React and Leaflet
