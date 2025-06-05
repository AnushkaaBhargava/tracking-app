import React, { useState, useEffect } from 'react';
import demoTrackingInfo from './demoTrackingData'; 
import './App.css'; 


function formatTrackingDate(isoString) {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;


  let daySuffix;
  if (day > 3 && day < 21) daySuffix = 'th';
  else {
    switch (day % 10) {
      case 1:  daySuffix = 'st'; break;
      case 2:  daySuffix = 'nd'; break;
      case 3:  daySuffix = 'rd'; break;
      default: daySuffix = 'th';
    }
  }

  return `${day}${daySuffix} ${month} ${hours}:${strMinutes} ${ampm}`;
}

const DeliveryStatusCard = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderIdInput, setOrderIdInput] = useState(''); // State for the text input value
  const [currentOrderId, setCurrentOrderId] = useState(''); // State for the order ID currently being tracked

  
  useEffect(() => {
    const simulateApiCall = () => {
      if (!currentOrderId) { 
        setTrackingData(null); 
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      setTrackingData(null); 

      setTimeout(() => {
        try {
       
          setTrackingData(demoTrackingInfo.data);

        } catch (err) {
          setError("Error loading tracking data: " + err.message);
          console.error("Failed to load tracking data:", err);
        } finally {
          setLoading(false);
        }
      }, 1500);
    };


    simulateApiCall();
  }, [currentOrderId]); 

  const handleTrackClick = () => {
   
    setCurrentOrderId(orderIdInput.trim());
  };

  const handleInputChange = (e) => {
    setOrderIdInput(e.target.value);
  };

  
  const filteredTrackingReport = trackingData?.trackingReport
    ? trackingData.trackingReport.filter(scan => scan.ScanDetail && scan.ScanDetail.Instructions).reverse()
    : [];

  const overallStatus = trackingData?.status?.Status || "Unknown Status";

  
  const displayShippingId = currentOrderId || 'Enter ID to Track';

  return (
    <div className="delivery-card-outer-wrapper">
      <div className="order-input-section">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderIdInput}
          onChange={handleInputChange}
          className="order-id-input"
          onKeyPress={(e) => { 
            if (e.key === 'Enter') {
              handleTrackClick();
            }
          }}
        />
        <button
          onClick={handleTrackClick}
          className="track-button"
          disabled={!orderIdInput.trim()} 
        >
          Track Shipment
        </button>
      </div>

      {currentOrderId ? ( 
        <div className="delivery-card-container">
          <div className="delivery-card">
            <div className="delivery-header">
              <button className="close-button" aria-label="Close"
                onClick={() => { 
                  setOrderIdInput('');
                  setCurrentOrderId('');
                  setTrackingData(null);
                  setLoading(false);
                  setError(null);
                }}>
                &times;
              </button>
              <div className="delivery-status-text">
                Delivery Status
              </div>
              <div className="delivery-main-status">
                Your order is <span className="status-highlight">{overallStatus}</span>
              </div>
            </div>

            <div className="map-placeholder">
              <div className="map-placeholder-text">Map Placeholder</div>
            </div>

            <div className="shipping-info">
              <div className="shipping-id-label">Shipping ID</div>
              <div className="shipping-id-value">{displayShippingId}</div>
            </div>

            {loading ? (
              <div className="loading-state">Loading tracking information for {currentOrderId}...</div>
            ) : error ? (
              <div className="error-state">Error: {error}</div>
            ) : filteredTrackingReport.length === 0 ? (
              <div className="no-data-state">No tracking information found for {currentOrderId}.</div>
            ) : (
              <div className="tracking-timeline">
                {filteredTrackingReport.map((scan, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-date-time">
                      {formatTrackingDate(scan.ScanDetail.ScanDateTime)}
                    </div>
                    <div className="timeline-dot-line">
                      <div className="timeline-dot"></div>
                      {}
                      {index < filteredTrackingReport.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    <div className="timeline-details">
                      <div className="timeline-instruction">{scan.ScanDetail.Instructions}</div>
                      <div className="timeline-location">{scan.ScanDetail["Scanned Location"]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="initial-message">
          Please enter an Order ID and click 'Track Shipment' to see details.
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusCard;