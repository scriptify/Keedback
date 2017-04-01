module.exports = `
  CREATE TABLE IF NOT EXISTS Version (
    VID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
  );
`;
