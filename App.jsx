import { useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [photos, setPhotos] = useState([]);
  const [tweets, setTweets] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(10);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [history, setHistory] = useState([]);

  const cautaFotografii = async (termen = search) => {
    if (!termen.trim()) return;

    setLoading(true);
    setError("");
    setPhotos([]);
    setTweets([]); 

    try {
      
      const response = await fetch(`http://localhost:3001/photos?tag=${termen}`);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setPhotos(data.items);
        
       
        setHistory((prev) => {
          if (prev.includes(termen)) return prev;
          return [termen, ...prev].slice(0, 5); // max 5 căutări
        });

        
        try {
          const twitterRes = await fetch(`http://localhost:3001/api/tweets?q=${termen}`);
          const twitterData = await twitterRes.json();
          setTweets(twitterData.data || []);
        } catch (err) {
          console.error("Eroare la preluarea tweet-urilor:", err);
         
        }

      } else {
        setError("Nu s-au găsit fotografii.");
      }
    } catch  {
      setError("Eroare la conectarea cu serverul.");
    } finally {
      setLoading(false);
    }
  };

  const descarcaPoza = async (url, titlu) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = titlu || "flickr-photo";
    link.click();
  };

  return (
    <div className="container">
      <h1>🔍 Căutare fotografii Flickr & Twitter</h1>

      {}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Caută fotografii... (ex: nature, cats, cars)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && cautaFotografii()}
        />
        <button onClick={() => cautaFotografii()}>Caută</button>
      </div>

      {}
      <div className="limit-selector">
        <label>Afișează: </label>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={5}>5 poze</option>
          <option value={10}>10 poze</option>
          <option value={20}>20 poze</option>
        </select>
      </div>

      {}
      {history.length > 0 && (
        <div className="history">
          <span>Căutări recente: </span>
          {history.map((item, i) => (
            <button
              key={i}
              className="history-tag"
              onClick={() => {
                setSearch(item);
                cautaFotografii(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="status">Se caută fotografiile și tweet-urile...</p>}
      {error && <p className="status error">{error}</p>}

      {}
      <div className="gallery">
        {photos.slice(0, limit).map((photo, index) => (
          <div key={index} className="photo-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <img
              src={photo.media.m}
              alt={photo.title}
              onClick={() => setSelectedPhoto(photo)}
              style={{ cursor: 'pointer', borderRadius: '8px' }}
            />
            <p style={{ fontWeight: 'bold' }}>{photo.title || "Fără titlu"}</p>

            {}
            <div className="tweet-container" style={{
              backgroundColor: '#f5f8fa',
              padding: '10px',
              borderRadius: '8px',
              borderLeft: '4px solid #1DA1F2',
              fontSize: '14px',
              textAlign: 'left',
              fontStyle: 'italic',
              marginTop: 'auto' 
            }}>
              <span style={{ fontStyle: 'normal' }}>🐦</span> {tweets[index] ? tweets[index].text : "Nu s-au găsit tweet-uri asociate."}
            </div>

            <button
              className="download-btn"
              onClick={() => descarcaPoza(photo.media.m, photo.title)}
            >
              ⬇ Descarcă
            </button>
          </div>
        ))}
      </div>

      {}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>✕</button>
            <img src={selectedPhoto.media.m.replace("_m.", "_b.")} alt={selectedPhoto.title} />
            <p>{selectedPhoto.title || "Fără titlu"}</p>
            <a href={selectedPhoto.link} target="_blank" rel="noreferrer">
              Vezi pe Flickr →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;