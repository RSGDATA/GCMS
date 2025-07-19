const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the out directory with the /GCMS base path
app.use('/GCMS', express.static(path.join(__dirname, 'out')));

// Redirect root to /GCMS for testing
app.get('/', (req, res) => {
  res.redirect('/GCMS/');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Production test server running at http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/GCMS/ to test the production build`);
});
