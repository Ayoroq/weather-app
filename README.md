# Weather App

A modern, responsive weather application built with vanilla JavaScript that provides comprehensive weather information with an intuitive user interface.

![Weather App Screenshot](/assets/oju_ojo.jpeg)

##  Features

### Core Functionality
- **Real-time Weather Data** - Current conditions and 5-day forecast
- **Hourly Breakdown** - Toggle to view 24-hour detailed forecast
- **Smart City Search** - Autocomplete search with debounced input
- **Geolocation Support** - Automatic location detection on app load
- **Unit Conversion** - Switch between Celsius/Fahrenheit and metric/imperial

### User Experience
- **Loading States** - Visual feedback during API calls
- **Keyboard Navigation** - Enter key support for search
- **Interactive Forecast** - Click any day to view detailed information
- **Dynamic Weather Summaries** - 2,401+ unique weather descriptions

### Technical Features
- **Debounced Search** - Optimized API calls with 300ms delay
- **Error Handling** - Comprehensive error management throughout
- **Modern JavaScript** - ES6+ modules, async/await, clean architecture
- **Webpack Bundling** - Optimized build process with asset management

## Live Demo

[View Live Demo](https://ayoroq.github.io/weather-app/)

##  Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Webpack 5
- **APIs**: 
  - [Visual Crossing Weather API](https://www.visualcrossing.com/) - Weather data
  - [IP Geolocation API](https://ipgeolocation.io/) - Location services
- **Fonts**: IBM Plex Mono (Google Fonts)
- **Icons**: Custom SVG weather icons

## Project Structure

```
weather-app/
├── src/
│   ├── index.js              # Main application entry point
│   ├── weather.js            # Weather API integration
│   ├── geo-location.js       # Geolocation and city search
│   ├── render-weather.js     # DOM manipulation and rendering
│   ├── summary.js            # Dynamic weather summary generator
│   ├── style.css             # Application styling
│   ├── reset.css             # CSS reset
│   └── template.html         # HTML template
├── assets/                   # SVG weather icons
├── webpack.common.js         # Shared webpack configuration
├── webpack.dev.js           # Development webpack config
├── webpack.prod.js          # Production webpack config
└── package.json             # Dependencies and scripts
```

##  Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **API Keys Setup**
   
   ⚠️ **SECURITY WARNING**: The API keys included in this project are PUBLIC and for educational/demonstration purposes only. 
   
   **DO NOT use these keys in production or for personal projects.**
   
   For your own implementation:
   - Get your own [Visual Crossing Weather API](https://www.visualcrossing.com/) key
   - Get your own [IP Geolocation API](https://ipgeolocation.io/) key
   - Replace the keys in `src/weather.js` and `src/geo-location.js`
   
   The included keys may be rate-limited, revoked, or stop working at any time.

4. **Development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser

5. **Production build**
   ```bash
   npm run build
   ```

##  Usage

### Basic Usage
1. **Automatic Location**: App loads with your current location's weather
2. **Search Cities**: Type in the search bar to find any city worldwide
3. **View Forecast**: Click on any forecast day for detailed information
4. **Toggle Units**: Switch between Celsius/Fahrenheit using the toggle
5. **Hourly Data**: Click "Show Hourly" for detailed hourly breakdown

### Keyboard Shortcuts
- **Enter**: Select first search result
- **Escape**: Close search dropdown (click outside)

##  Architecture

### Code Organization
- **Modular Design**: Separate modules for different concerns
- **Clean Architecture**: Clear separation between data, logic, and presentation
- **Error Boundaries**: Comprehensive error handling at all levels
- **Performance Optimized**: Debounced search, efficient DOM updates

### Key Components
- **Weather Data Layer** (`weather.js`): API integration and data processing
- **Location Services** (`geo-location.js`): Geolocation and city search
- **Rendering Engine** (`render-weather.js`): DOM manipulation and UI updates
- **Summary Generator** (`summary.js`): Dynamic weather descriptions
- **Main Controller** (`index.js`): Event handling and app coordination

##  Design Features

- **Clean Minimalist UI**: Focus on essential weather information
- **Glassmorphism Effects**: Modern visual design with backdrop filters
- **Consistent Typography**: IBM Plex Mono for professional appearance
- **Intuitive Icons**: Custom SVG icons for all weather conditions
- **Responsive Layout**: Flexbox-based design that works on all devices

##  Future Enhancements

- [ ] **Weather Maps Integration**
- [ ] **Favorite Locations** - Save frequently checked cities
- [ ] **PWA Features** - Offline support and app installation
- [ ] **Weather Charts** - Visual temperature and precipitation graphs

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit) file for details.

## Acknowledgments

- **The Odin Project** - For the excellent curriculum and project inspiration
- **Visual Crossing** - For providing comprehensive weather data API
- **IP Geolocation** - For location services
- **Google Fonts** - For the IBM Plex Mono font family

##  Contact

Roqeeb Olaniyi - [Ayoroq@gmail.com](mailto:Ayoroq@gmail.com)

Project Link: [Oju Ọjọ](https://github.com/Ayoroq/weather-app)

---