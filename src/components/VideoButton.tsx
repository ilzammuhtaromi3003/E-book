"use client";

import React, { useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';

interface VideoButtonProps {
  videoSrc: string;
  position?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
}

const VideoButton: React.FC<VideoButtonProps> = ({ 
  videoSrc, 
  position = { top: '20%', left: '40%' } 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Untuk mengatasi error hydration dengan Bootstrap di Next.js
  useEffect(() => {
    setIsClient(true);
    
    // Memastikan bootstrap.js dimuat
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const handleClose = () => setShowModal(false);
  
  // Fungsi dengan stopPropagation untuk mencegah event bubbling
  const handleShow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah event bubbling ke parent (HTMLFlipBook)
    e.preventDefault(); // Mencegah default action
    setShowModal(true);
  };

  if (!isClient) {
    return null; // Mencegah render sebelum hydration selesai
  }

  return (
    <>
      {/* Tombol Play dengan stopPropagation */}
      <button
        onClick={handleShow}
        onMouseDown={(e) => e.stopPropagation()} // Mencegah mousedown event juga
        onTouchStart={(e) => e.stopPropagation()} // Mencegah touchstart event
        className="video-play-button"
        style={{
          position: 'absolute',
          ...position,
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#4A90E2',
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        <FaPlay style={{ marginLeft: '5px' }} size={30} />
      </button>

      {/* Bootstrap Modal dengan stopPropagation */}
      <Modal 
        show={showModal} 
        onHide={handleClose} 
        size="lg" 
        centered
        contentClassName="bg-dark"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-white">Video</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <video
            src={videoSrc}
            controls
            autoPlay
            className="w-100"
            style={{ borderRadius: '0.3rem' }}
            onClick={(e) => e.stopPropagation()}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VideoButton;