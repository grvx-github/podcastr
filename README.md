# Podcastr AI Web App

Welcome to Podcastr AI, an innovative web application that allows users to generate podcasts using AI technology powered by IBM Watson's Text-to-Speech service. This app is built using Next.js for server-side rendering, Tailwind CSS for sleek styling, and Firebase for real-time database capabilities.

## Features

* AI-Powered Podcast Generation: Users can create podcasts by entering text, which is converted to high-quality audio using IBM Watson's Text-to-Speech API.
* Playback Control: Listen to generated podcasts directly on the platform with playback controls for play, pause, and volume adjustment.
* Explore Podcasts: Browse podcasts created by other users to discover a wide range of topics and voices.
* User Authentication: Secure user authentication and authorization handled by Firebase Authentication.
* Real-time Updates: Firebase Realtime Database ensures instant updates and synchronization across devices.

## Technologies Used

- **Next.js**: React framework for server-side rendering and efficient front-end development. 
-  **Tailwind CSS**: Utility-first CSS framework for responsive and custom styling without the bloat. 
-  **Firebase**: Backend-as-a-Service platform for real-time database, authentication, and hosting. 
-  **IBM Watson**: AI-powered Text-to-Speech service for generating podcast audio from text inputs. 
-  **Shadcn**: UI components library for enhancing the visual design and user experience


## Installation

To run this project locally, follow these steps:


1. Clone the repository: `git clone <repository-url>`

2. Navigate into the project directory: `cd podcastr-ai`
3. Install dependencies: `npm install` or `yarn install`
4. Set up Firebase:
5. Create a Firebase project at Firebase Console.
6. Add your Firebase configuration in `firebaseConfig.js`.
7. Set up IBM Watson:
8. Obtain an API key and URL from [IBM Cloud](https://cloud.ibm.com).
9. Add your IBM Watson credentials in `src/services/watson.js`.
10. Start the development server: `npm run dev` or `yarn dev`
11. Open your browser and visit: `http://localhost:3000`

## Deployment

To deploy this project to production:

1.  Build the Next.js project: `npm run build` or `yarn build`
2.  Deploy to Firebase Hosting: `firebase deploy`

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

-   Thanks to IBM Watson for providing the powerful Text-to-Speech API.
-   Built with inspiration from the Next.js and Tailwind CSS communities.
-   Firebase for seamless backend integration and deployment.
