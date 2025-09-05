# Government Energy Portal - Microgrid Dashboard (SIH 2025)

## Project Title: Government Energy Portal - Advanced Renewable Energy Microgrid Monitoring System

## Description

The Government Energy Portal is a cutting-edge Microgrid Monitoring System designed for the Smart India Hackathon (SIH) 2025. It provides real-time insights, historical analysis, and administrative capabilities for managing renewable energy microgrids. This platform empowers government agencies and energy operators to efficiently monitor energy generation, consumption, battery storage, and environmental impact, ensuring optimal performance, compliance, and sustainability.

## Features

- **Real-time Dashboard**: Live monitoring of key microgrid metrics including total generation, consumption, energy balance, battery levels, and system health.
- **Advanced Analytics**: Enhanced real-time charts and predictive analytics for deeper insights into energy trends and forecasts.
- **Historical Analysis & Reports**: Comprehensive historical data analysis and generation of performance reports with export capabilities.
- **Alert Management Center**: Centralized system for monitoring, acknowledging, and resolving system alerts and notifications.
- **User Management**: Secure authentication and role-based access control powered by Clerk, with an administrative interface for user oversight.
- **System Configuration**: Admin panel for managing system settings, security parameters, and integrations.
- **Compliance Dashboard**: Tools for audit trail tracking and compliance reporting, ensuring adherence to government standards.
- **Responsive UI**: Modern and intuitive user interface built with Next.js, React, and Tailwind CSS.

## Technology Stack

- **Framework**: Next.js (React)
- **Authentication**: Clerk (for secure, scalable user authentication and management)
- **Styling**: Tailwind CSS, `tw-animate-css`
- **Charting**: Recharts
- **State Management**: React Hooks (useState, useEffect)
- **Mock Data Services**: Custom services (`RealTimeDataService`, `HistoricalDataService`, `AlertManagementService`, `SystemConfigurationService`, `ComplianceAuditService`) for simulating data.

## Architecture

The application follows a modular, component-based architecture typical for Next.js applications:

1.  **Frontend (Next.js/React)**:

    - **Pages**: `app/page.tsx` serves as the main dashboard, orchestrating various components.
    - **Components**: Reusable UI elements and feature-specific modules (e.g., `LoginForm`, `UserMenu`, `AlertCenter`, `RealTimeCharts`, `AdminPanel`).
    - **UI Library**: Shadcn/ui components (`components/ui/*`) for consistent styling and accessibility.
    - **Clerk Integration**: `<ClerkProvider>` wraps the entire application (`app/layout.tsx`), enabling authentication. `middleware.ts` protects routes.

2.  **Authentication Layer (Clerk)**:

    - Handles user registration, login, session management, and role-based access control.
    - Integrates seamlessly with Next.js, providing hooks (`useUser`, `useAuth`) and components (`SignIn`, `UserButton`).

3.  **Data Services (Mock Implementation)**:
    - `lib/real-time-data.ts`: Simulates real-time energy metrics, including generation, consumption, battery status, and environmental factors.
    - `lib/historical-data.ts`: Provides mock historical data for trends and report generation.
    - `lib/alert-system.ts`, `lib/system-config.ts`, `lib/compliance-audit.ts`: Simulate alerts, system configurations, and audit logs respectively.
    - **Role-Based Data Simulation**: These services are designed to return different datasets or apply access restrictions based on the authenticated user's role (admin, operator, viewer) obtained from Clerk's `publicMetadata`.

## Data Flow: Fetching Data from IoT Devices (Production Level)

In a real-world production environment for the Government Energy Portal, data fetching from IoT devices would involve a robust, scalable, and secure architecture:

1.  **IoT Device Layer**:

    - **Sensors**: Microgrid components (solar panels, wind turbines, battery storage, smart meters, weather stations) are equipped with various sensors to collect data (e.g., power output, voltage, current, temperature, wind speed, solar irradiance, energy consumption).
    - **Edge Devices**: Local gateways or edge computing devices aggregate, filter, and preprocess raw sensor data before sending it upstream. This reduces data volume and latency.

2.  **Data Ingestion Layer**:

    - **Protocols**: Data is typically transmitted using lightweight protocols suitable for IoT, such as MQTT (Message Queuing Telemetry Transport).
    - **Message Brokers/Event Hubs**: A scalable message broker (e.g., Apache Kafka, AWS IoT Core, Azure IoT Hub, Google Cloud IoT Core) ingests high volumes of data streams from numerous edge devices. This layer ensures reliable and high-throughput data reception.

3.  **Stream Processing Layer**:

    - **Real-time Analytics**: Data streams are processed in real-time using stream processing frameworks (e.g., Apache Flink, Apache Spark Streaming, AWS Kinesis, Azure Stream Analytics).
    - **Functions**: This layer performs:
      - **Data Validation and Cleansing**: Ensures data quality and consistency.
      - **Anomaly Detection**: Identifies unusual patterns (e.g., sudden drops in generation, abnormal consumption spikes).
      - **Data Aggregation**: Aggregates raw data into meaningful metrics (e.g., kWh per hour, average temperature).
      - **Feature Engineering**: Creates new data features for predictive models.
      - **Threshold Monitoring**: Triggers alerts if metrics exceed predefined thresholds.

4.  **Data Storage Layer**:

    - **Time-Series Database**: Processed data is stored in a specialized time-series database (e.g., InfluxDB, TimescaleDB, Amazon Timestream, Azure Data Explorer). These databases are optimized for storing and querying time-stamped data efficiently.
    - **Relational/NoSQL Databases**: Metadata about devices, user configurations, and historical reports might be stored in other databases (e.g., PostgreSQL, MongoDB).

5.  **API Layer (Backend)**:

    - **RESTful APIs/GraphQL**: A robust backend API (e.g., Node.js with Express, Python with FastAPI/Django, Go) acts as an interface between the frontend dashboard and the data storage/processing layers.
    - **Endpoints**: Provides endpoints for:
      - Fetching real-time aggregated metrics.
      - Querying historical data within specified time ranges.
      - Retrieving alerts and system health status.
      - Managing user roles and system configurations (if not fully handled by Clerk's backend).
    - **Security**: API authentication and authorization are critical, often integrating with the chosen authentication provider (Clerk in this case) and implementing fine-grained access control policies.

6.  **Frontend (Microgrid Dashboard)**:
    - The Next.js application consumes data from the API Layer.
    - Clerk provides the authenticated user's context (ID, role, metadata) to the frontend.
    - API requests from the frontend would include authentication tokens (managed by Clerk) to authorize data access.
    - The dashboard then visualizes the fetched real-time and historical data, applying role-based display logic (e.g., hiding certain metrics for 'viewer' roles).

## Authentication & Role-Based Access Control

This application uses **Clerk** for robust authentication and user management.

- **Users**: Users authenticate via Clerk's secure login flow.
- **Roles**: User roles (e.g., `admin`, `operator`, `viewer`) are managed within Clerk's dashboard (via `publicMetadata`).
- **Frontend Enforcement**: The application components check the `user?.publicMetadata?.role` to dynamically render UI elements and restrict access to certain functionalities (e.g., Admin Panel, User Management, specific data exports).
- **Backend Enforcement (Production)**: In a production system, role-based access would also be enforced on the backend API layer to prevent unauthorized data access or modifications, regardless of frontend UI restrictions.

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Git

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd microgrid-dashboard
    ```
2.  **Install dependencies:**
    ```bash
    npm install --legacy-peer-deps
    ```
3.  **Set up Clerk Environment Variables:**
    Create a `.env.local` file in the root of your project and add your Clerk API keys:

    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY"
    CLERK_SECRET_KEY="sk_test_YOUR_SECRET_KEY"
    ```

    Replace `pk_test_YOUR_PUBLISHABLE_KEY` and `sk_test_YOUR_SECRET_KEY` with your actual Clerk API keys.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

Upon launching the application, you will be redirected to the Clerk login page. Use your Clerk credentials (or create a new account) to log in. Different functionalities will be available based on your assigned role (`admin`, `operator`, `viewer`).

**Demo Credentials (if using the mock `AuthService` without Clerk, or if you configure these roles in Clerk):**

- **Admin**: `admin@energy.gov` / `government123`
- **Operator**: `operator@energy.gov` / `government123`
- **Viewer**: `viewer@energy.gov` / `government123`
  (Note: These are for the _mock_ services. With Clerk, you manage users and roles via the Clerk Dashboard.)

## Contributing

We welcome contributions to the Government Energy Portal! Please refer to the project's contribution guidelines (if any) or open an issue/PR for suggestions and improvements.

## License

This project is licensed under the MIT License.

---

**Smart India Hackathon 2025 Submission**
