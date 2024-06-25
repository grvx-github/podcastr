/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{
			protocol: "https",
			hostname: 'lovely-flamingo-139.convex.cloud'
		},
		{
			protocol: "https",
			hostname: "firebasestorage.googleapis.com",
		},
		{
			protocol: 'https',
			hostname: 'lh3.googleusercontent.com'
		}
		]
	}
};

export default nextConfig;
