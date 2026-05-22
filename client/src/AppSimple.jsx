import React from 'react'

const AppSimple = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#10B981', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>ZeeCart - Premium E-commerce</h1>
      </header>
      <main style={{ padding: '20px' }}>
        <h2>Welcome to ZeeCart!</h2>
        <p>This is a simplified version to test if the basic React rendering works.</p>
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h3>Featured Products</h3>
          <p>Products will be displayed here once the full application is working.</p>
        </div>
      </main>
      <footer style={{ backgroundColor: '#f8f8f8', padding: '20px', textAlign: 'center', marginTop: '40px' }}>
        <p>&copy; 2024 ZeeCart. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default AppSimple
