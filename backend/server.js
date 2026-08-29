require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 3000;
if (require.main === module) app.listen(port, () => console.log(`Backend listening on port ${port}`));

module.exports = app;
