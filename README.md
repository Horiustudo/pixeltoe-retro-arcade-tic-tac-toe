# Nimbus Weather

[cloudflarebutton]

Nimbus is a minimalist, visually-driven weather application designed for clarity and aesthetic appeal. It provides users with current weather conditions, hourly, and daily forecasts in a clean, uncluttered interface. The core of the application is a central content card that displays all relevant weather information for a searched or geolocated city. The design prioritizes 'less is more', utilizing generous white space, a muted color palette, and fluid animations to create a serene and intuitive user experience.

## Key Features

- **Minimalist & Modern UI**: A clean, uncluttered interface focusing on readability and visual appeal.
- **Comprehensive Forecasts**: Get current weather, detailed hourly forecasts, and a 7-day outlook.
- **Intuitive City Search**: A command-menu (`cmdk`) style search for quickly finding any city.
- **Automatic Geolocation**: Fetches weather for your current location on initial load (with permission).
- **Dynamic Backgrounds**: The UI background subtly shifts to reflect the current weather or time of day.
- **Responsive Design**: Flawless experience across all device sizes, from mobile to desktop.

## Technology Stack

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date & Time**: [date-fns](https://date-fns.org/)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- [Git](https://git-scm.com/) for cloning the repository.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/nimbus-weather-app.git
    cd nimbus-weather-app
    ```

2.  **Install dependencies:**
    This project uses `bun` for package management.
    ```bash
    bun install
    ```

## Development

To start the local development server, run the following command:

```bash
bun dev
```

The application will be available at `http://localhost:3000`. The server will automatically reload when you make changes to the source files.

## Available Scripts

- `bun dev`: Starts the development server.
- `bun build`: Builds the application for production.
- `bun lint`: Lints the codebase using ESLint.
- `bun deploy`: Deploys the application to Cloudflare Workers.

## Deployment

This application is designed to be deployed on the Cloudflare network using Wrangler.

### Deploying with Wrangler CLI

1.  **Login to Cloudflare:**
    If you haven't already, authenticate Wrangler with your Cloudflare account.
    ```bash
    bun wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script from the root of the project.
    ```bash
    bun deploy
    ```

This command will build the application and deploy it to your Cloudflare account. Wrangler will provide you with the URL of your deployed application.

### Deploy with the Click of a Button

You can also deploy this project directly to Cloudflare with a single click.

[cloudflarebutton]

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.