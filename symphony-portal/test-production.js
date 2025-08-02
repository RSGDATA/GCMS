const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the out directory at root path (for custom domain)
app.use('/', express.static(path.join(__dirname, 'out')));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Production test server running at http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/ to test the production build`);
});
