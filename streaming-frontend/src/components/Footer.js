import React from 'react';
// Uncomment the next line if you have a separate Footer.css file for additional styling
// import './Footer.css'; 

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Online Streaming Application. All rights reserved.</p>
      <p>
        Follow us on:
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Facebook
        </a> | 
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Twitter
        </a> | 
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Instagram
        </a>
      </p>
    </footer>
  );
};

// Inline styles for the footer
const styles = {
  footer: {
    textAlign: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    marginTop: 'auto',
    width: '100%',
    position: 'bottom',
  },
  link: {
    color: '#fff',
    marginLeft: '8px',
  },
};

export default Footer;
