
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turn off React StrictMode for now, as react-aria (used by Plasmic)
  // has some troubles with it. See
  // https://github.com/adobe/react-spectrum/labels/strict%20mode
  reactStrictMode: false,
};

// Correct webpack configuration in next.config.js
module.exports = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Custom aliases go here
      '@components': path.resolve(__dirname, 'components'),
    };
    return config;
  },
};
