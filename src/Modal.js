import React from 'react'
import ReactDom from 'react-dom'

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    backgroundColor: 'rgba(30,30,30, 0.7)',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    height: '90%',
    width: '90%',
    overflowY: 'auto', // Enables vertical scrolling
    maxHeight: '90vh', // Ensures modal stays within the viewport
    padding: '20px',
    borderRadius: '8px' // Optional: Adds rounded corners
  }

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}

export default function Modal({ children, onClose }) {

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <button className='btn bg-danger fs-6' style={{ marginLeft: "90%", marginTop: "-35px" }} onClick={onClose}> X </button>
        {children}
      </div>
    </>,
    document.getElementById('cart-root')
  )
}