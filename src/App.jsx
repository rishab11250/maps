import MapContainer from './components/MapContainer';
import SearchBar from './components/SearchBar';
import Controls from './components/Controls';
import BottomPanel from './components/BottomPanel';
import DistanceCalculator from './components/DistanceCalculator';
import { useState, useRef, useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { StartIcon, EndIcon } from './utils/Icons';
import UserLocationMarker from './components/UserLocationMarker';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  // Map style: 'light', 'dark', or 'satellite'
  const [mapStyle, setMapStyle] = useState(() => {
    const saved = localStorage.getItem('mapStyle');
    return saved || 'light';
  });
  // Reusing sidebarOpen state logic but for BottomPanel logic if needed
  const [panelOpen, setPanelOpen] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState(() => {
    const saved = localStorage.getItem('savedPlaces');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [routeMode, setRouteMode] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'directions'
  const [isMeasuring, setIsMeasuring] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('savedPlaces', JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  // Removed flaky useEffect for geolocation

  // Removed flaky useEffect - Logic moved to UserLocationMarker.jsx

  const handleSearch = async (query) => {
    const searchToast = toast.loading('Searching...');
    try {
      // Basic Nominatim Search
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const place = { lat, lon, display_name };

        setSelectedPlace(place);
        setPanelOpen(true); // Open bottom panel
        setActiveTab('saved');

        if (mapRef.current) {
          mapRef.current.flyTo([lat, lon], 13, { duration: 1.5 });
        }
        toast.success('Location found!', { id: searchToast });
      } else {
        toast.error('No results found', { id: searchToast });
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error('Search failed. Please try again.', { id: searchToast });
    }
  };

  const toggleSavePlace = (place) => {
    if (isSaved(place)) {
      setSavedPlaces(savedPlaces.filter(p => p.display_name !== place.display_name));
    } else {
      setSavedPlaces([...savedPlaces, place]);
    }
  };

  const isSaved = (place) => {
    return savedPlaces.some(p => p.display_name === place.display_name);
  };

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  const handleLocate = () => {
    if (mapRef.current) {
      mapRef.current.locate().on("locationfound", function (e) {
        mapRef.current.flyTo(e.latlng, mapRef.current.getZoom());
      });
    }
  };

  const clearRoute = () => {
    setRoutePoints([]);
    setRouteData(null);
    setRouteMode(false);
    setActiveTab('saved');
    if (mapRef.current && selectedPlace) {
      // Reset view if we were routing
      mapRef.current.flyTo([selectedPlace.lat, selectedPlace.lon], 14);
    }
  };

  const handleRouteMode = () => {
    setRouteMode(true);
    setRoutePoints([]);
    setRouteData(null);
    setPanelOpen(true);
    setActiveTab('directions');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'directions' && !routeMode) {
      // Trigger route mode setup if switching to directions tab manually
      handleRouteMode();
    }
  };

  const handleToggleMeasurement = () => {
    setIsMeasuring(!isMeasuring);
  };

  // Cycle through map styles: light -> dark -> satellite -> light
  const handleCycleMapStyle = () => {
    const styles = ['light', 'dark', 'satellite'];
    const currentIndex = styles.indexOf(mapStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    const nextStyle = styles[nextIndex];
    setMapStyle(nextStyle);
    localStorage.setItem('mapStyle', nextStyle);
    toast.success(`Map: ${nextStyle.charAt(0).toUpperCase() + nextStyle.slice(1)}`);
  };

  const handleShare = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      const zoom = mapRef.current.getZoom();
      const url = `${window.location.origin}${window.location.pathname}?lat=${center.lat.toFixed(6)}&lng=${center.lng.toFixed(6)}&z=${zoom}`;

      navigator.clipboard.writeText(url).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    } else {
      toast.error('Map not ready');
    }
  };

  // Geocoding Helper
  const geocode = async (query) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display_name: data[0].display_name };
      }
    } catch (error) {
      console.error("Geocode failed", error);
    }
    return null;
  };

  const handleCalculateRoute = async (startQuery, endQuery) => {
    let startCoords = null;
    let endCoords = null;

    // Resolve Start
    if (startQuery === "Your Location" || startQuery === "My Location") {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        startCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      } catch (e) {
        alert("Could not get current location. Please allow location access.");
        return;
      }
    } else {
      startCoords = await geocode(startQuery);
    }

    // Resolve End
    if (!endQuery) {
      alert("Please enter a destination.");
      return;
    }
    endCoords = await geocode(endQuery);

    if (startCoords && endCoords) {
      // Fetch Route
      fetch(`https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=false&steps=true`)
        .then(res => res.json())
        .then(data => {
          if (data.routes?.[0]) {
            const route = data.routes[0];
            setRouteData({
              distance: (route.distance / 1000).toFixed(1), // km with 1 decimal
              duration: Math.round(route.duration / 60),
              steps: route.legs[0].steps
            });

            // Update Map Markers
            setRoutePoints([
              { lat: startCoords.lat, lng: startCoords.lon }, // Standardize to lat/lng object for Leaflet
              { lat: endCoords.lat, lng: endCoords.lon }
            ]);

            // Fit bounds
            if (mapRef.current) {
              const bounds = L.latLngBounds(
                [startCoords.lat, startCoords.lon],
                [endCoords.lat, endCoords.lon]
              );
              mapRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
          } else {
            alert("No route found.");
          }
        })
        .catch(err => {
          console.error("Routing error", err);
          alert("Failed to calculate route.");
        });
    } else {
      alert("Could not find one of the locations.");
    }
  };

  const MapEvents = () => {
    // ... kept as is
    const map = useMapEvents({
      click(e) {
        if (isMeasuring) return;

        if (routeMode) {
          const newPoints = [...routePoints, e.latlng];
          setRoutePoints(newPoints);

          if (newPoints.length === 2) {
            const start = newPoints[0];
            const end = newPoints[1];
            fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false&steps=true`)
              .then(res => res.json())
              .then(data => {
                if (data.routes?.[0]) {
                  const route = data.routes[0];
                  setRouteData({
                    distance: (route.distance / 1000).toFixed(1),
                    duration: Math.round(route.duration / 60),
                    steps: route.legs[0].steps
                  });
                }
              })
              .catch(err => console.error("Routing error", err));
          }
          return;
        }

        // Reverse Geocode
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
          .then(res => res.json())
          .then(data => {
            if (data) {
              const newPlace = {
                lat: e.latlng.lat,
                lon: e.latlng.lng,
                display_name: data.display_name
              };
              setSelectedPlace(newPlace);
              setPanelOpen(true);
              setActiveTab('saved');
            }
          });
      },
      // Right-click to clear selection
      contextmenu() {
        setSelectedPlace(null);
        setRoutePoints([]);
        setRouteData(null);
        setRouteMode(false);
        setPanelOpen(false);
      }
    });
    return null;
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans transition-colors duration-300 ${mapStyle === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Floating Search Capsule */}
      <SearchBar onSearch={handleSearch} />

      {/* Floating Controls */}
      <Controls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocate}
        onCycleMapStyle={handleCycleMapStyle}
        onMeasure={handleToggleMeasurement}
        mapStyle={mapStyle}
        onShare={handleShare}
      />

      {/* Bottom Sheet */}
      <BottomPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        savedPlaces={savedPlaces}
        selectedPlace={selectedPlace}
        onSelectPlace={(place) => {
          setSelectedPlace(place);
          if (mapRef.current) mapRef.current.flyTo([place.lat, place.lon], 15);
        }}
        onDeletePlace={toggleSavePlace}
        onClearSelection={() => setSelectedPlace(null)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        routeData={routeData}
        onClearRoute={clearRoute}
        onCalculateRoute={handleCalculateRoute}
      />


      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer ref={mapRef} activeTheme={mapStyle}>
          <MapEvents />
          <UserLocationMarker />

          {selectedPlace && (
            <Marker position={[selectedPlace.lat, selectedPlace.lon]}>
              <Popup offset={[0, -20]} className="rounded-xl overflow-hidden shadow-lg border-none">
                <div className="p-1">
                  <strong className="block text-sm font-bold text-gray-800">{selectedPlace.display_name.split(',')[0]}</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {routePoints.map((pt, idx) => (
            <Marker
              key={idx}
              position={pt}
              icon={idx === 0 ? StartIcon : EndIcon}
            />
          ))}

          {isMeasuring && <DistanceCalculator active={isMeasuring} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
