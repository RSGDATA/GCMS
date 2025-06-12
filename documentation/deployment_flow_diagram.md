# GitHub Pages Deployment Flow Diagram

The following diagram illustrates the complete deployment flow for the Symphony Portal application to GitHub Pages.

## Deployment Process Flow

```mermaid
flowchart TD
    subgraph "Local Development"
        A[Developer Makes Changes] --> B[Commit Changes]
        B --> C[Push to GitHub]
    end

    subgraph "GitHub Repository"
        C --> D[GitHub Actions Triggered]
        D --> E[Checkout Code]
        E --> F[Setup Node.js]
        F --> G[Install Dependencies]
        
        subgraph "Build Process"
            G --> H[Build Next.js App]
            N[next.config.ts] --> H
            O[GitHub Secrets] --> H
        end
        
        H --> I[Upload Artifact]
        I --> J[Deploy to GitHub Pages]
    end

    subgraph "GitHub Pages"
        J --> K[Site Published]
        K --> L[Available at https://rsgdata.github.io/GCMS]
    end

    subgraph "Configuration Files"
        N
        M[.github/workflows/deploy.yml] --> D
    end

    subgraph "Environment Variables"
        O
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style L fill:#bfb,stroke:#333,stroke-width:2px
    style N fill:#fbb,stroke:#333,stroke-width:2px
    style M fill:#fbb,stroke:#333,stroke-width:2px
    style O fill:#bbf,stroke:#333,stroke-width:2px
```

## Component Relationships

```mermaid
flowchart LR
    A[next.config.ts] -->|Configures| B[Build Process]
    C[.github/workflows/deploy.yml] -->|Executes| B
    D[GitHub Secrets] -->|Provides Data| C
    B -->|Produces| E[Deployment Process]
    F[GitHub Pages Settings] -->|Enables| E
    E -->|Publishes| G[Live Website]

    style A fill:#fbb,stroke:#333,stroke-width:2px
    style C fill:#fbb,stroke:#333,stroke-width:2px
    style D fill:#bbf,stroke:#333,stroke-width:2px
    style G fill:#bfb,stroke:#333,stroke-width:2px
```

## File Structure

```mermaid
flowchart TD
    A[GCMS Repository] --> B[symphony-portal/]
    A --> C[.github/]
    C --> D[workflows/]
    D --> E[deploy.yml]
    B --> F[next.config.ts]
    B --> G[package.json]
    B --> H[src/]
    B --> I[public/]
    B --> J[.env.local]

    style E fill:#fbb,stroke:#333,stroke-width:2px
    style F fill:#fbb,stroke:#333,stroke-width:2px
    style J fill:#bbf,stroke:#333,stroke-width:2px
```

## Environment Variables Flow

```mermaid
flowchart LR
    A[.env.local] -->|Local Development| B[Next.js App]
    C[GitHub Secrets] -->|Production Deployment| D[GitHub Actions]
    D -->|Build Process| B
    B --> E[Static Export]
    E --> F[GitHub Pages]

    style A fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
    style F fill:#bfb,stroke:#333,stroke-width:2px
```

## How to Use This Diagram

You can view this diagram in any Markdown viewer that supports Mermaid diagrams, such as:

1. GitHub (when viewing the markdown file)
2. VS Code with the Mermaid extension
3. Online Mermaid editors like [Mermaid Live Editor](https://mermaid.live/)

To make changes to the diagram:
1. Copy the code between the triple backticks
2. Paste it into a Mermaid editor
3. Make your changes
4. Export or save the updated diagram
